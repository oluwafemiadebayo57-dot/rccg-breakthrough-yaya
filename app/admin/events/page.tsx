"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    theme: "",
    date: "",
    time: "",
    location: "",
    flyerUrl: "",
    whatsappLink: "",
    eventType: "REJOICE", // Default
    status: "Upcoming"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      router.push("/admin/manage-events"); // Redirect to manage events list
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
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--light)", fontWeight: "bold" }}>Event Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="admin-input" placeholder="e.g. Youth Convention" />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--light)", fontWeight: "bold" }}>Theme *</label>
                <input type="text" name="theme" value={formData.theme} onChange={handleChange} required className="admin-input" placeholder="e.g. Arise and Shine" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--light)", fontWeight: "bold" }}>Date *</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required className="admin-input" />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--light)", fontWeight: "bold" }}>Time *</label>
                <input type="text" name="time" value={formData.time} onChange={handleChange} required className="admin-input" placeholder="e.g. 5:00 PM" />
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--light)", fontWeight: "bold" }}>Location *</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required className="admin-input" placeholder="e.g. RCCG Breakthrough Cathedral, Akure" />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--light)", fontWeight: "bold" }}>Flyer Image URL</label>
              <input type="url" name="flyerUrl" value={formData.flyerUrl} onChange={handleChange} className="admin-input" placeholder="Paste Cloudinary image URL here" />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--light)", fontWeight: "bold" }}>WhatsApp Group Link</label>
              <input type="url" name="whatsappLink" value={formData.whatsappLink} onChange={handleChange} className="admin-input" placeholder="https://chat.whatsapp.com/..." />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--light)", fontWeight: "bold" }}>Event Type *</label>
                <select name="eventType" value={formData.eventType} onChange={handleChange} className="admin-input">
                  <option value="REJOICE">REJOICE</option>
                  <option value="General">General Event</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--light)", fontWeight: "bold" }}>Status *</label>
                <select name="status" value={formData.status} onChange={handleChange} className="admin-input">
                  <option value="Upcoming">Upcoming</option>
                  <option value="Past">Past</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="admin-btn admin-btn-primary" style={{ marginTop: "10px", padding: "16px" }}>
              {loading ? "CREATING EVENT..." : "CREATE EVENT"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}