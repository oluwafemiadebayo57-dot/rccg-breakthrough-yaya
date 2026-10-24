"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EditEvent() {
  const params = useParams();
  // Safely extract the ID to prevent Next.js hydration errors
  const id = params?.id as string; 
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [currentFlyerUrl, setCurrentFlyerUrl] = useState("");
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  
  // Testimonies State
  const [testimonials, setTestimonials] = useState([
    { text: "", name: "" },
    { text: "", name: "" },
    { text: "", name: "" }
  ]);

  const [newFlyer, setNewFlyer] = useState<File | null>(null);
  const [newVideo, setNewVideo] = useState<File | null>(null);

  // 1. Fetch existing event data
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        setLoading(false);
        setError("Invalid Event ID");
        return;
      }
      
      try {
        const docRef = doc(db, "events", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setSubtitle(data.subtitle || "");
          setDate(data.date || "");
          setLocation(data.location || "");
          setDescription(data.description || "");
          setCurrentFlyerUrl(data.flyerUrl || "");
          setCurrentVideoUrl(data.highlightVideoUrl || "");

          // Load existing testimonials if they exist
          if (data.testimonials && Array.isArray(data.testimonials)) {
            const loadedTestimonials = [
              { text: "", name: "" },
              { text: "", name: "" },
              { text: "", name: "" }
            ];
            data.testimonials.forEach((t: any, index: number) => {
              if (index < 3) {
                loadedTestimonials[index] = { text: t.text || "", name: t.name || "" };
              }
            });
            setTestimonials(loadedTestimonials);
          }
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

  const handleTestimonialChange = (index: number, field: "text" | "name", value: string) => {
    const updated = [...testimonials];
    updated[index][field] = value;
    setTestimonials(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setIsSaving(true);
    setError("");

    try {
      let finalFlyerUrl = currentFlyerUrl;
      let finalVideoUrl = currentVideoUrl;

      // Upload new flyer if selected
      if (newFlyer) {
        setStatusText("Uploading New Flyer...");
        finalFlyerUrl = await uploadToCloudinary(newFlyer);
      }

      // Upload new video if selected
      if (newVideo) {
        if (newVideo.size > 30 * 1024 * 1024) {
          throw new Error("Video is over 30MB.");
        }
        setStatusText("Uploading New Video...");
        finalVideoUrl = await uploadToCloudinary(newVideo);
      }

      // Filter out empty testimonials
      const validTestimonials = testimonials.filter(t => t.name.trim() !== "" && t.text.trim() !== "");

      setStatusText("Saving Changes...");
      const docRef = doc(db, "events", id);
      await updateDoc(docRef, {
        title,
        subtitle,
        date,
        location,
        description,
        flyerUrl: finalFlyerUrl,
        highlightVideoUrl: finalVideoUrl,
        testimonials: validTestimonials,
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

  if (loading) return <div style={{ minHeight: "100vh", backgroundColor: "#040404", color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>Loading Event...</div>;

  if (error) return (
    <div style={{ minHeight: "100vh", backgroundColor: "#040404", color: "white", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <p style={{ color: "#ff4d4d", fontSize: "1.2rem", marginBottom: "20px" }}>{error}</p>
      <Link href="/admin/manage-events" style={{ color: "#FFAE00", textDecoration: "underline" }}>Back to Manage Events</Link>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#040404", color: "white", padding: "40px", paddingTop: "120px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "rgba(255,255,255,0.05)", padding: "40px", borderRadius: "20px", border: "1px solid rgba(255,174,0,0.2)" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
          <h1 style={{ color: "#FFAE00", fontFamily: "Cinzel, serif" }}>Edit Event</h1>
          <Link href="/admin/manage-events" style={{ color: "#FFAE00", textDecoration: "underline" }}>Cancel</Link>
        </div>

        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>Event Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #333", backgroundColor: "#111", color: "white" }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>Subtitle</label>
              <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #333", backgroundColor: "#111", color: "white" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>Date</label>
              <input type="text" value={date} onChange={(e) => setDate(e.target.value)} required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #333", backgroundColor: "#111", color: "white" }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>Location</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #333", backgroundColor: "#111", color: "white" }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px" }}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #333", backgroundColor: "#111", color: "white" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>Replace Flyer (Optional)</label>
              <input type="file" accept="image/*" onChange={(e) => setNewFlyer(e.target.files ? e.target.files[0] : null)} style={{ width: "100%", padding: "12px", border: "1px dashed #FFAE00", borderRadius: "8px" }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px" }}>Replace Video (Optional, Max 30MB)</label>
              <input type="file" accept="video/mp4,video/*" onChange={(e) => setNewVideo(e.target.files ? e.target.files[0] : null)} style={{ width: "100%", padding: "12px", border: "1px dashed #FFAE00", borderRadius: "8px" }} />
            </div>
          </div>

          {/* TESTIMONIES SECTION */}
          <div style={{ marginTop: "20px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px" }}>
            <h3 style={{ color: "#FFAE00", marginBottom: "15px", fontFamily: "Cinzel, serif" }}>Event Testimonies (Max 3)</h3>
            
            {testimonials.map((testimony, index) => (
              <div key={index} style={{ backgroundColor: "rgba(0,0,0,0.3)", padding: "15px", borderRadius: "8px", marginBottom: "15px", border: "1px solid #333" }}>
                <h4 style={{ fontSize: "0.9rem", color: "#888", marginBottom: "10px" }}>Testimony {index + 1}</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                  <input 
                    type="text" 
                    placeholder="Testifier Name" 
                    value={testimony.name} 
                    onChange={(e) => handleTestimonialChange(index, "name", e.target.value)} 
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #333", backgroundColor: "#111", color: "white" }} 
                  />
                  <textarea 
                    placeholder="Testimony text" 
                    value={testimony.text} 
                    onChange={(e) => handleTestimonialChange(index, "text", e.target.value)} 
                    rows={2}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #333", backgroundColor: "#111", color: "white" }} 
                  />
                </div>
              </div>
            ))}
          </div>

          <button type="submit" disabled={isSaving} style={{ backgroundColor: "#FFAE00", color: "#040404", padding: "14px", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: isSaving ? "not-allowed" : "pointer", marginTop: "10px" }}>
            {isSaving ? statusText : "SAVE CHANGES"}
          </button>
        </form>
      </div>
    </div>
  );
}