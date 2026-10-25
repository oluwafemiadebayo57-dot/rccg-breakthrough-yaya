"use client";

import { useEffect } from "react";

export default function GlobalEffects() {
  useEffect(() => {
    // Navbar Scroll & Back to Top Visibility
    const navbar = document.getElementById("navbar");
    
    const handleScroll = () => {
      // Navbar background on scroll
      if (window.scrollY > 50) navbar?.classList.add("scrolled");
      else navbar?.classList.remove("scrolled");
      
      // Back to top button visibility
      const btn = document.getElementById("backToTop");
      if (window.scrollY > 500) btn?.classList.add("visible");
      else btn?.classList.remove("visible");
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup listener on unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
}