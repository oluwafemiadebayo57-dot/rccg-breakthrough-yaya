"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingFlyer, setUploadingFlyer] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    theme: "",
    date: "",
    time: "",
    location: "",
    flyerUrl: "",
    whatsappLink: "",
    liveLink: "", // <-- ADDED LIVE LINK
    eventType: "REJOICE",
    status: "Upcoming"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Cloudinary Upload Logic
  const handleFlyerUpload = async (file: File) => {
    setUploadingFlyer(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "qol_asaph_unsigned");
      
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "izxlyyn5"}/image/upload`, {
        method: "POST",
        body: data
      });
      
      const result = await res.json();
      if (result.secure_url) {
        setFormData({ ...formData, flyerUrl: result.secure_url });
      } else {
        alert("Failed to upload image. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading image.");
    } finally {
      setUploadingFlyer(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "events"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      alert("Event created successfully!");
      router.push("/admin/manage-events");
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <div className="admin-container" style={{ maxWidth: "800px" }}>
        
        {/* Header */}
        <div className="admin-header">
          <div className="admin-title-group">
            <h1>ADD NEW EVENT</h1>
            <p>Create a new upcoming event or archive a past one</p>
          </div>
          <Link href="/admin" className="admin-btn admin-btn-secondary">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Form Card */}
        <div className="admin-card">
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* Responsive Grid: Stacks on mobile, 2 columns on desktop */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
              <div className="admin-form-group">
                <label>Event Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="admin-input" placeholder="e.g. Youth Convention" />
              </div>
              
              <div className="admin-form-group">
                <label>Theme *</label>
                <input type="text" name="theme" value={formData.theme} onChange={handleChange} required className="admin-input" placeholder="e.g. Arise and Shine" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
              <div className="admin-form-group">
                <label>Date *</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required className="admin-input" />
              </div>
              
              <div className="admin-form-group">
                <label>Time *</label>
                <input type="text" name="time" value={formData.time} onChange={handleChange} required className="admin-input" placeholder="e.g. 5:00 PM" />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Location *</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required className="admin-input" placeholder="e.g. RCCG Breakthrough Cathedral, Akure" />
            </div>

            {/* File Upload for Flyer */}
            <div className="admin-form-group">
              <label>Event Flyer (Upload Image)</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => e.target.files && handleFlyerUpload(e.target.files[0])} 
                className="admin-input" 
                style={{ padding: "10px", cursor: "pointer" }} 
              />
              {uploadingFlyer && <p style={{ color: "var(--primary)", marginTop: "10px", fontSize: "0.9rem" }}>Uploading flyer, please wait...</p>}
              
              {/* Live Preview of the uploaded image */}
              {formData.flyerUrl && (
                <div style={{ marginTop: "15px" }}>
                  <p style={{ fontSize: "0.85rem", color: "#A89F91", marginBottom: "5px" }}>Preview:</p>
                  <img 
                    src={formData.flyerUrl} 
                    alt="Flyer Preview" 
                    style={{ width: "100%", maxWidth: "300px", borderRadius: "8px", border: "1px solid var(--glass-border)" }} 
                  />
                </div>
              )}
            </div>

            <div className="admin-form-group">
              <label>WhatsApp Group Link</label>
              <input type="url" name="whatsappLink" value={formData.whatsappLink} onChange={handleChange} className="admin-input" placeholder="https://chat.whatsapp.com/..." />
            </div>

            {/* ADDED: Live Link */}
            <div className="admin-form-group">
              <label>Live Stream Link (YouTube, Facebook, etc.)</label>
              <input type="url" name="liveLink" value={formData.liveLink} onChange={handleChange} className="admin-input" placeholder="https://youtube.com/live/..." />
              <p style={{ fontSize: "0.75rem", color: "#A89F91", marginTop: "5px" }}>Leave blank if there is no live stream. Add this once the event starts.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
              <div className="admin-form-group">
                <label>Event Type *</label>
                <select name="eventType" value={formData.eventType} onChange={handleChange} className="admin-input">
                  <option value="REJOICE">REJOICE</option>
                  <option value="General">General Event</option>
                </select>
              </div>
              
              <div className="admin-form-group">
                <label>Status *</label>
                <select name="status" value={formData.status} onChange={handleChange} className="admin-input">
                  <option value="Upcoming">Upcoming</option>
                  <option value="Past">Past</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading || uploadingFlyer} className="admin-btn admin-btn-primary" style={{ marginTop: "20px", padding: "16px" }}>
              {loading ? "CREATING EVENT..." : uploadingFlyer ? "WAITING FOR UPLOAD..." : "CREATE EVENT"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}