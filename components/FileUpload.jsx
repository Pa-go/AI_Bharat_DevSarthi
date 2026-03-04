"use client";
import { useState } from "react";
import { Upload, CheckCircle, Loader2 } from "lucide-react";

export default function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setStatus("Uploading to AWS Vault...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setStatus("Success! Saved to S3.");
      } else {
        setStatus("Upload failed.");
      }
    } catch (err) {
      setStatus("Error connecting to AWS.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '2px dashed #6366f1', borderRadius: '12px', textAlign: 'center' }}>
      <label style={{ cursor: 'pointer', color: '#6366f1', fontWeight: 'bold' }}>
        {uploading ? <Loader2 className="animate-spin" /> : <Upload size={24} />}
        <div style={{ marginTop: '8px' }}>{uploading ? "Sending..." : "Upload Syllabus (PDF)"}</div>
        <input type="file" hidden onChange={handleUpload} accept=".pdf" />
      </label>
      {status && <p style={{ fontSize: '12px', marginTop: '10px', color: '#94a3b8' }}>{status}</p>}
    </div>
  );
}