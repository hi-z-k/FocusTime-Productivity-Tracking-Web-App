import React from "react";
import { markAsRead, clearAllNotifications } from "../../services/notificationService.js";

const NotificationItem = ({ note, userId }) => {
  const isRead = note.read;

  const currentItemStyle = {
    ...styles.item,
    backgroundColor: isRead ? "#f3f4f6" : "#eff6ff",
    borderLeft: isRead ? "4px solid #9ca3af" : "4px solid #3b82f6",
    filter: isRead ? "grayscale(100%)" : "none",
    opacity: isRead ? 0.7 : 1
  };

  const currentTextStyle = {
    ...styles.text,
    color: isRead ? "#6b7280" : "#1e293b",
    textDecoration: isRead ? "line-through" : "none"
  };

  return (
    <div style={currentItemStyle}>
      <div style={currentTextStyle}>{note.text}</div>
      <div style={styles.actionRow}>
        {!isRead && (
          <button 
            style={styles.readBtn}
            onClick={() => markAsRead(userId, note.id)}
          >
            Mark as Read
          </button>
        )}
      </div>
    </div>
  );
};

export default function NotificationList({ userId, notifications }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h3 style={styles.title}>Notifications</h3>
        {notifications.length > 0 && (
          <button 
            style={styles.clearAllBtn}
            onClick={() => clearAllNotifications(userId, notifications)}
          >
            Clear All
          </button>
        )}
      </div>
      <div style={styles.listContainer}>
        {notifications.length === 0 ? (
          <p style={styles.emptyState}>No notifications yet.</p>
        ) : (
          notifications.map((note) => (
            <NotificationItem key={note.id} note={note} userId={userId} />
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginTop: "20px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  title: { fontSize: "1.1rem", fontWeight: "700", color: "#111827", margin: 0 },
  clearAllBtn: { background: "none", border: "none", color: "#ef4444", fontSize: "0.8rem", cursor: "pointer", textDecoration: "underline" },
  listContainer: { maxHeight: "350px", overflowY: "auto", paddingRight: "4px" },
  item: { padding: "12px", borderRadius: "8px", marginBottom: "10px", display: "flex", flexDirection: "column", gap: "8px", border: "1px solid #e5e7eb", transition: "all 0.3s ease" },
  text: { fontSize: "0.9rem" },
  actionRow: { display: "flex", alignItems: "center" },
  readBtn: { padding: "4px 10px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "600", cursor: "pointer", border: "none", backgroundColor: "#3b82f6", color: "white" },
  emptyState: { textAlign: "center", color: "#9ca3af", fontSize: "0.9rem", padding: "20px 0" }
};