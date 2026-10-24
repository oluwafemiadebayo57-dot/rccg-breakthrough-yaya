"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import GlobalEffects from "./GlobalEffects";

// 1. Create a separate component for the content that depends on the pathname
function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminPage && (
        <>
          <div id="preloader">
            <div className="loader-icon">
              <img src="/images/QOL ASAPH GOLD.png" alt="QOL ASAPH Logo" />
            </div>
          </div>
          <div id="progressBar"></div>
          <button id="backToTop" aria-label="Back to top"><i className="fas fa-arrow-up"></i></button>
          <GlobalEffects />
          
          <header className="navbar" id="navbar">
            <div className="container">
              <div className="logo">
                <img src="/images/QOL ASAPH GOLD.png" alt="QOL ASAPH LOGO" />
                QOL ASAPH
              </div>
              <button className="hamburger" id="hamburger" aria-label="Menu">
                <span></span><span></span><span></span>
              </button>
              <ul className="nav-links" id="navLinks">
                <li><a href="/" className="active">HOME</a></li>
                <li><a href="/about">ABOUT US</a></li>
                <li><a href="/events">EVENTS</a></li>
                <li><a href="/sounds">SOUNDS</a></li> {/* <--- NEW SOUNDS LINK ADDED HERE */}
                <li><a href="/contact">CONTACT US</a></li>
                <li>
                  <a href="https://chat.whatsapp.com/GTGNbGMsr5Y1MJ9ZY4Gsnc" className="nav-join-btn" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-whatsapp"></i> JOIN US
                  </a>
                </li>
              </ul>
            </div>
          </header>
        </>
      )}

      <main suppressHydrationWarning>{children}</main>

      {!isAdminPage && (
        <footer>
          <div className="container">
            <div className="footer-row">
              <div className="footer-logo">
                <div className="logo-wrapper">
                  <h3>QOL ASAPH</h3>
                </div>
                <p>Raising pleasant incense to Yahweh</p>
              </div>
              <div className="footer-social">
                <a href="https://chat.whatsapp.com/GTGNbGMsr5Y1MJ9ZY4Gsnc" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-whatsapp"></i> JOIN WHATSAPP GROUP
                </a>
                <a href="tel:+2348164566735"><i className="fas fa-phone-alt"></i> +234 816 456 6735</a>
                <a href="mailto:Qolasaph@gmail.com"><i className="fas fa-envelope"></i> Qolasaph@gmail.com</a>
                <a href="#" target="_blank"><i className="fab fa-instagram"></i> @qolasaph</a>
              </div>
            </div>
            <div className="footer-bottom">© 2026 QOL ASAPH. All Rights Reserved.</div>
          </div>
        </footer>
      )}
    </>
  );
}

// 2. Export the wrapper and wrap the content in Suspense
export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body suppressHydrationWarning>
      <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "#040404" }} />}>
        <LayoutContent>{children}</LayoutContent>
      </Suspense>
    </body>
  );
}