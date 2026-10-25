"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EditEvent() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");
  const [eventType, setEventType] = useState("REJOICE");
  const [status, setStatus] = useState("Upcoming");
  
  const [currentFlyerUrl, setCurrentFlyerUrl] = useState("");
  const [newFlyer, setNewFlyer] = useState<File | null>(null);

  // NEW: State for Archive Photos
  const [currentGallery, setCurrentGallery] = useState<string[]>([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState<FileList | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "events", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setTheme(data.theme || "");
          setDate(data.date || "");
          setTime(data.time || "");
          setLocation(data.location || "");
          setDescription(data.description || "");
          setWhatsappLink(data.whatsappLink || "");
          setEventType(data.eventType || "REJOICE");
          setStatus(data.status || "Upcoming");
          setCurrentFlyerUrl(data.flyerUrl || "");
          setCurrentGallery(data.galleryUrls || []);
        } else {
          setError("Event not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load event.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
      { method: "POST", body: formData }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Upload failed");
    return data.secure_url;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setIsSaving(true);
    setError("");

    try {
      let finalFlyerUrl = currentFlyerUrl;
      if (newFlyer) {
        setStatusText("Uploading New Flyer...");
        finalFlyerUrl = await uploadToCloudinary(newFlyer);
      }

      // NEW: Upload new archive photos if selected
      let finalGallery = [...currentGallery];
      if (newGalleryFiles && newGalleryFiles.length > 0) {
        if (newGalleryFiles.length > 8) {
          throw new Error("You can only upload a maximum of 8 archive photos.");
        }
        
        setStatusText("Uploading Archive Photos...");
        for (let i = 0; i < newGalleryFiles.length; i++) {
          const url = await uploadToCloudinary(newGalleryFiles[i]);
          finalGallery.push(url);
        }
      }

      setStatusText("Saving Changes...");
      const docRef = doc(db, "events", id);
      await updateDoc(docRef, {
        title,
        theme,
        date,
        time,
        location,
        description,
        whatsappLink,
        eventType,
        status,
        flyerUrl: finalFlyerUrl,
        galleryUrls: finalGallery, // Save the array of photos
      });

      alert("Event updated successfully!");
      router.push("/admin/manage-events");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save.");
    } finally {
      setIsSaving(false);
      setStatusText("");
    }
  };

  if (loading) return <div className="admin-layout" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>Loading Event...</div>;

  return (
    <div className="admin-layout">
      <div className="admin-container" style={{ maxWidth: "800px" }}>
        
        <div className="admin-header">
          <div className="admin-title-group">
            <h1>EDIT EVENT</h1>
          </div>
          <Link href="/admin/manage-events" className="admin-btn admin-btn-secondary">Cancel</Link>
        </div>

        {error && <div style={{ backgroundColor: "rgba(255,0,0,0.1)", color: "#ff4d4d", padding: "15px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #ff4d4d" }}>{error}</div>}

        <div className="admin-card">
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <div className="admin-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="admin-form-group">
                <label>Event Type</label>
                <select className="admin-input" value={eventType} onChange={(e) => setEventType(e.target.value)}>
                  <option value="REJOICE">REJOICE (Goes to Archive)</option>
                  <option value="General">General Event</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label>Status</label>
                <select className="admin-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Past">Past (Show in Archive)</option>
                </select>
              </div>
            </div>

            <div className="admin-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="admin-form-group">
                <label>Event Title</label>
                <input type="text" className="admin-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="admin-form-group">
                <label>Theme</label>
                <input type="text" className="admin-input" value={theme} onChange={(e) => setTheme(e.target.value)} />
              </div>
            </div>

            <div className="admin-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
              <div className="admin-form-group">
                <label>Date</label>
                <input type="date" className="admin-input" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div className="admin-form-group">
                <label>Time</label>
                <input type="time" className="admin-input" value={time} onChange={(e) => setTime(e.target.value)} required />
              </div>
              <div className="admin-form-group">
                <label>Location</label>
                <input type="text" className="admin-input" value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Description</label>
              <textarea className="admin-input" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} />
            </div>

            <div className="admin-form-group">
              <label>WhatsApp Group Link</label>
              <input type="url" className="admin-input" value={whatsappLink} onChange={(e) => setWhatsappLink(e.target.value)} />
            </div>

            <div className="admin-form-group">
              <label>Replace Flyer (Optional)</label>
              <input type="file" accept="image/*" onChange={(e) => setNewFlyer(e.target.files ? e.target.files[0] : null)} style={{ color: "var(--dark)" }} />
            </div>

            {/* NEW: Archive Photos Section */}
            <div style={{ backgroundColor: "rgba(0, 51, 160, 0.05)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(0, 51, 160, 0.1)" }}>
              <h3 style={{ color: "var(--secondary)", fontSize: "1.1rem", marginBottom: "10px" }}>Archive Photos ({currentGallery.length}/8)</h3>
              <p style={{ fontSize: "0.85rem", color: "#64748B", marginBottom: "15px" }}>Upload up to 8 photos to be displayed on the REJOICE Archive page for this edition.</p>
              
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={(e) => setNewGalleryFiles(e.target.files)} 
                style={{ color: "var(--dark)", display: "block", width: "100%" }} 
              />
              
              {currentGallery.length > 0 && (
                <div style={{ marginTop: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {currentGallery.map((url, i) => (
                    <img key={i} src={url} alt={`Archive ${i}`} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px", border: "1px solid #ccc" }} />
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={isSaving} className="admin-btn admin-btn-primary" style={{ marginTop: "10px" }}>
              {isSaving ? statusText : "SAVE CHANGES"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}