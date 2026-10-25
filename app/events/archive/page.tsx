"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";

export default function RejoiceArchive() {
  const [archiveEvents, setArchiveEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArchive = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // STRICT FILTER: Only REJOICE and Past events
        const filtered = eventsData.filter((e: any) => e.eventType === "REJOICE" && e.status === "Past");
        
        // Sort by date (newest first)
        filtered.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setArchiveEvents(filtered);
      } catch (error) {
        console.error("Error fetching archive:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArchive();
  }, []);

  return (
    <div style={{ minHeight: "100vh", paddingTop: "140px", paddingBottom: "80px" }}>
      <div className="container">
        
        {/* HEADER */}
        <div className="section-title">
          <h2>REJOICE ARCHIVE</h2>
          <p>Relive the glory of past editions</p>
        </div>

        {/* BACK BUTTON */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <Link href="/events" className="btn btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <i className="fas fa-arrow-left"></i> Back to Upcoming Events
          </Link>
        </div>

        {/* ARCHIVE LIST */}
        {loading ? (
          <p style={{ textAlign: "center", color: "var(--light)" }}>Loading archive...</p>
        ) : archiveEvents.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--light)" }}>No past REJOICE editions found.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "60px", maxWidth: "1100px", margin: "0 auto" }}>
            {archiveEvents.map((event) => (
              <div key={event.id} className="glass-dark" style={{ borderRadius: "24px", overflow: "hidden" }}>
                
                {/* HEADER AREA */}
                <div style={{ padding: "40px", borderBottom: "1px solid rgba(245, 166, 35, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "2.2rem", color: "var(--primary)", margin: 0 }}>
                      {event.title}
                    </h3>
                    <p style={{ color: "var(--secondary)", fontWeight: "bold", fontSize: "1.2rem", margin: "8px 0 0 0" }}>
                      Theme: {event.theme}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontWeight: "bold", color: "var(--light)" }}>
                      <i className="fas fa-calendar-alt" style={{ color: "var(--primary)", marginRight: "10px" }}></i> 
                      {event.date}
                    </p>
                    <p style={{ margin: "5px 0 0 0", color: "#A89F91", fontSize: "0.9rem" }}>
                      <i className="fas fa-map-marker-alt" style={{ color: "var(--primary)", marginRight: "10px" }}></i>
                      {event.location}
                    </p>
                  </div>
                </div>

                {/* PHOTOS GRID (Max 8) */}
                <div style={{ padding: "30px" }}>
                  {event.galleryUrls && event.galleryUrls.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "15px" }}>
                      {event.galleryUrls.map((url: string, index: number) => (
                        <div key={index} style={{ borderRadius: "12px", overflow: "hidden", aspectRatio: "1/1", border: "1px solid rgba(255,255,255,0.05)" }}>
                          <img 
                            src={url} 
                            alt={`${event.title} Photo ${index + 1}`} 
                            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
                            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "#A89F91", textAlign: "center", fontStyle: "italic", padding: "20px" }}>
                      No photos uploaded for this edition yet.
                    </p>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}