"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

const originalGallery = [
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566546/qa1.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566541/qa2.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566530/qa3.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566549/qa4.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566546/qa5.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566513/qa6.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566529/qa7.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566518/qa8.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566541/qa9.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566548/qa10.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566571/qa11.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566548/qa12.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566552/qa13.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566560/qa14.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566569/qa15.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566560/qa16.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566579/qa17.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566564/qa18.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566595/qa19.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566582/qa20.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566590/qa21.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566582/qa22.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566604/qa23.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566610/qa24.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566605/qa25.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566597/qa26.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566605/qa27.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566631/qa28.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566626/qa29.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566642/qa30.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566626/qa31.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566639/qa32.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566639/qa33.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566663/qa34.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566664/qa35.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566655/qa36.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566673/qa37.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566669/qa38.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566672/qa39.jpg",
  "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566689/qa40.jpg"
];

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRestoringEvent, setIsRestoringEvent] = useState(false);
  const [isRestoringGallery, setIsRestoringGallery] = useState(false);
  const [isRestoringElRoi, setIsRestoringElRoi] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push("/admin/login");
      else setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  const handleRestoreEvent = async () => {
    if (confirm("This will add QOL ASAPH 1.0 back to the database. Continue?")) {
      setIsRestoringEvent(true);
      try {
        await addDoc(collection(db, "events"), {
          title: "QOL ASAPH 1.0", subtitle: "The Inaugural Convergence", date: "July 23, 2026", location: "FUPRE, Warri, Delta State",
          description: "Qôl Asaph 1.0 marked our inaugural prophetic convergence and public commissioning into the ministerial responsibility entrusted to us by the Lord. What began quietly in a room at FUPRE in 2025 had now become a ministry being publicly stewarded. This gathering was a moment of divine encounter, ancient sounds, and prophetic worship.",
          flyerUrl: "https://res.cloudinary.com/izxlyyn5/image/upload/v1787566506/qa1.0.jpg", highlightVideoUrl: "https://res.cloudinary.com/izxlyyn5/video/upload/v1787569255/GOHP_HIGHLIGHT_1.mp4", createdAt: serverTimestamp(),
        });
        alert("Original event restored!");
      } catch (error) { console.error(error); alert("Failed."); } finally { setIsRestoringEvent(false); }
    }
  };

  const handleRestoreGallery = async () => {
    if (confirm("This will add all 40 original gallery images to the database. Continue?")) {
      setIsRestoringGallery(true);
      try {
        for (const url of originalGallery) {
          await addDoc(collection(db, "gallery"), { imageUrl: url, createdAt: serverTimestamp() });
        }
        alert("All 40 original gallery images restored!");
      } catch (error) { console.error(error); alert("Failed."); } finally { setIsRestoringGallery(false); }
    }
  };

  const handleRestoreElRoi = async () => {
    if (confirm("This will add the original EL-ROI release to your Sounds library. Continue?")) {
      setIsRestoringElRoi(true);
      try {
        await addDoc(collection(db, "releases"), {
          title: "EL-ROI", releaseDate: "2026-08-24T18:00", preSaveLink: "https://ditto.fm/elroi-the-god-who-sees-me-live", streamLink: "https://ditto.fm/elroi-the-god-who-sees-me-live", youtubeLink: "https://youtu.be/UeBfYM_UnOs",
          coverUrl: "https://res.cloudinary.com/izxlyyn5/image/upload/v1787320916/IMG_9731.jpg", audioUrl: "", createdAt: serverTimestamp(),
        });
        alert("EL-ROI successfully added!");
      } catch (error) { console.error(error); alert("Failed."); } finally { setIsRestoringElRoi(false); }
    }
  };

  if (loading) return <div className="admin-layout" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>Loading Dashboard...</div>;

  return (
    <div className="admin-layout">
      <div className="admin-container">
        
        <div className="admin-header">
          <div className="admin-title-group">
            <h1>ADMIN DASHBOARD</h1>
            <p>Welcome back, <strong>{user?.email}</strong></p>
          </div>
          <button onClick={handleLogout} className="admin-btn admin-btn-danger">Logout</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "25px" }}>
          
          {/* Card 1 */}
          <div className="admin-card">
            <h2 className="admin-card-title"><i className="fas fa-music"></i> Music & Releases</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link href="/admin/releases" className="admin-btn admin-btn-primary">+ Add New Release</Link>
              <Link href="/admin/manage" className="admin-btn admin-btn-secondary">Manage Releases</Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="admin-card">
            <h2 className="admin-card-title"><i className="fas fa-calendar-alt"></i> Events & Gallery</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link href="/admin/events" className="admin-btn admin-btn-primary">+ Add New Event</Link>
              <Link href="/admin/manage-events" className="admin-btn admin-btn-secondary">Manage Events</Link>
              <Link href="/admin/gallery" className="admin-btn admin-btn-secondary">Upload Gallery Image</Link>
              <Link href="/admin/manage-gallery" className="admin-btn admin-btn-secondary">Manage Gallery</Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="admin-card">
            <h2 className="admin-card-title"><i className="fas fa-envelope"></i> Communication</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link href="/admin/messages" className="admin-btn admin-btn-primary">Read Messages (Inbox)</Link>
              <Link href="/admin/settings" className="admin-btn admin-btn-secondary">Edit Site Text</Link>
            </div>
          </div>
        </div>

        {/* Utilities */}
        <div style={{ marginTop: "50px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "30px" }}>
          <h3 style={{ fontSize: "0.85rem", color: "#666", marginBottom: "15px", textTransform: "uppercase", letterSpacing: "2px" }}>System Utilities</h3>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <button onClick={handleRestoreElRoi} disabled={isRestoringElRoi} className="admin-btn admin-btn-secondary" style={{ fontSize: "0.8rem", padding: "8px 16px" }}>{isRestoringElRoi ? "Restoring..." : "Restore EL-ROI Release"}</button>
            <button onClick={handleRestoreEvent} disabled={isRestoringEvent} className="admin-btn admin-btn-secondary" style={{ fontSize: "0.8rem", padding: "8px 16px" }}>{isRestoringEvent ? "Restoring..." : "Restore QOL ASAPH 1.0 Event"}</button>
            <button onClick={handleRestoreGallery} disabled={isRestoringGallery} className="admin-btn admin-btn-secondary" style={{ fontSize: "0.8rem", padding: "8px 16px" }}>{isRestoringGallery ? "Restoring..." : "Restore 40 Images"}</button>
          </div>
        </div>

      </div>
    </div>
  );
}