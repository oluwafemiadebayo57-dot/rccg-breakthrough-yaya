"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminInbox() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/admin/login");
        return;
      }
      try {
        const querySnapshot = await getDocs(collection(db, "messages"));
        const messagesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        messagesData.sort((a: any, b: any) => {
           const dateA = a.createdAt?.toMillis() || 0;
           const dateB = b.createdAt?.toMillis() || 0;
           return dateB - dateA;
        });
        setMessages(messagesData);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete the message from "${name}"?`)) {
      try {
        await deleteDoc(doc(db, "messages", id));
        setMessages(messages.filter(msg => msg.id !== id));
      } catch (error) {
        alert("Failed to delete message.");
      }
    }
  };

  // Helper to format the timestamp beautifully
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "Just now";
    const date = new Date(timestamp.toMillis());
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="admin-layout">
      <div className="admin-container">
        
        <div className="admin-header">
          <div className="admin-title-group">
            <h1>MESSAGES INBOX</h1>
            <p>Messages submitted via the contact page</p>
          </div>
          <Link href="/admin" className="admin-btn admin-btn-secondary">Back to Dashboard</Link>
        </div>

        {loading ? (
          <p style={{ color: "var(--light)" }}>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p style={{ color: "var(--light)" }}>No messages found.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {messages.map((msg) => (
              <div key={msg.id} className="admin-card">
                
                {/* Header: Name, Email, and Delete Button */}
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "flex-start", 
                  flexWrap: "wrap", 
                  gap: "15px", 
                  borderBottom: "1px solid var(--glass-border)", // Changed from dark black to gold glass
                  paddingBottom: "15px", 
                  marginBottom: "20px" 
                }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.3rem", color: "var(--primary)", fontFamily: "var(--font-heading)" }}>
                      {msg.name}
                    </h3>
                    <p style={{ margin: "5px 0 0 0", color: "#A89F91", fontSize: "0.9rem" }}>
                      {msg.email}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleDelete(msg.id, msg.name)}
                    className="admin-btn admin-btn-danger"
                    style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                  >
                    Delete
                  </button>
                </div>

                {/* Message Body */}
                <p style={{ margin: 0, lineHeight: "1.8", color: "var(--light)", fontSize: "1.05rem" }}>
                  {msg.message}
                </p>
                
                {/* Beautiful Timestamp */}
                <p style={{ margin: "20px 0 0 0", color: "var(--secondary)", fontSize: "0.85rem", textAlign: "right", fontWeight: "bold" }}>
                  {formatTimestamp(msg.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}