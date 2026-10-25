"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SiteSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingTeam, setUploadingTeam] = useState(false);
  
  // Home Page
  const [heroHeading, setHeroHeading] = useState("");
  const [heroSubheading, setHeroSubheading] = useState("");
  
  // Weekly Schedule
  const [schedule1, setSchedule1] = useState("");
  const [schedule2, setSchedule2] = useState("");
  const [schedule3, setSchedule3] = useState("");

  // Testimonies
  const [testimonies, setTestimonies] = useState([
    { name: "", text: "" },
    { name: "", text: "" },
    { name: "", text: "" }
  ]);

  // About Page
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");
  const [teamImageUrl, setTeamImageUrl] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "main");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setHeroHeading(data.heroHeading || "");
          setHeroSubheading(data.heroSubheading || "");
          
          setSchedule1(data.schedule1 || "Bible Study: Wednesdays | 5:00 PM");
          setSchedule2(data.schedule2 || "Prayer Meeting: Fridays | 6:00 PM");
          setSchedule3(data.schedule3 || "Youth Service: Sundays | 10:00 AM");

          if (data.testimonies) setTestimonies(data.testimonies);
          
          setVision(data.vision || "To raise a generation of young people who are deeply rooted in Christ...");
          setMission(data.mission || "Through vibrant worship, relevant teaching, and intentional discipleship...");
          setTeamImageUrl(data.teamImageUrl || "");
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleTestimonyChange = (index: number, field: "name" | "text", value: string) => {
    const updated = [...testimonies];
    updated[index][field] = value;
    setTestimonies(updated);
  };

  const handleTeamUpload = async (file: File) => {
    setUploadingTeam(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string);
      
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`, {
        method: "POST", body: formData
      });
      const data = await res.json();
      if (data.secure_url) setTeamImageUrl(data.secure_url);
    } catch (error) {
      alert("Failed to upload image.");
    } finally {
      setUploadingTeam(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "main"), {
        heroHeading, heroSubheading,
        schedule1, schedule2, schedule3,
        testimonies,
        vision, mission, teamImageUrl
      });
      alert("All settings saved successfully!");
      router.push("/admin");
    } catch (error) {
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-layout" style={{ display: "flex", justifyContent: "center", alignItems: "center", color: "var(--light)" }}>Loading Settings...</div>;

  return (
    <div className="admin-layout">
      <div className="admin-container" style={{ maxWidth: "800px" }}>
        
        <div className="admin-header">
          <div className="admin-title-group">
            <h1>SITE SETTINGS</h1>
            <p>Update all text and images on the website</p>
          </div>
          <Link href="/admin" className="admin-btn admin-btn-secondary">Back</Link>
        </div>

        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          
          {/* HERO SECTION */}
          <div className="admin-card">
            <h3 className="admin-card-title">Homepage Hero</h3>
            <div className="admin-form-group">
              <label>Hero Heading</label>
              <input type="text" className="admin-input" value={heroHeading} onChange={(e) => setHeroHeading(e.target.value)} required />
            </div>
            <div className="admin-form-group">
              <label>Hero Subheading</label>
              <textarea className="admin-input" value={heroSubheading} onChange={(e) => setHeroSubheading(e.target.value)} required rows={2} />
            </div>
          </div>

          {/* WEEKLY SCHEDULE */}
          <div className="admin-card">
            <h3 className="admin-card-title">Weekly Schedule</h3>
            <div className="admin-form-group">
              <label>Activity 1</label>
              <input type="text" className="admin-input" value={schedule1} onChange={(e) => setSchedule1(e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label>Activity 2</label>
              <input type="text" className="admin-input" value={schedule2} onChange={(e) => setSchedule2(e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label>Activity 3</label>
              <input type="text" className="admin-input" value={schedule3} onChange={(e) => setSchedule3(e.target.value)} />
            </div>
          </div>

          {/* TESTIMONIES */}
          <div className="admin-card">
            <h3 className="admin-card-title">Homepage Testimonies</h3>
            {testimonies.map((t, i) => (
              // Forced dark background here
              <div key={i} style={{ marginBottom: "20px", padding: "20px", backgroundColor: "rgba(255, 248, 231, 0.03)", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>
                <div className="admin-form-group">
                  <label>Testifier Name {i + 1}</label>
                  <input type="text" className="admin-input" value={t.name} onChange={(e) => handleTestimonyChange(i, "name", e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label>Testimony {i + 1}</label>
                  <textarea className="admin-input" value={t.text} onChange={(e) => handleTestimonyChange(i, "text", e.target.value)} rows={2} />
                </div>
              </div>
            ))}
          </div>

          {/* ABOUT PAGE */}
          <div className="admin-card">
            <h3 className="admin-card-title">About Page Settings</h3>
            <div className="admin-form-group">
              <label>Vision Statement</label>
              <textarea className="admin-input" value={vision} onChange={(e) => setVision(e.target.value)} rows={3} />
            </div>
            <div className="admin-form-group">
              <label>Mission Statement</label>
              <textarea className="admin-input" value={mission} onChange={(e) => setMission(e.target.value)} rows={3} />
            </div>
            <div className="admin-form-group">
              <label>Team Photo (Upload to change)</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => e.target.files && handleTeamUpload(e.target.files[0])} 
                className="admin-input" 
                style={{ padding: "10px", cursor: "pointer" }} 
              />
              {uploadingTeam && <p style={{ color: "var(--primary)", marginTop: "10px" }}>Uploading...</p>}
              {teamImageUrl && <img src={teamImageUrl} alt="Team" style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px", marginTop: "15px", border: "1px solid var(--glass-border)" }} />}
            </div>
          </div>

          <button type="submit" disabled={saving || uploadingTeam} className="admin-btn admin-btn-primary" style={{ padding: "16px", fontSize: "1.1rem" }}>
            {saving ? "SAVING ALL CHANGES..." : "SAVE ALL SETTINGS"}
          </button>
        </form>

      </div>
    </div>
  );
}