"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import Countdown from "@/components/countdown"; // Added Import

export default function PublicEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const upcoming = eventsData.filter((e: any) => e.status === "Upcoming");
        upcoming.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setEvents(upcoming);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRegisterClick = (event: any) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    setRegistrationSuccess(false);
    setName(""); setEmail(""); setPhone(""); setDepartment("");
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      await addDoc(collection(db, "registrations"), {
        eventId: selectedEvent.id, eventTitle: selectedEvent.title,
        name, email, phone, department, createdAt: serverTimestamp(),
      });
      setRegistrationSuccess(true);
    } catch (error) {
      alert("Registration failed. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  // Helper to format the date beautifully
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: "140px", paddingBottom: "80px" }}>
      <div className="container">
        
        <div className="section-title">
          <h2>UPCOMING EVENTS</h2>
          <p>Join us for our next gathering</p>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "var(--light)" }}>Loading events...</p>
        ) : events.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--light)" }}>No upcoming events at the moment. Check back soon!</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "30px", maxWidth: "1000px", margin: "0 auto" }}>
            {events.map((event) => (
              <div key={event.id} className="glass-dark" style={{ borderRadius: "20px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                
                {/* Fixed image aspect ratio and padding to prevent stretching */}
                <div style={{ width: "100%", height: "280px", backgroundColor: "#0a0703", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderBottom: "2px solid var(--secondary)" }}>
                   <img src={event.flyerUrl} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                
                <div style={{ padding: "30px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <span style={{ backgroundColor: "rgba(216, 67, 21, 0.2)", color: "var(--primary)", padding: "6px 14px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", border: "1px solid var(--secondary)", alignSelf: "flex-start", marginBottom: "15px" }}>
                    {event.eventType}
                  </span>
                  
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", color: "var(--primary)", margin: "0 0 5px 0" }}>
                    {event.title}
                  </h3>
                  
                  <p style={{ color: "var(--secondary)", fontWeight: "700", fontSize: "1rem", marginBottom: "20px" }}>
                    Theme: {event.theme}
                  </p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "15px" }}>
                    <p style={{ color: "#D1C7B8", fontSize: "0.9rem", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                      <i className="fas fa-calendar-alt" style={{ color: "var(--primary)" }}></i> {formatDate(event.date)} at {event.time}
                    </p>
                    <p style={{ color: "#D1C7B8", fontSize: "0.9rem", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                      <i className="fas fa-map-marker-alt" style={{ color: "var(--primary)" }}></i> {event.location}
                    </p>
                  </div>

                  {/* ADDED COUNTDOWN */}
                  <Countdown date={event.date} time={event.time} />
                  
                  {/* ADDED LIVE LINK LOGIC */}
                  {event.liveLink ? (
                    <a 
                      href={event.liveLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-primary" 
                      style={{ marginTop: "auto", alignSelf: "center", padding: "14px 40px", backgroundColor: "#FF0000", color: "#FFF", display: "flex", alignItems: "center", gap: "10px", animation: "pulse-logo 2s infinite" }}
                    >
                      <i className="fas fa-play-circle"></i> WATCH LIVE NOW
                    </a>
                  ) : (
                    <button onClick={() => handleRegisterClick(event)} className="btn btn-primary" style={{ marginTop: "auto", alignSelf: "center", padding: "14px 40px" }}>
                      REGISTER NOW
                    </button>
                  )}
                  
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "60px" }}>
          <Link href="/events/archive" className="btn btn-secondary">
            VIEW PAST REJOICE EDITIONS
          </Link>
        </div>
      </div>

      {/* REGISTRATION MODAL */}
      {isModalOpen && selectedEvent && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(18, 12, 6, 0.9)", backdropFilter: "blur(10px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          
          <div className="glass-gold" style={{ width: "100%", maxWidth: "500px", borderRadius: "24px", padding: "40px", position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
            
            <button onClick={() => setIsModalOpen(false)} style={{ position: "absolute", top: "15px", right: "20px", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--primary)" }}>
              &times;
            </button>

            {!registrationSuccess ? (
              <>
                <h2 style={{ fontFamily: "var(--font-heading)", color: "var(--primary)", marginBottom: "10px", textAlign: "center", fontSize: "1.5rem" }}>
                  Register for {selectedEvent.title}
                </h2>
                <p style={{ textAlign: "center", color: "#A89F91", marginBottom: "30px", fontSize: "0.9rem" }}>
                  Fill in your details to secure your spot.
                </p>

                <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px", color: "var(--light)" }}>Full Name</label>
                    <input type="text" className="admin-input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px", color: "var(--light)" }}>Email Address</label>
                    <input type="email" className="admin-input" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="johndoe@example.com" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px", color: "var(--light)" }}>Phone Number</label>
                    <input type="tel" className="admin-input" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="08012345678" />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px", color: "var(--light)" }}>Department / Group (Optional)</label>
                    <input type="text" className="admin-input" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g., Choir, Ushering" />
                  </div>

                  <button type="submit" disabled={isRegistering} className="btn btn-primary" style={{ marginTop: "10px" }}>
                    {isRegistering ? "REGISTERING..." : "COMPLETE REGISTRATION"}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "4rem", color: "#25D366", marginBottom: "20px" }}>
                  <i className="fas fa-check-circle"></i>
                </div>
                <h2 style={{ fontFamily: "var(--font-heading)", color: "var(--primary)", marginBottom: "10px", fontSize: "1.5rem" }}>
                  Registration Successful!
                </h2>
                <p style={{ color: "#A89F91", marginBottom: "30px" }}>
                  You have successfully registered for {selectedEvent.title}.
                </p>
                
                {selectedEvent.whatsappLink && (
                  <div style={{ padding: "20px", backgroundColor: "rgba(37, 211, 102, 0.1)", border: "1px solid #25D366", borderRadius: "12px", marginBottom: "20px" }}>
                    <p style={{ fontWeight: "bold", color: "var(--light)", marginBottom: "15px" }}>Next step: Join the community!</p>
                    <a href={selectedEvent.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ backgroundColor: "#25D366", color: "#FFF", width: "100%" }}>
                      <i className="fab fa-whatsapp"></i> JOIN WHATSAPP GROUP
                    </a>
                  </div>
                )}
                <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", color: "var(--primary)", textDecoration: "underline", cursor: "pointer", fontSize: "0.9rem" }}>
                  Close this window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}