"use client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { z } from 'zod';
import { buyerSchema } from '@/validation/buyer';

const cityOptions = ["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"];
const propertyTypeOptions = ["Apartment", "Villa", "Plot", "Office", "Retail"];
const bhkOptions = ["1", "2", "3", "4", "Studio"];
const purposeOptions = ["Buy", "Rent"];
const timelineOptions = ["0-3m", "3-6m", ">6m", "Exploring"];
const sourceOptions = ["Website", "Referral", "Walk-in", "Call", "Other"];
const statusOptions = ["New", "Qualified", "Contacted", "Visited", "Negotiation", "Converted", "Dropped"];

// Types based on database schema
interface Buyer {
  id: string;
  fullName: string;
  email?: string | null;
  phone: string;
  city: string;
  propertyType: string;
  bhk?: string | null;
  purpose: string;
  budgetMin?: number | null;
  budgetMax?: number | null;
  timeline: string;
  source: string;
  notes?: string | null;
  tags?: string | null;
  status: string;
  ownerId: string;
  updatedAt: string;
}

interface HistoryEntry {
  id: string;
  buyerId: string;
  changedBy: string;
  changedAt: string;
  diff: Record<string, unknown>;
}

type FormData = z.infer<typeof buyerSchema>;

export function BuyerEditForm({ buyer, history }: { buyer: Buyer, history: HistoryEntry[] }) {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(buyerSchema),
    defaultValues: {
      fullName: buyer.fullName,
      phone: buyer.phone,
      email: buyer.email || "",
      city: buyer.city as "Chandigarh" | "Mohali" | "Zirakpur" | "Panchkula" | "Other",
      propertyType: buyer.propertyType as "Apartment" | "Villa" | "Plot" | "Office" | "Retail",
      bhk: buyer.bhk || "",
      purpose: buyer.purpose as "Buy" | "Rent",
      budgetMin: buyer.budgetMin?.toString() || "",
      budgetMax: buyer.budgetMax?.toString() || "",
      timeline: buyer.timeline as "0-3m" | "3-6m" | ">6m" | "Exploring",
      source: buyer.source as "Website" | "Referral" | "Walk-in" | "Call" | "Other",
      notes: buyer.notes || "",
      tags: typeof buyer.tags === 'string' ? buyer.tags : "",
    },
    mode: "onTouched",
  });
  const propertyType = watch("propertyType");

  const onSubmit = async (data: z.infer<typeof buyerSchema>) => {
    setSubmitting(true);
    setServerError(null);
    setSuccess(false);
    try {
      const res = await fetch(`/api/buyers/${buyer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSuccess(true);
        reset(data);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const err = await res.json();
        setServerError(err.error || "Unknown error");
      }
    } catch (e: unknown) {
      console.error('Update error:', e);
      setServerError(e instanceof Error ? e.message : "Unknown error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-4">
      <div className="max-w-2xl mx-auto bg-neutral-900 rounded-xl shadow-lg p-8 border border-neutral-800">
        <h1 className="text-2xl font-bold mb-4">Edit Buyer</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-label="Edit Buyer Lead">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium" htmlFor="fullName">Full Name *</label>
              <input {...register("fullName")}
                className="input-dark" id="fullName" autoFocus />
              {errors.fullName && <span className="form-error">{errors.fullName.message}</span>}
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="phone">Phone *</label>
              <input {...register("phone")}
                className="input-dark" id="phone" />
              {errors.phone && <span className="form-error">{errors.phone.message}</span>}
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="email">Email</label>
              <input {...register("email")}
                className="input-dark" id="email" />
              {errors.email && <span className="form-error">{errors.email.message}</span>}
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="city">City *</label>
              <select {...register("city")}
                className="input-dark" id="city">
                <option value="">Select</option>
                {cityOptions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.city && <span className="form-error">{errors.city.message}</span>}
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="propertyType">Property Type *</label>
              <select {...register("propertyType")}
                className="input-dark" id="propertyType">
                <option value="">Select</option>
                {propertyTypeOptions.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.propertyType && <span className="form-error">{errors.propertyType.message}</span>}
            </div>
            {(propertyType === "Apartment" || propertyType === "Villa") && (
              <div>
                <label className="block mb-1 font-medium" htmlFor="bhk">BHK *</label>
                <select {...register("bhk")}
                  className="input-dark" id="bhk">
                  <option value="">Select</option>
                  {bhkOptions.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                {errors.bhk && <span className="form-error">{errors.bhk.message}</span>}
              </div>
            )}
            <div>
              <label className="block mb-1 font-medium" htmlFor="purpose">Purpose *</label>
              <select {...register("purpose")}
                className="input-dark" id="purpose">
                <option value="">Select</option>
                {purposeOptions.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.purpose && <span className="form-error">{errors.purpose.message}</span>}
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="budgetMin">Budget Min (INR)</label>
              <input type="number" {...register("budgetMin")}
                className="input-dark" id="budgetMin" />
              {errors.budgetMin && <span className="form-error">{errors.budgetMin.message}</span>}
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="budgetMax">Budget Max (INR)</label>
              <input type="number" {...register("budgetMax")}
                className="input-dark" id="budgetMax" />
              {errors.budgetMax && <span className="form-error">{errors.budgetMax.message}</span>}
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="timeline">Timeline *</label>
              <select {...register("timeline")}
                className="input-dark" id="timeline">
                <option value="">Select</option>
                {timelineOptions.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.timeline && <span className="form-error">{errors.timeline.message}</span>}
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="source">Source *</label>
              <select {...register("source")}
                className="input-dark" id="source">
                <option value="">Select</option>
                {sourceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.source && <span className="form-error">{errors.source.message}</span>}
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="status">Status *</label>
              <select {...register("status")}
                className="input-dark" id="status">
                <option value="">Select</option>
                {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.status && <span className="form-error">{errors.status.message}</span>}
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium" htmlFor="notes">Notes</label>
              <textarea {...register("notes")}
                className="input-dark" id="notes" rows={2} />
              {errors.notes && <span className="form-error">{errors.notes.message}</span>}
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium" htmlFor="tags">Tags (comma separated)</label>
              <input {...register("tags")}
                className="input-dark" id="tags" placeholder="e.g. NRI,Investor" />
              {errors.tags && <span className="form-error">{errors.tags.message}</span>}
            </div>
          </div>
          {serverError && <div className="form-error text-center">{serverError}</div>}
          {success && <div className="text-green-400 text-center">Saved!</div>}
          <button
            type="submit"
            className="w-full py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold transition disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
        <h2 className="text-lg font-semibold mt-8 mb-2">Recent Changes</h2>
        <ul className="mb-4 text-xs">
          {history.map(h => (
            <li key={h.id} className="mb-2">
              <span className="text-neutral-400">{new Date(h.changedAt).toLocaleString()}:</span> {JSON.stringify(h.diff)}
            </li>
          ))}
        </ul>
        <style jsx>{`
          .input-dark {
            background: #18181b;
            color: #f4f4f5;
            border: 1px solid #27272a;
            border-radius: 0.5rem;
            padding: 0.5rem 0.75rem;
            width: 100%;
            outline: none;
            font-size: 1rem;
          }
          .input-dark:focus {
            border-color: #2563eb;
          }
          .form-error {
            color: #f87171;
            font-size: 0.95rem;
          }
        `}</style>
      </div>
    </main>
  );
}
