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
      // If successful, redirect to the dashboard
      router.push("/admin");
    } catch (err: any) {
      console.error(err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#040404", padding: "20px" }}>
      <div style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: "40px", borderRadius: "20px", width: "100%", maxWidth: "400px", border: "1px solid rgba(255,174,0,0.2)" }}>
        <h1 style={{ color: "#FFAE00", textAlign: "center", marginBottom: "30px", fontFamily: "Cinzel, serif", fontSize: "2rem" }}>
          Admin Login
        </h1>
        
        {error && (
          <div style={{ backgroundColor: "rgba(255,0,0,0.2)", color: "#ff4d4d", padding: "10px", borderRadius: "8px", marginBottom: "20px", textAlign: "center" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", color: "#FFF6E1", marginBottom: "8px" }}>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,174,0,0.3)", backgroundColor: "rgba(255,255,255,0.1)", color: "white" }}
            />
          </div>
          <div>
            <label style={{ display: "block", color: "#FFF6E1", marginBottom: "8px" }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,174,0,0.3)", backgroundColor: "rgba(255,255,255,0.1)", color: "white" }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ backgroundColor: "#FFAE00", color: "#040404", padding: "14px", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer", marginTop: "10px" }}
          >
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
}