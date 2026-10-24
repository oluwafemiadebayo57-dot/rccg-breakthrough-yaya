"use client";

import { useEffect } from "react";

export default function GlobalEffects() {
  useEffect(() => {
    // 1. Hide Preloader
    const preloader = document.getElementById("preloader");
    if (preloader) preloader.classList.add("hide");

    // 2. Scroll Events (Navbar, Progress Bar, Back to Top)
    const navbar = document.getElementById("navbar");
    const backToTop = document.getElementById("backToTop");
    const progressBar = document.getElementById("progressBar");

    const handleScroll = () => {
      if (window.scrollY > 60) navbar?.classList.add("scrolled");
      else navbar?.classList.remove("scrolled");

      if (window.scrollY > 500) backToTop?.classList.add("visible");
      else backToTop?.classList.remove("visible");

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (progressBar) progressBar.style.width = (scrollTop / docHeight) * 100 + "%";
    };

    window.addEventListener("scroll", handleScroll);

    // 3. Back to Top Click
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
    backToTop?.addEventListener("click", scrollToTop);

    // 4. HAMBURGER MENU TOGGLE (The fix!)
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");
    
    const toggleMenu = () => {
      navLinks?.classList.toggle("open");
    };

    const closeMenu = () => {
      navLinks?.classList.remove("open");
    };

    hamburger?.addEventListener("click", toggleMenu);
    
    // Automatically close the menu when a link is clicked
    const links = navLinks?.querySelectorAll("a");
    links?.forEach(link => link.addEventListener("click", closeMenu));

    // 5. Fade-up Animations (Delayed to prevent Hydration Mismatch)
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
            }
          });
        },
        { threshold: 0.15 }
      );

      const fadeElements = document.querySelectorAll(".fade-up");
      fadeElements.forEach((el) => observer.observe(el));
      
      (window as any).fadeObserver = observer;
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      backToTop?.removeEventListener("click", scrollToTop);
      hamburger?.removeEventListener("click", toggleMenu);
      links?.forEach(link => link.removeEventListener("click", closeMenu));
      if ((window as any).fadeObserver) {
        (window as any).fadeObserver.disconnect();
      }
    };
  }, []);

  return null;
}