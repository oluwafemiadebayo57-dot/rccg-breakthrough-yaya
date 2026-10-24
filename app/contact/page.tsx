"use client";

import "../../styles/contact-style.css";
import { useState, useEffect } from "react";
// NEW IMPORTS FOR FIREBASE
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Contact() {
  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{ message: string; type: "success" | "error" | "" }>({
    message: "",
    type: "",
  });

  // Success Modal State
  const [modalOpen, setModalOpen] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modalOpen]);

  // Handle Form Submit (Saving to Firebase)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ message: "", type: "" });

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Grab the values from the form
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    try {
      // Save to Firestore Database
      await addDoc(collection(db, "messages"), {
        name,
        email,
        phone,
        subject,
        message,
        createdAt: serverTimestamp(),
      });

      setModalOpen(true);
      form.reset();
      setFormStatus({ message: "✅ Your message was sent successfully!", type: "success" });
    } catch (error) {
      console.error("Error sending message:", error);
      setFormStatus({
        message: "❌ Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* SECTION 1: HERO */}
      <section id="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="hero-glass-card">
            <h1>CONTACT US</h1>
            <div className="golden-line"></div>
            <p className="hero-subtitle">We'd love to hear from you</p>
          </div>
        </div>
      </section>

      {/* SECTION 2: CONTACT INFORMATION CARDS */}
      <section id="contact-info">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title dark">GET IN TOUCH</h2>
            <p className="section-subtitle">Reach out to us through any of these channels</p>
          </div>
          <div className="contact-cards-grid">
            {/* Card 1 - Email */}
            <div className="contact-card">
              <div className="contact-icon"><i className="fas fa-envelope"></i></div>
              <h3>EMAIL US</h3>
              <p className="contact-detail">info@qolasaph.com</p>
              <p className="contact-subtext">We'll respond within 24 hours</p>
            </div>
            {/* Card 2 - Phone */}
            <div className="contact-card">
              <div className="contact-icon"><i className="fas fa-phone-alt"></i></div>
              <h3>CALL US</h3>
              <p className="contact-detail">+234 816 456 6735</p>
              <p className="contact-subtext">Available Monday - Saturday, 9AM - 6PM</p>
            </div>
            {/* Card 3 - Location */}
            <div className="contact-card">
              <div className="contact-icon"><i className="fas fa-map-pin"></i></div>
              <h3>VISIT US</h3>
              <p className="contact-detail">FUPRE, Warri, Delta State</p>
              <p className="contact-subtext">Nigeria</p>
            </div>
            {/* Card 4 - Social */}
            <div className="contact-card">
              <div className="contact-icon"><i className="fas fa-share-alt"></i></div>
              <h3>FOLLOW US</h3>
              <div className="social-icons-row">
                <a href="https://www.instagram.com/qolasaph?igsh=MWpsNGw3bmlyZXNyYQ==" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                <a href="https://youtube.com/@obi_victor?si=jbAP3Y9rRQ0rjOH6" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
                <a href="https://t.me/QolAsaph" target="_blank" rel="noopener noreferrer"><i className="fab fa-telegram"></i></a>
                <a href="https://www.tiktok.com/@qolasaph" target="_blank" rel="noopener noreferrer"><i className="fab fa-tiktok"></i></a>
                <a href="https://chat.whatsapp.com/GTGNbGMsr5Y1MJ9ZY4Gsnc" target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp"></i></a>
              </div>
              <p className="contact-subtext">Join our community online</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CONTACT FORM */}
      <section id="contact-form-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">SEND US A MESSAGE</h2>
            <p className="section-subtitle light">We'd love to connect with you</p>
          </div>
          <div className="form-container full-width">
            <form onSubmit={handleSubmit}>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input type="text" id="fullName" name="name" placeholder="Enter your full name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" placeholder="Enter your email address" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select id="subject" name="subject">
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Prayer Request">Prayer Request</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Testimony">Testimony</option>
                    <option value="Event Participation">Event Participation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={5} placeholder="Write your message here..." required></textarea>
              </div>
              
              {formStatus.message && (
                <div className={`form-status ${formStatus.type}`} style={{ display: "block" }}>
                  {formStatus.message}
                </div>
              )}
              
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* SECTION 4: PRAYER REQUEST / PARTNERSHIP */}
      <section id="prayer-partnership">
        <div className="container">
          <div className="prayer-partnership-glass">
            <div className="pp-grid">
              <div className="pp-item">
                <div className="pp-icon"><i className="fas fa-hands-praying"></i></div>
                <h3>PRAYER REQUEST</h3>
                <p>We would be honored to pray with you. Share your prayer requests with us.</p>
                <a href="#" className="btn-pp btn-prayer">SEND PRAYER REQUEST</a>
              </div>
              <div className="pp-item">
                <div className="pp-icon partnership-icon"><i className="fas fa-handshake"></i></div>
                <h3>PARTNERSHIP</h3>
                <p>Partner with us in raising pleasant incense to Yahweh. Your support makes a difference.</p>
                <a href="#" className="btn-pp btn-partner">BECOME A PARTNER</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FAQ */}
      <section id="faq">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">QUICK ANSWERS</h2>
            <p className="section-subtitle light">Frequently asked questions about connecting with us</p>
          </div>
          <div className="faq-list">
            
            <div className="faq-item">
              <div className="faq-question" onClick={() => toggleFaq(0)}>
                <span>How can I join QOL ASAPH?</span>
                <i className={`fas ${openFaq === 0 ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
              </div>
              <div className={`faq-answer ${openFaq === 0 ? "open" : ""}`}>
                <p>You can join us by attending our events, joining our WhatsApp community, or partnering with us. Visit our JOIN US page or contact us directly to get started.</p>
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-question" onClick={() => toggleFaq(1)}>
                <span>How can I support the ministry?</span>
                <i className={`fas ${openFaq === 1 ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
              </div>
              <div className={`faq-answer ${openFaq === 1 ? "open" : ""}`}>
                <p>You can support us through prayer, partnerships, volunteering, and financial support. Contact us to learn more about partnership opportunities.</p>
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-question" onClick={() => toggleFaq(2)}>
                <span>How can I submit a testimony?</span>
                <i className={`fas ${openFaq === 2 ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
              </div>
              <div className={`faq-answer ${openFaq === 2 ? "open" : ""}`}>
                <p>We'd love to hear your testimony! You can submit it through our contact form, email us directly at Qolasaph@gmail.com, or share it on our social media.</p>
              </div>
            </div>

            <div className="faq-item">
              <div className="faq-question" onClick={() => toggleFaq(3)}>
                <span>How do I stay updated on events?</span>
                <i className={`fas ${openFaq === 3 ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
              </div>
              <div className={`faq-answer ${openFaq === 3 ? "open" : ""}`}>
                <p>Follow us on social media, join our WhatsApp group, or check our website regularly for updates on events, releases, and gatherings.</p>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* SECTION 6: CONNECT SOCIAL */}
      <section id="connect-social">
        <div className="connect-overlay"></div>
        <div className="container">
          <div className="connect-glass">
            <h2>CONNECT WITH US ON SOCIAL MEDIA</h2>
            <p className="connect-sub">Follow us for daily inspiration, updates, and ancient sounds</p>
            <div className="social-icons-large">
              <a href="https://www.instagram.com/qolasaph?igsh=MWpsNGw3bmlyZXNyYQ==" className="social-circle" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
              <a href="https://youtube.com/@obi_victor?si=jbAP3Y9rRQ0rjOH6" className="social-circle" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
              <a href="https://t.me/QolAsaph" className="social-circle" target="_blank" rel="noopener noreferrer"><i className="fab fa-telegram"></i></a>
              <a href="https://www.tiktok.com/@qolasaph" className="social-circle" target="_blank" rel="noopener noreferrer"><i className="fab fa-tiktok"></i></a>
              <a href="https://chat.whatsapp.com/GTGNbGMsr5Y1MJ9ZY4Gsnc" className="social-circle" target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: CTA */}
      <section id="cta">
        <div className="container">
          <div className="cta-glass">
            <h2>READY TO CONNECT WITH US?</h2>
            <p>We'd love to hear from you and welcome you into our community</p>
            <div className="cta-buttons">
              <a href="https://chat.whatsapp.com/GTGNbGMsr5Y1MJ9ZY4Gsnc" className="btn-cta btn-cta-primary" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-whatsapp"></i> JOIN THE TRAIN
              </a>
              <a href="#" className="btn-cta btn-cta-secondary">BECOME A PARTNER</a>
            </div>
          </div>
        </div>
      </section>

      {/* --- SUCCESS MODAL --- */}
      {modalOpen && (
        <div className="modal-overlay open" onClick={() => setModalOpen(false)}>
          <div className="modal-glass" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon"><i className="fas fa-check-circle"></i></div>
            <h3>Message Sent Successfully!</h3>
            <p>We'll get back to you as soon as possible.</p>
            <button className="modal-close" onClick={() => setModalOpen(false)}>OK</button>
          </div>
        </div>
      )}
    </>
  );
}