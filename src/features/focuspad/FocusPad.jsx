import React, { useState, useEffect, useRef } from "react";
import * as noteService from "../../services/noteService";
import "../../styles/focuspad.css";

export default function FocusPad({ userId }) {
  const [notes, setNotes] = useState([]);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [title, setTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  
  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const editorRef = useRef(null);

  // 1. Real-time sync
  useEffect(() => {
    if (!userId) return;
    
    setIsLoading(true);
    const unsubscribe = noteService.syncNotes(userId, (syncedNotes) => {
      setNotes(syncedNotes);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMsg || error) {
      const timer = setTimeout(() => {
        setSuccessMsg("");
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, error]);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const handleSelectNote = (note) => {
    setCurrentNoteId(note.noteId);
    setTitle(note.title);
    if (editorRef.current) {
      editorRef.current.innerHTML = note.content || "";
    }
    setError(null);
  };

  const handleNewNote = () => {
    setCurrentNoteId(null);
    setTitle("");
    if (editorRef.current) editorRef.current.innerHTML = "";
    setError(null);
  };

  const handleCopy = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText;
    navigator.clipboard.writeText(text);
    setSuccessMsg("Copied to clipboard!");
  };

  const handleSave = async () => {
    const contentHTML = editorRef.current?.innerHTML || "";
    const cleanTitle = title.trim();
    
    // Validation
    if (!contentHTML.trim() && !cleanTitle) {
      setError("Please add a title or content before saving.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (currentNoteId) {
        await noteService.editNote(currentNoteId, contentHTML, cleanTitle, userId);
        setSuccessMsg("Note updated successfully!");
      } else {
        const newId = await noteService.createNote(userId, contentHTML, cleanTitle);
        setCurrentNoteId(newId);
        setSuccessMsg("New note created successfully!");
      }
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save note. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    setNoteToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;
    try {
      await noteService.deleteNote(noteToDelete, userId);
      if (currentNoteId === noteToDelete) handleNewNote();
      setSuccessMsg("Note deleted.");
    } catch (err) {
      setError("Failed to delete note.");
    } finally {
      setShowDeleteModal(false);
      setNoteToDelete(null);
    }
  };

  const handleAI = async () => {
    const plainText = editorRef.current?.innerText;
    if (!plainText?.trim()) {
      setError("Please write something to summarize.");
      return;
    }

    setIsSummarizing(true);
    try {
      const summary = await noteService.summarizeNoteAI(plainText);
      const summaryHTML = `<br/><div class="ai-summary-block"><strong>✨ AI SUMMARY:</strong><br/>${summary}</div>`;
      if (editorRef.current) editorRef.current.innerHTML += summaryHTML;
      setSuccessMsg("Summary generated!");
    } catch (err) {
      setError("AI Summary failed.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="focuspad-root">
      {/* Feedback Banner */}
      {(successMsg || error) && (
        <div className={`fp-banner ${error ? "error" : "success"}`} style={{
          position: 'fixed', top: '20px', right: '20px', padding: '10px 20px',
          backgroundColor: error ? '#ffdddd' : '#ddffdd',
          color: error ? '#d8000c' : '#4f8a10',
          borderRadius: '4px', zIndex: 1000, boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}>
          {error || successMsg}
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100
        }}>
          <div className="modal-content" style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
            <h3>Delete Note?</h3>
            <p>Are you sure you want to delete this note?</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button onClick={confirmDelete} style={{ background: 'red', color: 'white' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <aside className="fp-sidebar">
        <div className="fp-sidebar-header">
          <input
            type="text"
            placeholder="Search notes..."
            className="fp-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="fp-btn-new" onClick={handleNewNote}>
            + New Note
          </button>
        </div>
        <div className="fp-note-list">
          {filteredNotes.map((note) => (
            <div
              key={note.noteId}
              className={`fp-note-item ${
                currentNoteId === note.noteId ? "active" : ""
              }`}
              onClick={() => handleSelectNote(note)}
            >
              <div className="fp-note-content">
                <strong>{note.title || "Untitled Note"}</strong>
                <p>
                  {note.content.replace(/<[^>]*>/g, "").substring(0, 35)}
                </p>
              </div>
              <button
                className="fp-del-btn"
                onClick={(e) => handleDelete(e, note.noteId)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </aside>

      <main className="fp-editor">
        <header className="fp-editor-nav">
          <div className="fp-toolbar-group">
            <button className="fp-tool-btn" onClick={() => execCommand("bold")}>
              <b>B</b>
            </button>
            <button
              className="fp-tool-btn"
              onClick={() => execCommand("italic")}
            >
              <i>I</i>
            </button>
            <button
              className="fp-tool-btn highlight"
              onClick={() => execCommand("hiliteColor", "#A2D2FF")}
            >
              Highlight
            </button>
            <button className="fp-tool-btn" onClick={handleCopy}>
              Copy
            </button>
            <div className="fp-divider"></div>
            <button
              className="fp-btn-ai"
              onClick={handleAI}
              disabled={isSummarizing}
            >
              {isSummarizing ? "Thinking..." : "✨ Summarize"}
            </button>
            <button className="fp-btn-save" onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </header>

        <div className="fp-canvas">
          <input
            type="text"
            className="fp-title-input"
            placeholder="Untitled Note"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div
            className="fp-content-editable"
            contentEditable="true"
            ref={editorRef}
            data-placeholder="Start typing your focus plan..."
          ></div>
        </div>
      </main>
    </div>
  );
}
