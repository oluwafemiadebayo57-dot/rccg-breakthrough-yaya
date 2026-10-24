"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";

export default function AddGalleryImage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
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
    if (!imageFile) {
      setError("Please select an image.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      setStatusText("Uploading Image to Cloudinary...");
      const imageUrl = await uploadToCloudinary(imageFile);

      setStatusText("Saving to Database...");
      await addDoc(collection(db, "gallery"), {
        imageUrl,
        createdAt: serverTimestamp(),
      });

      alert("Image uploaded to gallery! Redirecting to dashboard...");
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
      <div className="admin-container" style={{ maxWidth: "600px" }}>
        
        <div className="admin-header">
          <div className="admin-title-group">
            <h1>ADD GALLERY IMAGE</h1>
          </div>
          <Link href="/admin" className="admin-btn admin-btn-secondary">Back to Dashboard</Link>
        </div>

        {error && <div style={{ backgroundColor: "rgba(255,0,0,0.1)", color: "#ff4d4d", padding: "15px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #ff4d4d" }}>{error}</div>}

        <div className="admin-card">
          <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <div className="admin-form-group">
              <label>Select Image (JPG/PNG)</label>
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} required style={{ color: "white", padding: "10px 0" }} />
            </div>

            <button type="submit" disabled={isUploading} className="admin-btn admin-btn-primary" style={{ marginTop: "10px" }}>
              {isUploading ? statusText : "UPLOAD IMAGE"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}