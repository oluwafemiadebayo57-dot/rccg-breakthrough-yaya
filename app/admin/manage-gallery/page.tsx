"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ManageGallery() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/admin/login");
        return;
      }
      try {
        const querySnapshot = await getDocs(collection(db, "gallery"));
        const imageData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setImages(imageData);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this image from the website?")) {
      try {
        await deleteDoc(doc(db, "gallery", id));
        setImages(images.filter(img => img.id !== id));
      } catch (error) {
        console.error("Error deleting image:", error);
        alert("Failed to delete image.");
      }
    }
  };

  return (
    <div className="admin-layout">
      <div className="admin-container">
        
        <div className="admin-header">
          <div className="admin-title-group">
            <h1>MANAGE GALLERY</h1>
          </div>
          <Link href="/admin" className="admin-btn admin-btn-secondary">Back to Dashboard</Link>
        </div>

        {loading ? (
          <p>Loading images...</p>
        ) : images.length === 0 ? (
          <p>No images in the gallery.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
            {images.map((img) => (
              <div key={img.id} style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: "1px solid #333" }}>
                <img src={img.imageUrl} alt="Gallery" style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }} />
                <button 
                  onClick={() => handleDelete(img.id)}
                  className="admin-btn admin-btn-danger"
                  style={{ position: "absolute", top: "10px", right: "10px", padding: "6px 12px", fontSize: "0.8rem" }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}