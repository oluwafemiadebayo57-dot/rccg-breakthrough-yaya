"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  if (loading) {
    return <div className="admin-layout" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>Loading Dashboard...</div>;
  }

  return (
    <div className="admin-layout">
      <div className="admin-container">
        
        {/* Header */}
        <div className="admin-header">
          <div className="admin-title-group">
            <h1>ADMIN DASHBOARD</h1>
            <p>Welcome back, <strong>{user?.email}</strong></p>
          </div>
          <button onClick={handleLogout} className="admin-btn admin-btn-danger">
            Logout
          </button>
        </div>

        {/* Dashboard Grid - 2 Columns */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "25px" }}>
          
          {/* Card 1: Events Management */}
          <div className="admin-card">
            <h2 className="admin-card-title">
              <i className="fas fa-calendar-alt"></i> Events Management
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link href="/admin/events" className="admin-btn admin-btn-primary">
                + Add New Event
              </Link>
              <Link href="/admin/manage-events" className="admin-btn admin-btn-secondary">
                Manage Events & Registrations
              </Link>
            </div>
          </div>

          {/* Card 2: Communication & Settings */}
          <div className="admin-card">
            <h2 className="admin-card-title">
              <i className="fas fa-envelope"></i> Communication & Settings
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link href="/admin/messages" className="admin-btn admin-btn-primary">
                Read Messages (Inbox)
              </Link>
              <Link href="/admin/settings" className="admin-btn admin-btn-secondary">
                Edit Site Settings
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}