"use client";

import "../../styles/events-style.css";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

export default function Events() {
  const [showMore, setShowMore] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);

  const [featuredEvent, setFeaturedEvent] = useState<any>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);

  const [timeLeft, setTimeLeft] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const galleryQuery = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
        const gallerySnapshot = await getDocs(galleryQuery);
        setGalleryImages(gallerySnapshot.docs.map(doc => doc.data().imageUrl));

        const eventsQuery = query(collection(db, "events"), orderBy("createdAt", "desc"));
        const eventsSnapshot = await getDocs(eventsQuery);
        
        if (!eventsSnapshot.empty) {
          setFeaturedEvent(eventsSnapshot.docs[0].data());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingGallery(false);
        setLoadingEvent(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + 6);
    targetDate.setDate(15);
    targetDate.setHours(0, 0, 0, 0);

    const interval = setInterval(() => {
      const diff = targetDate.getTime() - new Date().getTime();
      
      if (diff <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        clearInterval(interval);
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (lightboxImage || videoModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [lightboxImage, videoModalOpen]);

  return (
    <>
      {/* SECTION 1: HERO */}
      <section id="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="hero-glass-card">
            <h1>EVENTS</h1>
            <div className="golden-line"></div>
            <p className="hero-subtitle">Gathering to raise pleasant incense to Yahweh</p>
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURED EVENT */}
      <section id="featured-event">
        <div className="container">
          {loadingEvent ? (
            <p style={{ textAlign: "center", color: "#FFF6E1", padding: "40px" }}>Loading event details...</p>
          ) : featuredEvent ? (
            <>
              <div className="section-header">
                <h2 className="section-title">FEATURED EVENT</h2>
                <p className="section-subtitle">{featuredEvent.title} - {featuredEvent.subtitle}</p>
              </div>
              <div className="featured-grid">
                <div className="flyer-container">
                  <div className="flyer-placeholder">
                    <img src={featuredEvent.flyerUrl} alt={`${featuredEvent.title} Flyer`} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="eager" fetchPriority="high" />
                  </div>
                </div>
                <div className="event-details">
                  <h3>{featuredEvent.title}</h3>
                  <div className="event-meta">
                    <span><i className="fas fa-calendar-day"></i> {featuredEvent.date}</span>
                    <span><i className="fas fa-map-marker-alt"></i> {featuredEvent.location}</span>
                  </div>
                  <div className="event-description">
                    <p>{featuredEvent.description}</p>
                  </div>
                  <div className="event-highlights">
                    <span><i className="fas fa-music"></i> Prophetic Worship Session</span>
                    <span><i className="fas fa-harp"></i> Ancient Sound Ministration</span>
                    <span><i className="fas fa-hands-praying"></i> Commissioning Service</span>
                    <span><i className="fas fa-users"></i> Corporate Prayer &amp; Fellowship</span>
                  </div>
                  
                  {featuredEvent.highlightVideoUrl && (
                    <button onClick={() => setVideoModalOpen(true)} className="btn-glass btn-recap" style={{ border: 'none', cursor: 'pointer' }}>
                      WATCH HIGHLIGHT
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p style={{ textAlign: "center", color: "#FFF6E1", padding: "40px" }}>No featured event at the moment. Check back soon!</p>
          )}
        </div>
      </section>

      {/* SECTION 3: TESTIMONIES (NOW DYNAMIC) */}
      {featuredEvent?.testimonials && featuredEvent.testimonials.length > 0 && (
        <section id="testimonies">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title dark">WHAT PEOPLE ARE SAYING</h2>
              <p className="section-subtitle">Testimonies from {featuredEvent.title}</p>
            </div>
            <div className="testimonies-grid">
              {featuredEvent.testimonials.map((testimony: any, index: number) => (
                <div key={index} className="testimony-card">
                  <div className="quote-icon"><i className="fas fa-quote-left"></i></div>
                  <p>{testimony.text}</p>
                  <div className="testifier">
                    <span className="name">– {testimony.name}</span>
                    <span className="role">Attendee, {featuredEvent.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: GALLERY */}
      <section id="gallery">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">EVENT GALLERY</h2>
            <p className="section-subtitle light">Moments captured from our events</p>
          </div>
          
          <div className="gallery-grid" id="galleryGrid">
            {loadingGallery ? (
              <p style={{ color: "white", gridColumn: "1 / -1", textAlign: "center", padding: "20px" }}>Loading gallery...</p>
            ) : galleryImages.length === 0 ? (
              <p style={{ color: "white", gridColumn: "1 / -1", textAlign: "center", padding: "20px" }}>No images in the gallery yet. Check back soon!</p>
            ) : (
              galleryImages.map((src, index) => {
                const isHidden = index >= 10 && !showMore;
                
                return (
                  <div 
                    key={index} 
                    className={`gallery-item ${isHidden ? 'hidden' : ''} ${!isHidden && index >= 10 ? 'show' : ''}`} 
                    onClick={() => setLightboxImage(src)}
                  >
                    <img src={src} alt={`Gallery Image ${index + 1}`} loading={index < 10 ? "eager" : "lazy"} />
                    <div className="image-placeholder">
                      <i className="fas fa-image"></i>
                      <span>Image {index + 1}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {galleryImages.length > 10 && (
            <div className="more-btn-wrapper">
              <button className="btn-more" onClick={() => setShowMore(!showMore)}>
                {showMore ? "VIEW LESS IMAGES" : "VIEW MORE IMAGES"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 5: ANTICIPATE */}
      <section id="anticipate">
        <div className="anticipate-overlay"></div>
        <div className="container">
          <div className="anticipate-glass">
            <div className="anticipate-icon"><i className="fas fa-trumpet"></i></div>
            <h2>ANTICIPATE QOL ASAPH 2.0</h2>
            <p className="anticipate-sub">The next convergence. The next sound. The next move.</p>
            <p className="anticipate-desc">We are preparing for what's next. Stay tuned for QOL ASAPH 2.0 – another prophetic gathering of ancient sounds and priestly worship. The gates are opening again.</p>
            <div className="anticipate-badge">COMING SOON</div>
            <div className="anticipate-date">Date: To Be Announced</div>
            <div className="countdown-mini" id="countdownMini">
              <div className="countdown-item-mini"><span>{timeLeft.days}</span><span className="label">DAYS</span></div>
              <div className="countdown-item-mini"><span>{timeLeft.hours}</span><span className="label">HOURS</span></div>
              <div className="countdown-item-mini"><span>{timeLeft.minutes}</span><span className="label">MINUTES</span></div>
              <div className="countdown-item-mini"><span>{timeLeft.seconds}</span><span className="label">SECONDS</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: CTA */}
      <section id="cta">
        <div className="container">
          <div className="cta-glass">
            <h2>DON'T MISS THE NEXT MOVE</h2>
            <p>Stay connected and be part of what God is doing through QOL ASAPH</p>
            <div className="cta-buttons">
              <a href="/contact" className="btn-cta btn-cta-primary">CONTACT US</a>
              <a href="https://chat.whatsapp.com/GTGNbGMsr5Y1MJ9ZY4Gsnc" className="btn-cta btn-cta-secondary" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-whatsapp"></i> JOIN THE TRAIN
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- LIGHTBOX MODAL --- */}
      {lightboxImage && (
        <div className="lightbox open" onClick={() => setLightboxImage(null)}>
          <span className="lightbox-close">&times;</span>
          <img className="lightbox-content" src={lightboxImage} alt="Enlarged Gallery Image" />
        </div>
      )}

      {/* --- VIDEO MODAL --- */}
      {videoModalOpen && featuredEvent?.highlightVideoUrl && (
        <div className="video-modal open" onClick={(e) => {
          if (e.target === e.currentTarget) setVideoModalOpen(false);
        }}>
          <div className="video-modal-content">
            <span className="video-modal-close" onClick={() => setVideoModalOpen(false)}>&times;</span>
            <video controls autoPlay style={{ width: "100%", borderRadius: "20px" }}>
              <source src={featuredEvent.highlightVideoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </>
  );
}