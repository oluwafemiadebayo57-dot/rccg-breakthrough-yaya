"use client";

import "../../styles/contact-style.css";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "messages"), {
        name, email, message, createdAt: serverTimestamp()
      });
      alert("Message sent successfully! We will get back to you shortly.");
      setName(""); setEmail(""); setMessage("");
    } catch (error) {
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* HEADER */}
      <section style={{ paddingTop: "150px", paddingBottom: "40px", textAlign: "center" }}>
        <div className="container">
          <div className="section-title">
            <h2>CONTACT US</h2>
            <p>We'd love to hear from you</p>
          </div>
        </div>
      </section>

      {/* INFO CARDS */}
      <section id="contact-info">
        <div className="container">
          <div className="contact-cards-grid">
            <div className="contact-card">
              <div className="contact-icon"><i className="fas fa-envelope"></i></div>
              <h3>EMAIL US</h3>
              <p className="contact-detail">info@rccgyaya.com</p>
              <p className="contact-subtext">We'll respond within 24 hours</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon"><i className="fas fa-phone-alt"></i></div>
              <h3>CALL US</h3>
              <p className="contact-detail">+234 000 000 0000</p>
              <p className="contact-subtext">Available Mon - Sat, 9AM - 6PM</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon"><i className="fas fa-map-pin"></i></div>
              <h3>VISIT US</h3>
              <p className="contact-detail">RCCG Breakthrough Cathedral</p>
              <p className="contact-subtext">Akure, Ondo State, Nigeria</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon"><i className="fas fa-share-alt"></i></div>
              <h3>FOLLOW US</h3>
              <div className="social-icons-row">
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-youtube"></i></a>
                <a href="#"><i className="fab fa-tiktok"></i></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORM & MAP */}
      <section id="contact-form-section">
        <div className="container">
          <div className="form-map-grid">
            
            {/* FORM */}
            <div className="form-container">
              <h3 style={{ fontFamily: "var(--font-heading)", color: "var(--primary)", fontSize: "1.8rem", marginBottom: "20px" }}>
                Send a Message
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" required />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we pray with you or help you?" rows={5} required></textarea>
                </div>
                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                </button>
              </form>
            </div>

            {/* MAP */}
            <div className="map-container">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m12!1m8!1m3!1d253317.49394690542!2d5.2160576!3d7.2310493!3m2!1i1024!2i768!4f13.1!2m1!1srccg%20breakthrough%20cathedral%20akure!5e0!3m2!1sen!2sng!4v1792845310866!5m2!1sen!2sng" 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}