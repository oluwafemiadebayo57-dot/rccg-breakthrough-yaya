"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function Home() {
  const [upcomingEvent, setUpcomingEvent] = useState<any>(null);
  const [settings, setSettings] = useState<any>({
    heroHeading: "WELCOME TO RCCG BREAKTHROUGH YAYA",
    heroSubheading: "Raising a generation of vibrant youths who are passionate about God, community, and purpose.",
    schedule1: "Wednesdays | 5:00 PM",
    schedule2: "Fridays | 6:00 PM",
    schedule3: "Sundays | 10:00 AM",
    testimonies: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, "settings", "main"));
        if (settingsDoc.exists()) setSettings(settingsDoc.data());

        const querySnapshot = await getDocs(collection(db, "events"));
        const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const upcoming = eventsData.filter((e: any) => e.status === "Upcoming");
        upcoming.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        if (upcoming.length > 0) setUpcomingEvent(upcoming[0]);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {/* HERO */}
      <section id="hero">
        <div className="container hero-content">
          <h1 className="hero-heading">{settings.heroHeading}</h1>
          <p className="hero-subheading">{settings.heroSubheading}</p>
          <div className="hero-buttons">
            <a href="/events" className="btn btn-primary">UPCOMING EVENTS</a>
            <a href="/about" className="btn btn-secondary">ABOUT US</a>
          </div>
        </div>
      </section>

      {/* DYNAMIC UPCOMING EVENT BANNER */}
      {upcomingEvent && (
        <section style={{ padding: "40px 0" }}>
          <div className="container">
            <div className="glass-gold" style={{ borderRadius: "20px", overflow: "hidden", display: "flex", flexWrap: "wrap" }}>
              
              {/* FIXED HEIGHT IMAGE CONTAINER */}
              <div style={{ flex: "1 1 350px", height: "400px", position: "relative" }}>
                <img 
                  src={upcomingEvent.flyerUrl} 
                  alt={upcomingEvent.title} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              </div>

              {/* TEXT CONTAINER */}
              <div style={{ flex: "1 1 350px", padding: "40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span style={{ backgroundColor: "var(--secondary)", color: "#fff", padding: "6px 16px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold", alignSelf: "flex-start", marginBottom: "15px", letterSpacing: "1px" }}>
                  UPCOMING EVENT
                </span>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--primary)", marginBottom: "10px" }}>
                  {upcomingEvent.title}
                </h2>
                <p style={{ color: "var(--light)", fontWeight: "bold", fontSize: "1.1rem", marginBottom: "20px" }}>
                  Theme: {upcomingEvent.theme}
                </p>
                <p style={{ color: "#A89F91", marginBottom: "10px" }}>
                  <i className="fas fa-calendar-alt" style={{ marginRight: "10px", color: "var(--secondary)" }}></i> 
                  {upcomingEvent.date} at {upcomingEvent.time}
                </p>
                <p style={{ color: "#A89F91", marginBottom: "25px" }}>
                  <i className="fas fa-map-marker-alt" style={{ marginRight: "10px", color: "var(--secondary)" }}></i> 
                  {upcomingEvent.location}
                </p>
                <Link href="/events" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
                  REGISTER NOW
                </Link>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* WEEKLY SCHEDULE */}
      <section id="vision">
        <div className="container">
          <div className="section-title">
            <h2>WEEKLY ACTIVITIES</h2>
            <p>Come fellowship with us</p>
          </div>
          <div className="vision-grid">
            <div className="vision-card">
              <div className="icon"><i className="fas fa-book-open"></i></div>
              <h3>BIBLE STUDY</h3>
              <p>{settings.schedule1}</p>
            </div>
            <div className="vision-card">
              <div className="icon"><i className="fas fa-hands-praying"></i></div>
              <h3>PRAYER MEETING</h3>
              <p>{settings.schedule2}</p>
            </div>
            <div className="vision-card">
              <div className="icon"><i className="fas fa-fire"></i></div>
              <h3>YOUTH SERVICE</h3>
              <p>{settings.schedule3}</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIES */}
      {settings.testimonies && settings.testimonies.length > 0 && (
        <section id="testimonials">
          <div className="container">
            <div className="section-title">
              <h2>WHAT PEOPLE ARE SAYING</h2>
              <p>Testimonies from our community</p>
            </div>
            <div className="testimonial-grid">
              {settings.testimonies.map((t: any, i: number) => (
                t.name && t.text ? (
                  <div key={i} className="testimonial-card">
                    <div className="quote-icon">❝</div>
                    <p>{t.text}</p>
                    <div className="name">– {t.name}</div>
                  </div>
                ) : null
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}