"use client";

import { useState, useEffect } from "react";

export default function Countdown({ date, time }: { date: string; time: string }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
  } | null>(null);

  useEffect(() => {
    // Combine date and time (e.g., "2026-10-25 5:00 PM")
    const targetDate = new Date(`${date} ${time}`).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (isNaN(targetDate)) {
        clearInterval(interval);
        return;
      }

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
          expired: false,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [date, time]);

  if (!timeLeft || isNaN(new Date(`${date} ${time}`).getTime())) return null;

  if (timeLeft.expired) {
    return (
      <div style={{ color: "var(--secondary)", fontWeight: "bold", fontSize: "1.1rem", margin: "15px 0" }}>
        🔥 The event has started!
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "15px", margin: "20px 0" }}>
      <div className="countdown-box">
        <span className="countdown-num">{timeLeft.days}</span>
        <span className="countdown-label">Days</span>
      </div>
      <div className="countdown-box">
        <span className="countdown-num">{timeLeft.hours}</span>
        <span className="countdown-label">Hrs</span>
      </div>
      <div className="countdown-box">
        <span className="countdown-num">{timeLeft.minutes}</span>
        <span className="countdown-label">Mins</span>
      </div>
      <div className="countdown-box">
        <span className="countdown-num">{timeLeft.seconds}</span>
        <span className="countdown-label">Secs</span>
      </div>
    </div>
  );
}