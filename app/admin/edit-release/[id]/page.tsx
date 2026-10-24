"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EditRelease() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [preSaveLink, setPreSaveLink] = useState("");
  const [streamLink, setStreamLink] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  
  const [currentCoverUrl, setCurrentCoverUrl] = useState("");
  const [currentAudioUrl, setCurrentAudioUrl] = useState("");

  const [newCover, setNewCover] = useState<File | null>(null);
  const [newAudio, setNewAudio] = useState<File | null>(null);

  useEffect(() => {
    const fetchRelease = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "releases", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setReleaseDate(data.releaseDate || "");
          setPreSaveLink(data.preSaveLink || "");
          setStreamLink(data.streamLink || "");
          setYoutubeLink(data.youtubeLink || "");
          setCurrentCoverUrl(data.coverUrl || "");
          setCurrentAudioUrl(data.audioUrl || "");
        } else {
          setError("Release not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load release.");
      } finally {
        setLoading(false);
      }
    };
    fetchRelease();
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
      let finalCoverUrl = currentCoverUrl;
      let finalAudioUrl = currentAudioUrl;

      // Upload new cover if selected
      if (newCover) {
        setStatusText("Uploading New Cover...");
        finalCoverUrl = await uploadToCloudinary(newCover);
      }

      // Upload new audio if selected
      if (newAudio) {
        setStatusText("Uploading New Audio...");
        finalAudioUrl = await uploadToCloudinary(newAudio);
      }

      setStatusText("Saving Changes...");
      const docRef = doc(db, "releases", id);
      await updateDoc(docRef, {
        title,
        releaseDate,
        preSaveLink,
        streamLink,
        youtubeLink,
        coverUrl: finalCoverUrl,
        audioUrl: finalAudioUrl,
      });

      alert("Release updated successfully!");
      router.push("/admin/manage");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save.");
    } finally {
      setIsSaving(false);
      setStatusText("");
    }
  };

  if (loading) return <div style={{ minHeight: "100vh", backgroundColor: "#040404", color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>Loading Release...</div>;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#040404", color: "white", padding: "40px", paddingTop: "120px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", backgroundColor: "rgba(255,255,255,0.05)", padding: "40px", borderRadius: "20px", border: "1px solid rgba(255,174,0,0.2)" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
          <h1 style={{ color: "#FFAE00", fontFamily: "Cinzel, serif" }}>Edit Release</h1>
          <Link href="/admin/manage" style={{ color: "#FFAE00", textDecoration: "underline" }}>Cancel</Link>
        </div>

        {error && <div style={{ backgroundColor: "rgba(255,0,0,0.2)", color: "#ff4d4d", padding: "10px", borderRadius: "8px", marginBottom: "20px" }}>{error}</div>}

        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <div>
            <label style={{ display: "block", marginBottom: "8px" }}>Release Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #333", backgroundColor: "#111", color: "white" }} />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px" }}>Release Date & Time</label>
            <input type="datetime-local" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #333", backgroundColor: "#111", color: "white" }} />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px" }}>Pre-Save Link</label>
            <input type="url" value={preSaveLink} onChange={(e) => setPreSaveLink(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #333", backgroundColor: "#111", color: "white" }} />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px" }}>Streaming Link (Spotify/Apple)</label>
            <input type="url" value={streamLink} onChange={(e) => setStreamLink(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #333", backgroundColor: "#111", color: "white" }} />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px" }}>YouTube Video Link</label>
            <input type="url" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #333", backgroundColor: "#111", color: "white" }} />
          </div>

          <div style={{ padding: "15px", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px dashed #333" }}>
            <p style={{ fontSize: "0.85rem", color: "#888", marginBottom: "10px" }}>Current Cover: {currentCoverUrl ? "Uploaded ✅" : "None"}</p>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem" }}>Replace Cover Image (Optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setNewCover(e.target.files ? e.target.files[0] : null)} style={{ width: "100%", padding: "10px", border: "1px solid #333", borderRadius: "8px" }} />
          </div>

          <div style={{ padding: "15px", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px dashed #333" }}>
            <p style={{ fontSize: "0.85rem", color: "#888", marginBottom: "10px" }}>Current Audio: {currentAudioUrl ? "Uploaded ✅" : "None"}</p>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem" }}>Upload/Replace MP3 File (Optional)</label>
            <input type="file" accept="audio/*" onChange={(e) => setNewAudio(e.target.files ? e.target.files[0] : null)} style={{ width: "100%", padding: "10px", border: "1px solid #333", borderRadius: "8px" }} />
          </div>

          <button type="submit" disabled={isSaving} style={{ backgroundColor: "#FFAE00", color: "#040404", padding: "14px", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: isSaving ? "not-allowed" : "pointer", marginTop: "10px" }}>
            {isSaving ? statusText : "SAVE CHANGES"}
          </button>
        </form>
      </div>
    </div>
  );
}