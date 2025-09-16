"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export function BuyersListControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      if (q) params.set("q", q);
      else params.delete("q");
      params.set("page", "1");
      router.replace(`?${params.toString()}`);
    }, 400);
  return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    // eslint-disable-next-line
  }, [q]);

  // Filters (city, propertyType, status, timeline)
  const handleFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.replace(`?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="flex flex-wrap gap-2 mb-4 items-center">
      <input
        className="input-dark w-48"
        placeholder="Search name, phone, email"
        value={q}
        onChange={e => setQ(e.target.value)}
        aria-label="Search buyers"
      />
      <select className="input-dark" value={searchParams.get("city") || ""} onChange={e => handleFilter("city", e.target.value)} aria-label="Filter by city">
        <option value="">City</option>
        <option>Chandigarh</option>
        <option>Mohali</option>
        <option>Zirakpur</option>
        <option>Panchkula</option>
        <option>Other</option>
      </select>
      <select className="input-dark" value={searchParams.get("propertyType") || ""} onChange={e => handleFilter("propertyType", e.target.value)} aria-label="Filter by property type">
        <option value="">Property Type</option>
        <option>Apartment</option>
        <option>Villa</option>
        <option>Plot</option>
        <option>Office</option>
        <option>Retail</option>
      </select>
      <select className="input-dark" value={searchParams.get("status") || ""} onChange={e => handleFilter("status", e.target.value)} aria-label="Filter by status">
        <option value="">Status</option>
        <option>New</option>
        <option>Qualified</option>
        <option>Contacted</option>
        <option>Visited</option>
        <option>Negotiation</option>
        <option>Converted</option>
        <option>Dropped</option>
      </select>
      <select className="input-dark" value={searchParams.get("timeline") || ""} onChange={e => handleFilter("timeline", e.target.value)} aria-label="Filter by timeline">
        <option value="">Timeline</option>
        <option>0-3m</option>
        <option>3-6m</option>
        <option>&gt;6m</option>
        <option>Exploring</option>
      </select>
    </div>
  );
}
