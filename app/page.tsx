"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [latestRelease, setLatestRelease] = useState<any>(null);
  const [loadingRelease, setLoadingRelease] = useState(true);
  
  const [settings, setSettings] = useState({
    heroHeading: "RISING INCENSE",
    heroSubheading: "Gatherers and assemblers of ancient sounds, ministering in the Presence after the order of Asaph."
  });

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isReleased: false });

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Site Settings
        const settingsDoc = await getDoc(doc(db, "settings", "main"));
        if (settingsDoc.exists()) {
          setSettings({
            heroHeading: settingsDoc.data().heroHeading || "RISING INCENSE",
            heroSubheading: settingsDoc.data().heroSubheading || "Gatherers and assemblers of ancient sounds...",
          });
        }

        // 2. Fetch Latest Release
        const querySnapshot = await getDocs(collection(db, "releases"));
        if (!querySnapshot.empty) {
          const releases = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          releases.sort((a: any, b: any) => {
             const dateA = a.createdAt?.toMillis() || 0;
             const dateB = b.createdAt?.toMillis() || 0;
             return dateB - dateA;
          });
          setLatestRelease(releases[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingRelease(false);
      }
    };
    fetchData();
  }, []);

  // Countdown Timer Logic
  useEffect(() => {
    if (!latestRelease) return;

    // If no date is set, treat it as already released
    if (!latestRelease.releaseDate) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isReleased: true });
      return;
    }

    const targetDate = new Date(latestRelease.releaseDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isReleased: true });
        clearInterval(interval);
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s, isReleased: false });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [latestRelease]);

  return (
    <>
      {/* HERO */}
      <section id="hero">
        <div className="container hero-content">
          <h1 className="hero-heading">{settings.heroHeading}</h1>
          <p className="hero-subheading">
            {settings.heroSubheading}
          </p>
          <div className="hero-buttons">
            <a href="/about" className="btn btn-primary">LEARN MORE</a>
            <a href="https://chat.whatsapp.com/GTGNbGMsr5Y1MJ9ZY4Gsnc" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-whatsapp"></i> JOIN THE TRAIN
            </a>
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section id="vision">
        <div className="container">
          <div className="section-title fade-up">
            <h2><span>OUR VISION &amp; MISSION</span></h2>
          </div>
          <div className="vision-grid">
            <div className="vision-card fade-up">
              <div className="icon"><i className="fas fa-users"></i></div>
              <h3>GATHERERS &amp; ASSEMBLERS</h3>
              <p>Raising men and women entrusted with divine instruments to represent God's Kingdom at the gates of Priesthood and Kingship through prophetic sounds, the Word, and the power of the Holy Spirit.</p>
            </div>
            <div className="vision-card fade-up">
              <div className="icon"><i className="fas fa-scroll"></i></div>
              <h3>MINISTRY OF THE WORD</h3>
              <p>Preaching and ministering the Word with depth, clarity, and spiritual understanding — because sound cannot replace the Word; the Word establishes truth and gives form to what we carry.</p>
            </div>
            <div className="vision-card fade-up">
              <div className="icon"><i className="fas fa-fire"></i></div>
              <h3>POWER OF THE SPIRIT</h3>
              <p>Demonstrating the Holy Spirit's power through prayer, prophecy, healing, deliverance, and gifts of the Spirit — revealing Christ, not merely the manifestation.</p>
            </div>
            <div className="vision-card fade-up">
              <div className="icon"><i className="fas fa-microphone-alt"></i></div>
              <h3>PROPHETIC PSALMISTS</h3>
              <p>Raising worshipers who carry sanctity through yieldedness and consecration — priests who carry sound from the Presence, not performers. Worship that flows from the altar.</p>
            </div>
            <div className="vision-card fade-up">
              <div className="icon"><i className="fas fa-crown"></i></div>
              <h3>MATURED DISCIPLES</h3>
              <p>Forming spiritually and intellectually mature disciples through mentorship, accountability, and instruction — not merely gathering people, but forming people who steward what is entrusted.</p>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING RELEASE */}
      <section id="release">
        <div className="container">
          <div className="section-title"><h2>NEW SOUND ALERT</h2></div>
          
          {loadingRelease ? (
            <p style={{ textAlign: "center", color: "#FFF6E1" }}>Loading latest release...</p>
          ) : latestRelease ? (
            <div className="release-grid">
              <div className="album-cover">
                <img src={latestRelease.coverUrl} alt={`${latestRelease.title} Album Cover`} />
              </div>
              <div className="release-details">
                <h3>{latestRelease.title || "New Release"}</h3>
                <div className="date">
                  RELEASE DATE: {latestRelease.releaseDate ? new Date(latestRelease.releaseDate).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : "TBA"}
                </div>

                {/* COUNTDOWN TIMER */}
                {!timeLeft.isReleased && (
                  <div style={{ display: "flex", gap: "15px", margin: "20px 0", flexWrap: "wrap" }}>
                    <div style={{ textAlign: "center", background: "rgba(255,174,0,0.1)", padding: "10px 15px", borderRadius: "8px", border: "1px solid rgba(255,174,0,0.3)" }}>
                      <span style={{ display: "block", fontSize: "1.5rem", fontWeight: "bold", color: "#FFAE00" }}>{timeLeft.days}</span>
                      <span style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "#ccc" }}>Days</span>
                    </div>
                    <div style={{ textAlign: "center", background: "rgba(255,174,0,0.1)", padding: "10px 15px", borderRadius: "8px", border: "1px solid rgba(255,174,0,0.3)" }}>
                      <span style={{ display: "block", fontSize: "1.5rem", fontWeight: "bold", color: "#FFAE00" }}>{timeLeft.hours}</span>
                      <span style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "#ccc" }}>Hours</span>
                    </div>
                    <div style={{ textAlign: "center", background: "rgba(255,174,0,0.1)", padding: "10px 15px", borderRadius: "8px", border: "1px solid rgba(255,174,0,0.3)" }}>
                      <span style={{ display: "block", fontSize: "1.5rem", fontWeight: "bold", color: "#FFAE00" }}>{timeLeft.minutes}</span>
                      <span style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "#ccc" }}>Mins</span>
                    </div>
                    <div style={{ textAlign: "center", background: "rgba(255,174,0,0.1)", padding: "10px 15px", borderRadius: "8px", border: "1px solid rgba(255,174,0,0.3)" }}>
                      <span style={{ display: "block", fontSize: "1.5rem", fontWeight: "bold", color: "#FFAE00" }}>{timeLeft.seconds}</span>
                      <span style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "#ccc" }}>Secs</span>
                    </div>
                  </div>
                )}

                <div className="release-actions">
                  {/* If NOT released yet, show Pre-Save */}
                  {!timeLeft.isReleased && latestRelease.preSaveLink && (
                    <a href={latestRelease.preSaveLink} className="btn-pre-save" target="_blank" rel="noopener noreferrer">PRE-SAVE NOW</a>
                  )}

                  {/* If RELEASED, show Stream, Video, and Download */}
                  {timeLeft.isReleased && (
                    <>
                      {latestRelease.streamLink && (
                        <a href={latestRelease.streamLink} className="btn-stream" target="_blank" rel="noopener noreferrer">🎵 STREAM NOW</a>
                      )}
                      {latestRelease.youtubeLink && (
                        <a href={latestRelease.youtubeLink} className="btn-watch-video" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block" }}>
                          <i className="fab fa-youtube"></i> WATCH VIDEO
                        </a>
                      )}
                      {latestRelease.audioUrl && (
                        <a href={latestRelease.audioUrl} className="btn-stream" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: "#FF5900", color: "#FFF", marginTop: "10px" }}>
                          <i className="fas fa-download"></i> DOWNLOAD AUDIO
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "#FFF6E1" }}>No releases yet.</p>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials">
        <div className="container">
          <div className="section-title fade-up">
            <h2>WHAT ARE PEOPLE SAYING</h2>
            <p>Testimonies from our community</p>
          </div>
          <div className="testimonial-grid">
            <div className="testimonial-card fade-up">
              <div className="quote-icon">❝</div>
              <p>Good evening sir. I've been wanting to share this since the first release of ElRoi. Thank you for releasing this song. I would its my top on repeat song for the past few days.😄 Each time I listen to the song, it gives me a sense of peace in the inside, I just can't explain it but each time I listen to it, I feel that way and even after, my soul feels refreshed. I love love the sound!</p>
              <div className="name">– Femi</div>
            </div>
            <div className="testimonial-card fade-up">
              <div className="quote-icon">❝</div>
              <p>“My eyes have seen the things you are saying to me” I could feel the weight and the depth of that line, it was more than a lyrics. When I heard it, light literally entered me…the Lord took my mind to the many things he has said and showed me of what is to come…I was just broken. I can’t even explain it, but you see that line sir? It’s deep calling unto deep I tell you</p>
              <div className="name">– Isaac Olugbenga</div>
            </div>
            <div className="testimonial-card fade-up">
              <div className="quote-icon">❝</div>
              <p>I went to play El Roi live recording and I can’t say that happened to me since morning, my spirit have just been lifted up and there’s this joy I have been feeling. My prayers for you is that God will bless you and your team and give you more sounds ooo</p>
              <div className="name">– Christabel</div>
            </div>
            <div className="testimonial-card fade-up">
              <div className="quote-icon">❝</div>
              <p>The first day I listened to one of the sounds just like I saw it on the status of Sir Obi Victor, i didn't know it was a luring by the spirit of God to implicate me 😆 and I can't count the number of times I soaked in the sound until I slept off and it was a day of shift for me as I broke into strange encounters that night. Thank you so much Qôl Asaph Team for these powerful sounds</p>
              <div className="name">– Chinyere Precious</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="container">
          <div className="section-title fade-up"><h2>FREQUENTLY ASKED QUESTIONS</h2></div>
          <div className="faq-list">
            <div className="faq-item fade-up">
              <div className="faq-question" onClick={() => toggleFaq(0)}>
                <span>What is QOL ASAPH?</span>
                <i className={`fas ${openFaq === 0 ? 'fa-minus' : 'fa-plus'}`}></i>
              </div>
              <div className={`faq-answer ${openFaq === 0 ? 'open' : ''}`}>
                <p>QOL ASAPH (Kingdom of Light ASAPH) is a ministry dedicated to raising gatherers and assemblers of ancient sounds. We are a people saddled with priestly duties to minister dutifully in the Presence after the order of Asaph. Our mission is to raise prophetic psalmists and worshipers who carry the sound of heaven to this generation.</p>
              </div>
            </div>
            <div className="faq-item fade-up">
              <div className="faq-question" onClick={() => toggleFaq(1)}>
                <span>How can I join QOL ASAPH?</span>
                <i className={`fas ${openFaq === 1 ? 'fa-minus' : 'fa-plus'}`}></i>
              </div>
              <div className={`faq-answer ${openFaq === 1 ? 'open' : ''}`}>
                <p>You can join us by clicking the <strong>"JOIN US"</strong> button in our navigation bar, which will take you to our WhatsApp community. You can also attend our convergence, partner with us, or reach out through our <a href="/contact" style={{ color: "#FFAE00", textDecoration: "underline" }}>contact page</a>. We welcome everyone who has a heart for prophetic worship and ancient sounds.</p>
              </div>
            </div>
            <div className="faq-item fade-up">
              <div className="faq-question" onClick={() => toggleFaq(2)}>
                <span>What happens at QOL ASAPH events?</span>
                <i className={`fas ${openFaq === 2 ? 'fa-minus' : 'fa-plus'}`}></i>
              </div>
              <div className={`faq-answer ${openFaq === 2 ? 'open' : ''}`}>
                <p>Our events feature prophetic worship sessions, ancient sound ministrations, commissioning services, and corporate prayer & fellowship. QOL ASAPH 1.0 was our inaugural prophetic convergence where we were publicly commissioned into the ministerial responsibility entrusted to us by the Lord. Stay tuned for <strong>QOL ASAPH 2.0</strong>!</p>
              </div>
            </div>
            <div className="faq-item fade-up">
              <div className="faq-question" onClick={() => toggleFaq(3)}>
                <span>How can I support the ministry?</span>
                <i className={`fas ${openFaq === 3 ? 'fa-minus' : 'fa-plus'}`}></i>
              </div>
              <div className={`faq-answer ${openFaq === 3 ? 'open' : ''}`}>
                <p>You can support QOL ASAPH through prayer, partnerships, volunteering, and financial contributions. We believe that every sound needs a vessel, and every vessel needs support. Reach out to us through our <a href="/contact" style={{ color: "#FFAE00", textDecoration: "underline" }}>contact page</a> to learn more about partnership opportunities and how you can be part of what God is doing through this ministry.</p>
              </div>
            </div>
            <div className="faq-item fade-up">
              <div className="faq-question" onClick={() => toggleFaq(4)}>
                <span>How can I submit a testimony?</span>
                <i className={`fas ${openFaq === 4 ? 'fa-minus' : 'fa-plus'}`}></i>
              </div>
              <div className={`faq-answer ${openFaq === 4 ? 'open' : ''}`}>
                <p>We would love to hear your testimony! You can submit it through our <a href="/contact" style={{ color: "#FFAE00", textDecoration: "underline" }}>contact form</a>, email us directly at <strong>Qolasaph@gmail.com</strong>, or share it on our social media platforms. Your testimony could be a blessing to someone else on their journey.</p>
              </div>
            </div>
            <div className="faq-item fade-up">
              <div className="faq-question" onClick={() => toggleFaq(5)}>
                <span>How do I stay updated on events and releases?</span>
                <i className={`fas ${openFaq === 5 ? 'fa-minus' : 'fa-plus'}`}></i>
              </div>
              <div className={`faq-answer ${openFaq === 5 ? 'open' : ''}`}>
                <p>Follow us on social media, join our <strong>WhatsApp group</strong> through the "JOIN US" button in our navigation, or check our website regularly. We post updates about upcoming convergences, new sound releases, and ministry activities on our platforms. Don't miss out on what God is doing through QOL ASAPH!</p>
              </div>
            </div>
            <div className="faq-item fade-up">
              <div className="faq-question" onClick={() => toggleFaq(6)}>
                <span>What is the vision behind QOL ASAPH?</span>
                <i className={`fas ${openFaq === 6 ? 'fa-minus' : 'fa-plus'}`}></i>
              </div>
              <div className={`faq-answer ${openFaq === 6 ? 'open' : ''}`}>
                <p>The vision is bigger than music. It is bigger than a gathering. It is bigger than songs. It is the raising of a people who know God, understand worship beyond music, can discern the voice of God, and carry ancient sounds into a contemporary generation. We are raising prophetic priests whose private altar can sustain their public expression.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}