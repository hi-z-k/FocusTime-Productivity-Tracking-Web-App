import React, { useState, useEffect, useRef } from "react";
import * as noteService from "../../services/noteService";
import "../../styles/focuspad.css";

export default function FocusPad({ userId }) {
  const [notes, setNotes] = useState([]);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [title, setTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  const editorRef = useRef(null);

  useEffect(() => {
    loadNotes();
  }, [userId]);

  const loadNotes = async () => {
    const data = await noteService.fetchNotesByUser(userId);
    setNotes(data);
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const handleSelectNote = (note) => {
    setCurrentNoteId(note.noteId);
    setTitle(note.title);
    // Use innerHTML because we are storing formatted text
    if (editorRef.current) {
      editorRef.current.innerHTML = note.content || "";
    }
  };

  const handleNewNote = () => {
    setCurrentNoteId(null);
    setTitle("");
    if (editorRef.current) editorRef.current.innerHTML = "";
  };

  const handleCopy = () => {
    const text = editorRef.current.innerText;
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleSave = async () => {
    const contentHTML = editorRef.current.innerHTML;
    if (!contentHTML.trim() && !title.trim()) return;

    if (currentNoteId) {
      await noteService.editNote(currentNoteId, contentHTML, title);
    } else {
      const newId = await noteService.createNote(userId, contentHTML, title);
      setCurrentNoteId(newId);
    }
    loadNotes();
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Delete this note?")) {
      await noteService.deleteNote(id);
      if (currentNoteId === id) handleNewNote();
      loadNotes();
    }
  };

  const handleAI = async () => {
    const plainText = editorRef.current.innerText;
    if (!plainText) return;
    
    setIsSummarizing(true);
    const summary = await noteService.summarizeNoteAI(plainText);
    
    // Append the summary as a styled block
    const summaryHTML = `<br/><div class="ai-summary-block"><strong>✨ AI SUMMARY:</strong><br/>${summary}</div>`;
    editorRef.current.innerHTML += summaryHTML;
    setIsSummarizing(false);
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="focuspad-root">
      <aside className="fp-sidebar">
        <div className="fp-sidebar-header">
          <input
            type="text"
            placeholder="Search notes..."
            className="fp-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="fp-btn-new" onClick={handleNewNote}>+ New Note</button>
        </div>
        <div className="fp-note-list">
          {filteredNotes.map((note) => (
            <div
              key={note.noteId}
              className={`fp-note-item ${currentNoteId === note.noteId ? "active" : ""}`}
              onClick={() => handleSelectNote(note)}
            >
              <div className="fp-note-content">
                <strong>{note.title || "Untitled Note"}</strong>
                <p>{editorRef.current ? note.content.replace(/<[^>]*>/g, '').substring(0, 35) : ""}</p>
              </div>
              <button className="fp-del-btn" onClick={(e) => handleDelete(e, note.noteId)}>×</button>
            </div>
          ))}
        </div>
      </aside>

      <main className="fp-editor">
        <header className="fp-editor-nav">
          <div className="fp-toolbar-group">
            <button className="fp-tool-btn" onClick={() => execCommand("bold")}><b>B</b></button>
            <button className="fp-tool-btn" onClick={() => execCommand("italic")}><i>I</i></button>
            <button className="fp-tool-btn highlight" onClick={() => execCommand("hiliteColor", "#A2D2FF")}>Highlight</button>
            <button className="fp-tool-btn" onClick={handleCopy}>Copy</button>
            <div className="fp-divider"></div>
            <button className="fp-btn-ai" onClick={handleAI} disabled={isSummarizing}>
              {isSummarizing ? "Thinking..." : "✨ Summarize"}
            </button>
            <button className="fp-btn-save" onClick={handleSave}>Save</button>
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