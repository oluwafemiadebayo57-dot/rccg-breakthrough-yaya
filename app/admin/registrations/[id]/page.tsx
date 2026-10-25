"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EventRegistrations() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [eventData, setEventData] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/admin/login");
        return;
      }
      if (!id) return;

      try {
        // 1. Fetch the Event Details
        const eventDoc = await getDoc(doc(db, "events", id));
        if (eventDoc.exists()) {
          setEventData(eventDoc.data());
        }

        // 2. Fetch all registrations for this event
        const q = query(collection(db, "registrations"), where("eventId", "==", id));
        const querySnapshot = await getDocs(q);
        
        const regData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort by newest first
        regData.sort((a: any, b: any) => {
           const dateA = a.createdAt?.toMillis() || 0;
           const dateB = b.createdAt?.toMillis() || 0;
           return dateB - dateA;
        });

        setRegistrations(regData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [id, router]);

  // CSV EXPORT FUNCTION
  const downloadCSV = () => {
    if (registrations.length === 0) {
      alert("No registrations to download.");
      return;
    }

    // Define headers
    const headers = ["Name", "Email", "Phone Number", "Department", "Date Registered"];
    
    // Map through data and wrap in quotes to prevent comma issues in Excel
    const csvRows = registrations.map(reg => [
      `"${reg.name || ""}"`,
      `"${reg.email || ""}"`,
      `"${reg.phone || ""}"`,
      `"${reg.department || ""}"`,
      `"${reg.createdAt ? new Date(reg.createdAt.toMillis()).toLocaleString() : ""}"`
    ].join(","));

    // Combine headers and rows
    const csvString = [headers.join(","), ...csvRows].join("\n");

    // Create a Blob and trigger download
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${eventData?.title || "Event"}_Registrations.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="admin-layout" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>Loading Registrations...</div>;

  return (
    <div className="admin-layout">
      <div className="admin-container">
        
        <div className="admin-header">
          <div className="admin-title-group">
            <h1>REGISTRATIONS</h1>
            <p>{eventData?.title} - {eventData?.date}</p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button onClick={downloadCSV} className="admin-btn admin-btn-primary" style={{ backgroundColor: "var(--primary)", color: "var(--dark)" }}>
              <i className="fas fa-file-csv"></i> Download CSV
            </button>
            <Link href="/admin/manage-events" className="admin-btn admin-btn-secondary">Back to Events</Link>
          </div>
        </div>

        {/* Total Count Badge */}
        <div style={{ marginBottom: "20px", display: "inline-block", backgroundColor: "rgba(0, 51, 160, 0.1)", padding: "10px 20px", borderRadius: "8px", border: "1px solid rgba(0, 51, 160, 0.2)" }}>
          <strong style={{ color: "var(--secondary)", fontSize: "1.1rem" }}>Total Registered: {registrations.length}</strong>
        </div>

        {registrations.length === 0 ? (
          <div className="admin-card" style={{ textAlign: "center", padding: "40px" }}>
            <p>No one has registered for this event yet.</p>
          </div>
        ) : (
          <div className="admin-card" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid rgba(0, 51, 160, 0.1)" }}>
                  <th style={{ padding: "15px", color: "var(--secondary)" }}>Name</th>
                  <th style={{ padding: "15px", color: "var(--secondary)" }}>Email</th>
                  <th style={{ padding: "15px", color: "var(--secondary)" }}>Phone</th>
                  <th style={{ padding: "15px", color: "var(--secondary)" }}>Department</th>
                  <th style={{ padding: "15px", color: "var(--secondary)" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id} style={{ borderBottom: "1px solid #E2E8F0" }}>
                    <td style={{ padding: "15px", fontWeight: "bold", color: "var(--dark)" }}>{reg.name}</td>
                    <td style={{ padding: "15px", color: "#64748B" }}>{reg.email}</td>
                    <td style={{ padding: "15px", color: "#64748B" }}>{reg.phone}</td>
                    <td style={{ padding: "15px", color: "#64748B" }}>{reg.department || "-"}</td>
                    <td style={{ padding: "15px", color: "#64748B", fontSize: "0.85rem" }}>
                      {reg.createdAt ? new Date(reg.createdAt.toMillis()).toLocaleDateString() : "Just now"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}