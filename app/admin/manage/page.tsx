"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ManageReleases() {
  const [releases, setReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.push("/admin/login"); return; }
      try {
        const querySnapshot = await getDocs(collection(db, "releases"));
        const releasesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        releasesData.sort((a: any, b: any) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
        setReleases(releasesData);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    });
    return () => unsubscribe();
  }, [router]);

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteDoc(doc(db, "releases", id));
        setReleases(releases.filter(release => release.id !== id));
      } catch (error) { console.error(error); alert("Failed to delete."); }
    }
  };

  return (
    <div className="admin-layout">
      <div className="admin-container">
        
        <div className="admin-header">
          <div className="admin-title-group">
            <h1>MANAGE RELEASES</h1>
          </div>
          <Link href="/admin" className="admin-btn admin-btn-secondary">Back to Dashboard</Link>
        </div>

        {loading ? (
          <p>Loading releases...</p>
        ) : releases.length === 0 ? (
          <p>No releases found.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {releases.map((release) => (
              <div key={release.id} className="admin-list-item">
                
                <div className="admin-list-info">
                  <img src={release.coverUrl} alt={release.title} className="admin-list-img" />
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#FFAE00" }}>{release.title}</h3>
                    <p style={{ margin: 0, color: "#888", fontSize: "0.85rem" }}>{release.releaseDate || "No date set"}</p>
                  </div>
                </div>

                <div className="admin-list-actions">
                  <Link href={`/admin/edit-release/${release.id}`} className="admin-btn admin-btn-secondary" style={{ padding: "8px 16px" }}>Edit</Link>
                  <button onClick={() => handleDelete(release.id, release.title)} className="admin-btn admin-btn-danger" style={{ padding: "8px 16px" }}>Delete</button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}