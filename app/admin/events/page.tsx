"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";

export default function AddEvent() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  const [testimonials, setTestimonials] = useState([
    { text: "", name: "" },
    { text: "", name: "" },
    { text: "", name: "" }
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");

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

  const handleTestimonialChange = (index: number, field: "text" | "name", value: string) => {
    const updated = [...testimonials];
    updated[index][field] = value;
    setTestimonials(updated);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flyerFile) {
      setError("Please select a flyer image.");
      return;
    }

    if (videoFile && videoFile.size > 30 * 1024 * 1024) {
      setError("The highlight video is too large. Please keep it under 30MB.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      setStatusText("Uploading Flyer to Cloudinary...");
      const flyerUrl = await uploadToCloudinary(flyerFile);

      let videoUrl = "";
      if (videoFile) {
        setStatusText("Uploading Highlight Video... (This may take a moment)");
        videoUrl = await uploadToCloudinary(videoFile);
      }

      const validTestimonials = testimonials.filter(t => t.name.trim() !== "" && t.text.trim() !== "");

      setStatusText("Saving Event to Database...");
      await addDoc(collection(db, "events"), {
        title,
        subtitle,
        date,
        location,
        description,
        flyerUrl,
        highlightVideoUrl: videoUrl,
        testimonials: validTestimonials,
        createdAt: serverTimestamp(),
      });

      alert("Event published successfully!");
      window.location.href = "/admin"; 
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload event.");
      setIsUploading(false);
      setStatusText("");
    }
  };

  return (
    <div className="admin-layout">
      <div className="admin-container" style={{ maxWidth: "800px" }}>
        
        <div className="admin-header">
          <div className="admin-title-group">
            <h1>CREATE NEW EVENT</h1>
          </div>
          <Link href="/admin" className="admin-btn admin-btn-secondary">Back to Dashboard</Link>
        </div>

        {error && <div style={{ backgroundColor: "rgba(255,0,0,0.1)", color: "#ff4d4d", padding: "15px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #ff4d4d" }}>{error}</div>}

        <div className="admin-card">
          <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <div className="admin-form-row" style={{ display: "grid", gap: "20px" }}>
              <div className="admin-form-group">
                <label>Event Title</label>
                <input type="text" className="admin-input" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. QOL ASAPH 2.0" />
              </div>
              <div className="admin-form-group">
                <label>Subtitle</label>
                <input type="text" className="admin-input" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="e.g. The Next Convergence" />
              </div>
            </div>

            <div className="admin-form-row" style={{ display: "grid", gap: "20px" }}>
              <div className="admin-form-group">
                <label>Date</label>
                <input type="text" className="admin-input" value={date} onChange={(e) => setDate(e.target.value)} required placeholder="e.g. July 23, 2026" />
              </div>
              <div className="admin-form-group">
                <label>Location</label>
                <input type="text" className="admin-input" value={location} onChange={(e) => setLocation(e.target.value)} required placeholder="e.g. FUPRE, Warri" />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Description</label>
              <textarea className="admin-input" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} placeholder="Describe the event..." />
            </div>

            <div className="admin-form-row" style={{ display: "grid", gap: "20px" }}>
              <div className="admin-form-group">
                <label>Event Flyer (JPG/PNG)</label>
                <input type="file" accept="image/*" onChange={(e) => setFlyerFile(e.target.files ? e.target.files[0] : null)} required style={{ color: "white" }} />
              </div>
              <div className="admin-form-group">
                <label>Highlight Video (Optional, Max 30MB)</label>
                <input type="file" accept="video/mp4,video/*" onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)} style={{ color: "white" }} />
              </div>
            </div>

            <div style={{ marginTop: "10px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px" }}>
              <h3 style={{ color: "#FFAE00", marginBottom: "15px", fontFamily: "Cinzel, serif", fontSize: "1.1rem" }}>Event Testimonies (Max 3)</h3>
              
              {testimonials.map((testimony, index) => (
                <div key={index} style={{ backgroundColor: "rgba(0,0,0,0.3)", padding: "15px", borderRadius: "8px", marginBottom: "15px", border: "1px solid #333" }}>
                  <h4 style={{ fontSize: "0.9rem", color: "#888", marginBottom: "10px" }}>Testimony {index + 1}</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                    <input 
                      type="text" 
                      placeholder="Testifier Name" 
                      value={testimony.name} 
                      onChange={(e) => handleTestimonialChange(index, "name", e.target.value)} 
                      className="admin-input" 
                    />
                    <textarea 
                      placeholder="Testimony text" 
                      value={testimony.text} 
                      onChange={(e) => handleTestimonialChange(index, "text", e.target.value)} 
                      rows={2}
                      className="admin-input" 
                    />
                  </div>
                </div>
              ))}
            </div>

            <button type="submit" disabled={isUploading} className="admin-btn admin-btn-primary" style={{ marginTop: "10px" }}>
              {isUploading ? statusText : "PUBLISH EVENT"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}