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
      if (!user) { router.push("/admin/login"); return; }
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        eventsData.sort((a: any, b: any) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
        setEvents(eventsData);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    });
    return () => unsubscribe();
  }, [router]);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This will also delete all registrations for this event.`)) {
      try {
        await deleteDoc(doc(db, "events", id));
        setEvents(events.filter(event => event.id !== id));
        alert("Event deleted.");
      } catch (error) { console.error(error); alert("Failed to delete."); }
    }
  };

  // Helper to format the date beautifully
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="admin-layout">
      <div className="admin-container">
        
        <div className="admin-header">
          <div className="admin-title-group">
            <h1>MANAGE EVENTS</h1>
            <p>View, edit, and check registrations</p>
          </div>
          <Link href="/admin" className="admin-btn admin-btn-secondary">Back to Dashboard</Link>
        </div>

        {loading ? (
          <p style={{ color: "var(--light)" }}>Loading events...</p>
        ) : events.length === 0 ? (
          <p style={{ color: "var(--light)" }}>No events found.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {events.map((event) => (
              <div key={event.id} className="admin-list-item">
                
                <div className="admin-list-info">
                  {/* Fallback just in case the image is missing */}
                  {event.flyerUrl ? (
                    <img src={event.flyerUrl} alt={event.title} className="admin-list-img" />
                  ) : (
                    <div className="admin-list-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', textAlign: 'center', padding: '5px' }}>No Image</div>
                  )}
                  <div>
                    <h3 style={{ margin: "0 0 5px 0", fontSize: "1.2rem", color: "var(--primary)", fontFamily: "var(--font-heading)" }}>{event.title}</h3>
                    {/* Formatted Date & Dark mode friendly text color */}
                    <p style={{ margin: 0, color: "#A89F91", fontSize: "0.9rem" }}>
                      {formatDate(event.date)} | {event.eventType} ({event.status})
                    </p>
                  </div>
                </div>

                <div className="admin-list-actions">
                  <Link href={`/admin/registrations/${event.id}`} className="admin-btn admin-btn-primary" style={{ padding: "8px 16px", backgroundColor: "var(--primary)", color: "var(--dark)" }}>
                    View Registrations
                  </Link>
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