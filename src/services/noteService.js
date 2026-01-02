const STORAGE_KEY = "focuspad_data";

// Internal helper to sync with browser storage
const getStorage = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
const saveToStorage = (notes) => localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));

export const fetchNotesByUser = async (userId) => {
  const allNotes = getStorage();
  return allNotes.filter(note => note.userId === userId);
};

export const createNote = async (userId, content, title) => {
  const allNotes = getStorage();
  const newNote = {
    noteId: Date.now().toString(),
    userId,
    title: title || "", // Allows placeholder to show if empty
    content,
    timestamp: new Date().toISOString(),
  };
  saveToStorage([newNote, ...allNotes]);
  return newNote.noteId;
};

export const editNote = async (noteId, content, title) => {
  const allNotes = getStorage();
  const updated = allNotes.map(n => 
    n.noteId === noteId ? { ...n, content, title, timestamp: new Date().toISOString() } : n
  );
  saveToStorage(updated);
};

export const deleteNote = async (noteId) => {
  const allNotes = getStorage();
  const filtered = allNotes.filter(n => n.noteId !== noteId);
  saveToStorage(filtered);
};


export const summarizeNoteAI = async (content) => {
  try {
    // This is the real call to your backend partner's server
    // They will create an endpoint at '/api/summarize'
    const response = await fetch("YOUR_BACKEND_URL/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: content }),
    });

    if (!response.ok) throw new Error("AI Request Failed");

    const data = await response.json();
    return data.summary; // The actual AI response
  } catch (error) {
    console.error("AI Error:", error);
    // Fallback if the API fails or is offline
    return "Error connecting to AI. Please check your connection.";
  }
};