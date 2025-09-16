"use client";
import { useState, useRef } from "react";

export function BuyersImportForm({ onImport }: { onImport: (result: any) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  async function handleImport(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!fileInput.current?.files?.[0]) {
      setError("Please select a CSV file.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", fileInput.current.files[0]);
    const res = await fetch("/api/buyers/import", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    setUploading(false);
    if (!res.ok) {
      setError(result.error || "Import failed");
    } else {
      onImport(result);
    }
  }

  return (
    <form onSubmit={handleImport} className="flex gap-2 items-center mt-2 mb-4">
      <input type="file" accept=".csv" ref={fileInput} className="input-dark" />
      <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white font-semibold" disabled={uploading}>
        {uploading ? "Importing..." : "Import CSV"}
      </button>
      {error && <span className="form-error ml-2">{error}</span>}
    </form>
  );
}
