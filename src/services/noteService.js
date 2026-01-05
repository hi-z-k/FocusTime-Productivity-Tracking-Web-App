import { database } from "./firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const notesRef = (userId) => collection(database, "users", userId, "notes");
const noteDoc = (userId, noteId) =>
  doc(database, "users", userId, "notes", noteId);

export const syncNotes = (userId, callback) => {
  if (!userId) return () => {};
  const q = query(notesRef(userId), orderBy("timestamp", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const notes = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          noteId: d.id,
          userId,
          title: data.title || "",
          content: data.content || "",
          timestamp: data.timestamp || null,
        };
      });
      callback(notes);
    },
    (error) => {
      console.error("Error syncing notes:", error);
    }
  );
};

export const fetchNotesByUser = async (userId) => {
  if (!userId) return [];
  const snapshot = await getDocs(notesRef(userId));
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      noteId: d.id,
      userId,
      title: data.title || "",
      content: data.content || "",
      timestamp: data.timestamp || null,
    };
  });
};

export const createNote = async (userId, content, title) => {
  if (!userId) return null;
  const docRef = await addDoc(notesRef(userId), {
    title: title || "",
    content: content || "",
    timestamp: serverTimestamp(),
  });
  return docRef.id;
};

export const editNote = async (noteId, content, title, userId) => {
  if (!userId || !noteId) return;
  await updateDoc(noteDoc(userId, noteId), {
    title: title || "",
    content: content || "",
    timestamp: serverTimestamp(),
  });
};

export const deleteNote = async (noteId, userId) => {
  if (!userId || !noteId) return;
  await deleteDoc(noteDoc(userId, noteId));
};

export const summarizeNoteAI = async (content) => {
  try {
    const response = await fetch("YOUR_BACKEND_URL/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: content }),
    });
    if (!response.ok) throw new Error("AI Request Failed");
    const data = await response.json();
    return data.summary;
  } catch (error) {
    return "Error connecting to AI. Please check your connection.";
  }
};
