"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import "../../styles/about-style.css";

export default function About() {
  const [settings, setSettings] = useState<any>({
    vision: "To raise a generation of young people who are deeply rooted in Christ, equipped with the Word, and empowered by the Holy Spirit to impact their world.",
    mission: "Through vibrant worship, relevant teaching, and intentional discipleship, we create a safe space for youths to grow in faith, build lasting relationships, and discover their God-given purpose.",
    teamImageUrl: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, "settings", "main"));
        if (docSnap.exists()) {
          setSettings(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) return <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}></div>;

  return (
    <div className="about-page-wrapper">
      <div className="container">
        
        {/* HEADER */}
        <div className="about-header">
          <h1 className="about-title">ABOUT US</h1>
          <p className="about-subtitle">Who we are and what we stand for</p>
          <div className="about-divider"></div>
        </div>

        {/* VISION & MISSION */}
        <div className="about-vm-grid">
          <div className="about-vm-card">
            <h3><i className="fas fa-eye"></i> OUR VISION</h3>
            <p>{settings.vision}</p>
          </div>
          
          <div className="about-vm-card">
            <h3><i className="fas fa-scroll"></i> OUR MISSION</h3>
            <p>{settings.mission}</p>
          </div>
        </div>

        {/* LEADERSHIP TEAM - Only shows if image exists */}
        {settings.teamImageUrl ? (
          <div className="team-section">
            <h2 className="team-section-title">OUR LEADERSHIP TEAM</h2>
            <p className="team-section-subtitle">The dedicated leaders guiding the YAYA vision</p>
            
            <div className="team-image-wrapper">
              <img 
                src={settings.teamImageUrl} 
                alt="RCCG YAYA Leadership Team" 
              />
            </div>
            
            <p className="team-caption">
              Meet the dedicated team serving the youth ministry.
            </p>
          </div>
        ) : null}

      </div>
    </div>
  );
}