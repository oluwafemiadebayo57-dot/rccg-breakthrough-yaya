"use client";

import { Suspense, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import GlobalEffects from "./GlobalEffects";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");
  const [isLoading, setIsLoading] = useState(true);
  
  // State to control the hamburger menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hide preloader after 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Close mobile menu automatically when navigating to a new page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {!isAdminPage && (
        <>
          {/* PRELOADER */}
          <div id="preloader" className={isLoading ? "" : "hidden"}>
            <div className="loader-icon">
              <img src="/images/rccg-yaya-logo.png" alt="RCCG YAYA Logo" />
            </div>
          </div>
          
          <div id="progressBar"></div>
          <button id="backToTop" aria-label="Back to top"><i className="fas fa-arrow-up"></i></button>
          
          {/* GLOBAL EFFECTS */}
          <GlobalEffects />
          
          {/* NAVBAR */}
          <header className="navbar" id="navbar">
            <div className="container">
              <div className="logo">
                <img src="/images/rccg-yaya-logo.png" alt="RCCG YAYA LOGO" />
                RCCG YAYA
              </div>
              
              {/* HAMBURGER BUTTON */}
              <button 
                className="hamburger" 
                id="hamburger" 
                aria-label="Menu"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span></span><span></span><span></span>
              </button>

              {/* NAV LINKS */}
              <ul className={`nav-links ${isMenuOpen ? "open" : ""}`} id="navLinks">
                <li><Link href="/" className="active" onClick={() => setIsMenuOpen(false)}>HOME</Link></li>
                <li><Link href="/about" onClick={() => setIsMenuOpen(false)}>ABOUT US</Link></li>
                <li><Link href="/events" onClick={() => setIsMenuOpen(false)}>EVENTS</Link></li>
                <li><Link href="/contact" onClick={() => setIsMenuOpen(false)}>CONTACT US</Link></li>
                <li>
                  {/* TODO: Replace with actual WhatsApp link later */}
                  <a 
                    href="https://chat.whatsapp.com/" 
                    className="nav-join-btn" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-whatsapp"></i> JOIN US
                  </a>
                </li>
              </ul>
            </div>
          </header>
        </>
      )}

      {/* MAIN CONTENT */}
      <main suppressHydrationWarning>{children}</main>

      {/* FOOTER */}
      {!isAdminPage && (
        <footer>
          <div className="container">
            <div className="footer-row">
              <div className="footer-logo">
                <div className="logo-wrapper">
                  <h3>RCCG BREAKTHROUGH YAYA</h3>
                </div>
                <p>Raising Champions for Christ</p>
              </div>
              <div className="footer-social">
                {/* TODO: Replace # with actual links and numbers before deployment */}
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-whatsapp"></i> JOIN YAYA WHATSAPP
                </a>
                <a href="tel:+2340000000000">
                  <i className="fas fa-phone-alt"></i> +234 000 000 0000
                </a>
                <a href="mailto:info@rccgyaya.com">
                  <i className="fas fa-envelope"></i> info@rccgyaya.com
                </a>
                <a href="#" target="_blank">
                  <i className="fab fa-instagram"></i> @rccgyaya
                </a>
              </div>
            </div>
            <div className="footer-bottom">
              © {new Date().getFullYear()} RCCG BREAKTHROUGH YAYA. All Rights Reserved.
            </div>
          </div>
        </footer>
      )}
    </>
  );
}

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body suppressHydrationWarning>
      <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "#120C06" }} />}>
        <LayoutContent>{children}</LayoutContent>
      </Suspense>
    </body>
  );
}