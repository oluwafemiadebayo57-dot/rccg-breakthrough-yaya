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
        // Sort by newest first
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
    const confirmDelete = window.confirm(`Are you sure you want to delete the message from "${name}"?`);
    
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "messages", id));
        setMessages(messages.filter(msg => msg.id !== id));
      } catch (error) {
        console.error("Error deleting message:", error);
        alert("Failed to delete message.");
      }
    }
  };

  return (
    <div className="admin-layout">
      <div className="admin-container">
        
        <div className="admin-header">
          <div className="admin-title-group">
            <h1>INBOX</h1>
            <p>Messages from the contact form</p>
          </div>
          <Link href="/admin" className="admin-btn admin-btn-secondary">Back to Dashboard</Link>
        </div>

        {loading ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p>No messages found.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {messages.map((msg) => (
              <div key={msg.id} className="admin-card">
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "15px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "15px", marginBottom: "15px" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#FFAE00" }}>{msg.subject || "No Subject"}</h3>
                    <p style={{ margin: "5px 0 0 0", color: "#ccc", fontSize: "0.9rem" }}>
                      From: <strong>{msg.name}</strong> ({msg.email}) {msg.phone && `| ${msg.phone}`}
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

                <p style={{ margin: 0, lineHeight: "1.6", color: "#eee" }}>{msg.message}</p>
                
                <p style={{ margin: "15px 0 0 0", color: "#666", fontSize: "0.8rem", textAlign: "right" }}>
                  {msg.createdAt ? new Date(msg.createdAt.toMillis()).toLocaleString() : "Just now"}
                </p>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}