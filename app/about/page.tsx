"use client";

import "../../styles/about-style.css";
import { useEffect, useRef } from "react";

export default function About() {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // --- STATS COUNTER ANIMATION ---
    let countersAnimated = false;
    const statNumbers = document.querySelectorAll(".stat-number");

    const animateCounter = (el: Element) => {
      const target = parseInt(el.getAttribute("data-target") || "0");
      const suffix = el.getAttribute("data-suffix") || "";
      const duration = 2000;
      const startTime = performance.now();

      const updateCounter = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);
        
        el.textContent = current + suffix;
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = target + suffix;
        }
      };
      requestAnimationFrame(updateCounter);
    };

    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            statNumbers.forEach((el) => animateCounter(el));
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      statsObserver.observe(statsRef.current);
    }

    return () => {
      statsObserver.disconnect();
    };
  }, []);

  return (
    <>
      {/* HERO / PAGE HEADER */}
      <section id="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="hero-glass-card glass-hero">
            <h1>ABOUT US</h1>
            <div className="golden-line"></div>
          </div>
        </div>
      </section>

      {/* WHO ARE WE? */}
      <section id="who-we-are">
        <div className="container">
          <div className="who-grid">
            <div className="who-text">
              <span className="section-tag">WHO ARE WE?</span>
              <h2>WE ARE <span className="highlight">QOL ASAPH</span></h2>
              <div className="subtext-glass glass-light">
                <p>WE ARE GATHERERS AND ASSEMBLERS OF ANCIENT SOUNDS SADDLED WITH PRIESTLY DUTIES TO MINISTER DUTIFULLY IN THE PRESENCE AFTER THE ORDER OF ASAPH</p>
              </div>
              <div className="btn-wrapper">
                <a href="#story" className="btn-glass btn-primary-glass">LEARN MORE ABOUT OUR JOURNEY</a>
              </div>
            </div>
            <div className="who-image">
              <img src="https://res.cloudinary.com/izxlyyn5/image/upload/v1787566683/QOL_ASAPH_GOLD.png" alt="QOL ASAPH Logo" />
            </div>
          </div>
        </div>
      </section>

      {/* THE LEADER BEHIND THE ASSIGNMENT */}
      <section id="leader">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title gold">THE LEADER BEHIND THE ASSIGNMENT</h2>
            <p className="section-subtitle leader-subtitle">"Before a man can lead people into a place, he must have encountered that place himself."</p>
          </div>
          <div className="leader-grid">
            {/* Left Column - Image */}
            <div className="leader-image">
              <div className="leader-img-placeholder">
                <img 
                  src="https://res.cloudinary.com/izxlyyn5/image/upload/v1787566523/OBI_VICTOR.png" 
                  alt="OBI VICTOR - Leader of QOL ASAPH" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="leader-img-fallback">
                  <i className="fas fa-user-circle"></i>
                  <span>OBI VICTOR</span>
                  <span className="leader-role">Founder &amp; Lead Worshiper</span>
                </div>
              </div>
              {/* Creative Name Badge Below Image */}
              <div className="leader-name-badge glass-name-badge">
                <span className="name-prefix"><i className="fas fa-crown"></i> THE VISIONARY</span>
                <span className="name-main">OBI VICTOR</span>
                <span className="name-title">Founder &amp; Lead Worshiper</span>
              </div>
            </div>
            {/* Right Column - Content */}
            <div className="leader-content glass-leader-text">
              <div className="leader-bio">
                <p><strong>It is to help raise people who carry sound.</strong></p>
                <p>To gather voices. To assemble melodies. To recover ancient sounds. To cultivate worshippers whose lives become altars. And to see a generation encounter God through worship that proceeds from spiritual depth rather than performance.</p>
                
                <div className="leader-divider"></div>
                
                <h4>THE LEADER BEHIND THE ASSIGNMENT</h4>
                <p><strong>OBI VICTOR's leadership</strong> is increasingly shaped by the understanding that spiritual leadership is first a matter of formation.</p>
                <p>Before a man can lead people into a place, he must have encountered that place himself.</p>
                <p>Before he can call others into worship, worship must have become his own language.</p>
                <p>Before he can gather voices, he must become acquainted with the Voice.</p>
                <p>And before he can build anything for God, he must allow God to build something within him.</p>
                
                <div className="leader-quote-block">
                  <i className="fas fa-quote-left"></i>
                  <p>This has produced a leadership philosophy centred on <strong>encounter, alignment, consecration and expression.</strong></p>
                </div>
                
                <p>He does not see leadership merely as occupying a position. He sees leadership as carrying a responsibility for <strong>people, a generation and a divine assignment.</strong></p>
                
                <div className="leader-divider"></div>
                
                <h4>THE VISION</h4>
                <p>The vision is bigger than music. It is bigger than a gathering. It is bigger than songs.</p>
                <p>It is the raising of a people.</p>
                
                <p style={{ marginBottom: "8px" }}><strong>A people who know God.</strong></p>
                <p>A people who understand worship beyond music.</p>
                <p>A people who can discern the voice of God.</p>
                <p>A people whose priesthood is stronger than their platform.</p>
                <p>A people whose private altar can sustain their public expression.</p>
                <p>A people who carry ancient sounds into a contemporary generation.</p>
                <p>A people who do not merely sing about God, but become witnesses of His presence.</p>
                
                <div className="leader-quote-block gold">
                  <i className="fas fa-quote-left"></i>
                  <p>This is the burden. To see Judah arise. To see worshippers return to the altar. To see prophetic priests raised. To see voices gathered. To see ancient sounds recovered. And ultimately, to see a generation whose worship becomes a testimony that God is still worthy.</p>
                </div>
                
                <div className="leader-divider"></div>
                
                <h4>THE JOURNEY CONTINUES</h4>
                <p>The journey that began with a personal encounter with Christ in 2019 has continued to unfold through seasons of prayer, encounters, prophetic insight, formation and increasing clarity of assignment.</p>
                <p>There is still much to be built. Much to be learned. Much to be carried.</p>
                <p>But the direction is becoming increasingly clear.</p>
                <p>The assignment is not simply to make a sound. <strong>It is to raise the people who will carry it.</strong></p>
                
                <div className="leader-quote-block final">
                  <i className="fas fa-quote-left"></i>
                  <p><em>"To raise a generation of worshippers whose sound comes from an altar, whose lives are aligned with God, and whose worship goes before them."</em></p>
                </div>
                
                <div className="leader-closing">
                  <p><strong>This is the burden.</strong><br />
                  <strong>This is the assignment.</strong><br />
                  <strong>This is the journey.</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEET THE TEAM (THE ASAPHITES) */}
      <section id="team">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title gold">THE ASAPHITES</h2>
            <p className="section-subtitle">The voices and vessels behind Qôl Asaph</p>
          </div>
          
          <div className="team-image-container">
            <img 
              src="https://res.cloudinary.com/izxlyyn5/image/upload/v1792766171/IMG_2661.jpg" 
              alt="QOL ASAPH Team" 
              className="team-image"
            />
          </div>
          
          <div className="team-description glass-light">
            <p>
              We are a collective of worshippers, musicians, and prophetic voices united by a single mandate: to gather and assemble ancient sounds for this generation. We do not merely perform; we minister. We do not just sing; we steward the sound of heaven.
            </p>
          </div>
        </div>
      </section>

      {/* THE STORY OF OUR COMMISSIONING */}
      <section id="story">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">THE STORY OF OUR COMMISSIONING</h2>
            <p className="section-subtitle">"Every Great Outcome Is a Product of Great Foundations"</p>
          </div>
          <div className="story-grid">
            <div className="story-card glass-dark">
              <h3>THE BURDEN BEGINS</h3>
              <p>Around July 2025, a deeper desire began to grow within us: a desire to minister these sounds first in our personal devotion and fellowship. It was not initially a public ministry. There was no platform. There was no elaborate structure. There was simply a growing burden and an increasing sensitivity to what we believed the Lord was placing within us. During this season, we began making simple recordings of these sounds on our personal devices. At the time, the recordings were not intended to represent a finished ministry or public project. We simply wanted to preserve what we were receiving. Looking back, those recordings became markers of divine providence. They became evidence that something had begun before we fully understood what it was.</p>
            </div>
            <div className="story-card glass-dark">
              <h3>ELROI: THE GATE</h3>
              <p>By September 2025, we received one of the sounds that would become significant to the journey: ELROI. ELROI became more than a song to us. It became a gate through which our understanding began to expand. What had previously seemed like scattered moments of worship and personal expression began to take on a broader shape. We began to recognize that this was something we could not afford to treat casually. There was a weight to it. There was an instruction attached to it. There was a responsibility to steward what we were receiving.</p>
            </div>
            <div className="story-card glass-dark">
              <h3>THE RETREAT AND THE INSTRUCTION</h3>
              <p>Towards December 2025, we embarked on a retreat to seek the Lord concerning the year 2026 and to inquire what He would have us do. It was during this period of seeking that a clearer instruction emerged concerning ELROI. We were led to properly record the sound. The instruction was no longer simply to preserve what had been received privately. We were being led toward a more deliberate act of stewardship and release. We obeyed. On 4 March 2026, ELROI was properly recorded. It was subsequently released on 18 May 2026. What followed became another significant marker in the journey. We witnessed the hand of God in ways that strengthened our conviction concerning the assignment. The sound travelled beyond what we could have achieved through our own reach, eventually reaching listeners across 125 nations around the world.</p>
            </div>
            <div className="story-card glass-dark">
              <h3>FROM SOUND TO COMMISSION</h3>
              <p>The journey with ELROI opened our eyes to a larger picture. We began to understand that the assignment could not remain confined to individual sounds or private moments of worship. There was a broader expression that needed to emerge. This eventually led to the birth of Qôl Asaph 1.0. Qôl Asaph 1.0 became our first prophetic convergence and, at the same time, our inaugural service. More importantly, it became a moment of public acknowledgement and commissioning into the ministerial responsibility we believe the Lord had entrusted to us. On 23 July 2026, we gathered for Qôl Asaph 1.0. What had begun quietly in a room at FUPRE in 2025 had now become a ministry being publicly stewarded.</p>
            </div>
            <div className="story-card glass-dark story-quote">
              <div className="quote-content">
                <i className="fas fa-quote-left"></i>
                <p>We did not invent the sound. We responded to it. We did not begin with a platform. We began with service. We did not begin with an audience. We began with devotion. We did not begin with a ministry structure. We began with obedience. And we believe that the public expression of Qôl Asaph must never become greater than the private altar from which it was born.</p>
                <span className="quote-author">– QOL ASAPH Commission</span>
              </div>
            </div>
            <div className="story-card glass-dark">
              <h3>THE FOUNDATION</h3>
              <p>Therefore, the story of Qôl Asaph is ultimately not a story about an event, a song, a gathering, or a brand. It is a story of stewardship. A story of responding to divine instruction. A story of sounds received in hidden places and eventually carried into public spaces. And as we move forward, we remain conscious of the responsibility that comes with the assignment: to hear, to steward, to obey, and to release what has been entrusted to us. This is the story of our commissioning. This is where Qôl Asaph began.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS / IMPACT COUNTERS */}
      <section id="stats" ref={statsRef}>
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card glass-stats" id="stat1">
              <i className="fas fa-heart stat-icon"></i>
              <div className="stat-number" data-target="10000" data-suffix="+">0</div>
              <div className="stat-label">SOULS REACHED</div>
            </div>
            <div className="stat-card glass-stats" id="stat2">
              <i className="fas fa-globe-americas stat-icon"></i>
              <div className="stat-number" data-target="125" data-suffix="+">0</div>
              <div className="stat-label">NATIONS REACHED</div>
            </div>
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section id="vision-mission">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title gold">OUR VISION &amp; MISSION</h2>
          </div>
          <div className="vm-grid">
            {/* VISION CARD */}
            <div className="vm-card glass-vision">
              <div className="vm-icon"><i className="fas fa-eye"></i></div>
              <h3>OUR VISION</h3>
              <p><strong>To raise Gatherers and Assemblers of Divine Instruments</strong>, men and women entrusted with the responsibility of representing the reality of God's Kingdom at the gates of Priesthood and Kingship, through Prophetic Sounds, the ministry of the Word and Prayer, and the demonstration of the Power of the Holy Spirit.</p>
              <span className="scripture"><strong>Scriptural Foundation:</strong> 1 Chronicles 16:36–37 — "Blessed be the LORD God of Israel for ever and ever. And all the people said, Amen, and praised the LORD." "So, he left there before the ark of the covenant of the LORD Asaph and his brethren, to minister before the ark continually, as every day's work required."</span>
              <p style={{ marginTop: "16px", color: "#d4c9b4" }}>The ministry of Asaph provides a foundational picture of men entrusted to continually minister before the Presence of God. Qôl Asaph draws from this pattern: men and women formed in the Presence, equipped with the Word, yielded to the Spirit, and entrusted with divine instruments for the advancement of God's Kingdom.</p>
            </div>

            {/* MISSION CARD */}
            <div className="vm-card glass-mission">
              <div className="vm-icon"><i className="fas fa-scroll"></i></div>
              <h3>OUR MISSION</h3>
              <p>Qôl Asaph exists to fulfill this vision through four primary expressions:</p>
              <ul>
                <li><strong className="mission-title">THE MINISTRY OF THE WORD</strong> — To preach and minister the Word of God with depth, clarity, precision, and spiritual understanding. We believe sound cannot replace the Word. The Word establishes truth, provides foundation, brings understanding, and gives form to what we carry.</li>
                <li><strong className="mission-title">THE DEMONSTRATION OF THE POWER OF THE HOLY SPIRIT</strong> — To demonstrate the power of the Holy Spirit through prayer, prophecy, faith, healing, deliverance, and the operation of the gifts of the Spirit. We believe the Gospel is not merely communicated through words but can also be demonstrated through the power of the Spirit. Our pursuit is not the manifestation itself, but Christ being revealed through the manifestation.</li>
                <li><strong className="mission-title">THE RAISING OF PROPHETIC PSALMISTS &amp; WORSHIPERS</strong> — To raise prophetic psalmists and worshipers who will stand at the gates of stewardship, carrying sanctity through yieldedness, consecration, and alignment with God. We seek to raise worshipers whose ministry flows from the Presence rather than performance; men and women who understand that the privilege of carrying sound comes with the responsibility of maintaining the altar from which the sound proceeds. The goal is not simply to raise singers. It is to raise priests who can carry sound.</li>
                <li><strong className="mission-title">THE MAKING OF MATURED DISCIPLES</strong> — To raise spiritually and intellectually mature disciples through intentional discipleship, mentorship, accountability, instruction, and formation. We believe that spiritual maturity must be accompanied by intellectual maturity, character, responsibility, and the ability to faithfully steward what has been entrusted. Therefore, Qôl Asaph is committed not merely to gathering people, but to forming people.</li>
              </ul>
              <div style={{ marginTop: "20px", padding: "16px 18px", background: "rgba(255, 174, 0, 0.06)", borderRadius: "12px", borderLeft: "3px solid var(--secondary)" }}>
                <p style={{ fontWeight: 700, color: "var(--secondary)", letterSpacing: "0.5px" }}>OUR MANTRA AND PATTERN</p>
                <p style={{ color: "#d4c9b4", fontStyle: "italic", lineHeight: 2 }}>
                  We come into the Presence.<br />
                  We are formed in the Presence.<br />
                  We receive and steward what is entrusted.<br />
                  We minister from what we have received.<br />
                  And through faithful ministry, we represent the reality of God's Kingdom in the earth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA / JOIN THE MOVEMENT */}
      <section id="cta">
        <div className="cta-overlay"></div>
        <div className="container">
          <div className="cta-glass-card glass-cta">
            <h2>BECOME PART OF THE COMMISSION</h2>
            <p>Join us in raising pleasant incense to Yahweh with ancient sounds</p>
            <div className="cta-buttons">
              <a href="https://chat.whatsapp.com/GTGNbGMsr5Y1MJ9ZY4Gsnc" className="btn-cta-primary" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-whatsapp"></i> JOIN THE TRAIN
              </a>
              <a href="/contact" className="btn-cta-secondary">CONTACT US</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}