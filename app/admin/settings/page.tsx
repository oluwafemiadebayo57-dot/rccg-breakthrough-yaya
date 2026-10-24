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
  
  // Form State
  const [heroHeading, setHeroHeading] = useState("");
  const [heroSubheading, setHeroSubheading] = useState("");

  // 1. Fetch existing settings when the page loads
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "main");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setHeroHeading(data.heroHeading || "");
          setHeroSubheading(data.heroSubheading || "");
        } else {
          setHeroHeading("RISING INCENSE");
          setHeroSubheading("Gatherers and assemblers of ancient sounds, ministering in the Presence after the order of Asaph.");
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // 2. Save changes to Firestore
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await setDoc(doc(db, "settings", "main"), {
        heroHeading,
        heroSubheading,
      });
      alert("Settings saved successfully!");
      router.push("/admin");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-layout" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>Loading Settings...</div>;

  return (
    <div className="admin-layout">
      <div className="admin-container" style={{ maxWidth: "700px" }}>
        
        <div className="admin-header">
          <div className="admin-title-group">
            <h1>SITE SETTINGS</h1>
            <p>Update the main text on the home page</p>
          </div>
          <Link href="/admin" className="admin-btn admin-btn-secondary">Back to Dashboard</Link>
        </div>

        <div className="admin-card">
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <div className="admin-form-group">
              <label>Hero Heading (Main Title)</label>
              <input 
                type="text" 
                className="admin-input"
                value={heroHeading} 
                onChange={(e) => setHeroHeading(e.target.value)} 
                required 
              />
            </div>

            <div className="admin-form-group">
              <label>Hero Subheading (Description)</label>
              <textarea 
                className="admin-input"
                value={heroSubheading} 
                onChange={(e) => setHeroSubheading(e.target.value)} 
                required 
                rows={4}
              />
            </div>

            <button type="submit" disabled={saving} className="admin-btn admin-btn-primary" style={{ marginTop: "10px" }}>
              {saving ? "SAVING..." : "SAVE SETTINGS"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}