"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err: any) {
      console.error(err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-layout" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="admin-card" style={{ width: "100%", maxWidth: "450px", padding: "50px 40px" }}>
        
        <h1 style={{ color: "var(--secondary)", textAlign: "center", marginBottom: "10px", fontFamily: "Cinzel, serif", fontSize: "2rem" }}>
          YAYA ADMIN
        </h1>
        <p style={{ textAlign: "center", color: "#64748B", marginBottom: "30px" }}>Secure Login</p>
        
        {error && (
          <div style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#EF4444", padding: "10px", borderRadius: "8px", marginBottom: "20px", textAlign: "center", border: "1px solid #EF4444" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="admin-form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="admin-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@rccgyaya.com"
            />
          </div>
          <div className="admin-form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="admin-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="admin-btn admin-btn-primary"
            style={{ marginTop: "10px", padding: "16px" }}
          >
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
}