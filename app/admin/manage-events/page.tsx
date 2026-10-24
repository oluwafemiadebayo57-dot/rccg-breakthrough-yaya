"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ManageEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/admin/login");
        return;
      }
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        eventsData.sort((a: any, b: any) => {
           const dateA = a.createdAt?.toMillis() || 0;
           const dateB = b.createdAt?.toMillis() || 0;
           return dateB - dateA;
        });
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete the event "${title}"?`)) {
      try {
        await deleteDoc(doc(db, "events", id));
        setEvents(events.filter(event => event.id !== id));
        alert("Event deleted successfully!");
      } catch (error) {
        console.error("Error deleting:", error);
        alert("Failed to delete event.");
      }
    }
  };

  return (
    <div className="admin-layout">
      <div className="admin-container">
        
        <div className="admin-header">
          <div className="admin-title-group">
            <h1>MANAGE EVENTS</h1>
          </div>
          <Link href="/admin" className="admin-btn admin-btn-secondary">Back to Dashboard</Link>
        </div>

        {loading ? (
          <p>Loading events...</p>
        ) : events.length === 0 ? (
          <p>No events found.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {events.map((event) => (
              <div key={event.id} className="admin-list-item">
                
                <div className="admin-list-info">
                  <img src={event.flyerUrl} alt={event.title} className="admin-list-img" />
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#FFAE00" }}>{event.title}</h3>
                    <p style={{ margin: 0, color: "#888", fontSize: "0.85rem" }}>{event.date} | {event.location}</p>
                  </div>
                </div>

                <div className="admin-list-actions">
                  <Link href={`/admin/edit-event/${event.id}`} className="admin-btn admin-btn-secondary" style={{ padding: "8px 16px" }}>
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(event.id, event.title)} className="admin-btn admin-btn-danger" style={{ padding: "8px 16px" }}>
                    Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}