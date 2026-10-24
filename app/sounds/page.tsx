"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import "../../styles/events-style.css"; // Just to ensure basic button styles apply

export default function SoundsLibrary() {
  const [releases, setReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllReleases = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "releases"));
        const releasesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort by newest first
        releasesData.sort((a: any, b: any) => {
           const dateA = a.createdAt?.toMillis() || 0;
           const dateB = b.createdAt?.toMillis() || 0;
           return dateB - dateA;
        });
        
        setReleases(releasesData);
      } catch (error) {
        console.error("Error fetching releases:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllReleases();
  }, []);

  // Helper function to check if a release date has passed
  const isReleased = (dateString: string) => {
    if (!dateString) return true; // If no date is set, assume it's released
    return new Date(dateString).getTime() <= new Date().getTime();
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#040404", color: "white", paddingTop: "150px", paddingBottom: "100px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <h1 style={{ fontFamily: "Cinzel, serif", color: "#FFAE00", fontSize: "3rem", marginBottom: "10px" }}>
            ANCIENT SOUNDS
          </h1>
          <p style={{ color: "#FF5900", fontSize: "1.2rem", letterSpacing: "1px" }}>
            The complete library of Qôl Asaph releases
          </p>
          <div style={{ width: "80px", height: "3px", background: "linear-gradient(90deg, #FFAE00, #FF5900)", margin: "20px auto", borderRadius: "2px" }}></div>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#FFF6E1" }}>Loading sounds...</p>
        ) : releases.length === 0 ? (
          <p style={{ textAlign: "center", color: "#FFF6E1" }}>No sounds have been released yet. Check back soon!</p>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
            gap: "30px" 
          }}>
            {releases.map((release) => {
              const released = isReleased(release.releaseDate);

              return (
                <div 
                  key={release.id} 
                  style={{ 
                    backgroundColor: "rgba(255,255,255,0.05)", 
                    borderRadius: "20px", 
                    overflow: "hidden", 
                    border: "1px solid rgba(255,174,0,0.2)",
                    transition: "transform 0.3s ease",
                    display: "flex",
                    flexDirection: "column"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  {/* Album Cover */}
                  <div style={{ width: "100%", aspectRatio: "1/1", backgroundColor: "#111" }}>
                    <img 
                      src={release.coverUrl} 
                      alt={release.title} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  </div>

                  {/* Details */}
                  <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h3 style={{ fontFamily: "Cinzel, serif", color: "#FFAE00", fontSize: "1.4rem", marginBottom: "5px" }}>
                      {release.title}
                    </h3>
                    <p style={{ color: "#888", fontSize: "0.85rem", marginBottom: "20px" }}>
                      {release.releaseDate ? new Date(release.releaseDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "TBA"}
                    </p>

                    <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
                      
                      {/* If NOT released yet, show Pre-Save */}
                      {!released && release.preSaveLink && (
                        <a href={release.preSaveLink} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: "#FF5900", color: "#FFF", padding: "10px", borderRadius: "8px", textAlign: "center", fontWeight: "bold", textDecoration: "none" }}>
                          PRE-SAVE NOW
                        </a>
                      )}

                      {/* If RELEASED, show Stream and Download */}
                      {released && (
                        <>
                          {release.streamLink && (
                            <a href={release.streamLink} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: "#FFAE00", color: "#040404", padding: "10px", borderRadius: "8px", textAlign: "center", fontWeight: "bold", textDecoration: "none" }}>
                              🎵 STREAM NOW
                            </a>
                          )}
                          {release.audioUrl && (
                            <a href={release.audioUrl} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: "#222", color: "#FFF", border: "1px solid #444", padding: "10px", borderRadius: "8px", textAlign: "center", fontWeight: "bold", textDecoration: "none" }}>
                              <i className="fas fa-download"></i> DOWNLOAD
                            </a>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}