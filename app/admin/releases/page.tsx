"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";

export default function AddRelease() {
  const [title, setTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [preSaveLink, setPreSaveLink] = useState("");
  const [streamLink, setStreamLink] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  
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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverImage || !audioFile) {
      setError("Please select both a cover image and an audio file.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      setStatusText("Uploading Cover Image...");
      const imageUrl = await uploadToCloudinary(coverImage);

      setStatusText("Uploading Audio File...");
      const audioUrl = await uploadToCloudinary(audioFile);

      setStatusText("Saving to Database...");
      await addDoc(collection(db, "releases"), {
        title,
        releaseDate,
        preSaveLink,
        streamLink,
        youtubeLink,
        coverUrl: imageUrl,
        audioUrl: audioUrl,
        createdAt: serverTimestamp(),
      });

      alert("Release uploaded successfully!");
      window.location.href = "/admin"; 
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload.");
      setIsUploading(false);
      setStatusText("");
    }
  };

  return (
    <div className="admin-layout">
      <div className="admin-container" style={{ maxWidth: "700px" }}>
        
        <div className="admin-header">
          <div className="admin-title-group">
            <h1>ADD NEW RELEASE</h1>
          </div>
          <Link href="/admin" className="admin-btn admin-btn-secondary">Back to Dashboard</Link>
        </div>

        {error && <div style={{ backgroundColor: "rgba(255,0,0,0.1)", color: "#ff4d4d", padding: "15px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #ff4d4d" }}>{error}</div>}

        <div className="admin-card">
          <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <div className="admin-form-group">
              <label>Release Title</label>
              <input type="text" className="admin-input" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. EL-ROI" />
            </div>

            <div className="admin-form-group">
              <label>Release Date & Time</label>
              <input type="datetime-local" className="admin-input" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} required />
            </div>

            <div className="admin-form-group">
              <label>Pre-Save Link</label>
              <input type="url" className="admin-input" value={preSaveLink} onChange={(e) => setPreSaveLink(e.target.value)} placeholder="https://ditto.fm/..." />
            </div>

            <div className="admin-form-group">
              <label>Streaming Link (Spotify/Apple)</label>
              <input type="url" className="admin-input" value={streamLink} onChange={(e) => setStreamLink(e.target.value)} />
            </div>

            <div className="admin-form-group">
              <label>YouTube Video Link</label>
              <input type="url" className="admin-input" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} />
            </div>

            <div className="admin-form-group">
              <label>Cover Image (JPG/PNG)</label>
              <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files ? e.target.files[0] : null)} required style={{ color: "white" }} />
            </div>

            <div className="admin-form-group">
              <label>Audio File (MP3/WAV)</label>
              <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files ? e.target.files[0] : null)} required style={{ color: "white" }} />
            </div>

            <button type="submit" disabled={isUploading} className="admin-btn admin-btn-primary" style={{ marginTop: "10px" }}>
              {isUploading ? statusText : "PUBLISH RELEASE"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}