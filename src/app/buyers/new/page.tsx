"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buyerSchema } from "@/validation/buyer";
import { z } from "zod";

const schema = buyerSchema;
type FormData = z.infer<typeof schema>;

const cityOptions = ["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"];
const propertyTypeOptions = ["Apartment", "Villa", "Plot", "Office", "Retail"];
const bhkOptions = ["1", "2", "3", "4", "Studio"];
const purposeOptions = ["Buy", "Rent"];
const timelineOptions = ["0-3m", "3-6m", ">6m", "Exploring"];
const sourceOptions = ["Website", "Referral", "Walk-in", "Call", "Other"];

export default function NewBuyerForm() {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const propertyType = watch("propertyType");

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setServerError(null);
    try {
      // TODO: call API to create buyer
      alert("Lead created! (API integration pending)");
    } catch (e: any) {
      setServerError(e.message || "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xl bg-neutral-900 rounded-xl shadow-lg p-8 space-y-6 border border-neutral-800"
        aria-label="Create Buyer Lead"
      >
        <h1 className="text-2xl font-bold mb-2 text-center">New Buyer Lead</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium" htmlFor="fullName">Full Name *</label>
            <input {...register("fullName")}
              className="input-dark" id="fullName" autoFocus aria-invalid={!!errors.fullName} />
            {errors.fullName && <span className="form-error">{errors.fullName.message}</span>}
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="phone">Phone *</label>
            <input {...register("phone")}
              className="input-dark" id="phone" aria-invalid={!!errors.phone} />
            {errors.phone && <span className="form-error">{errors.phone.message}</span>}
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="email">Email</label>
            <input {...register("email")}
              className="input-dark" id="email" aria-invalid={!!errors.email} />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="city">City *</label>
            <select {...register("city")}
              className="input-dark" id="city" aria-invalid={!!errors.city}>
              <option value="">Select</option>
              {cityOptions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.city && <span className="form-error">{errors.city.message}</span>}
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="propertyType">Property Type *</label>
            <select {...register("propertyType")}
              className="input-dark" id="propertyType" aria-invalid={!!errors.propertyType}>
              <option value="">Select</option>
              {propertyTypeOptions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.propertyType && <span className="form-error">{errors.propertyType.message}</span>}
          </div>
          {(propertyType === "Apartment" || propertyType === "Villa") && (
            <div>
              <label className="block mb-1 font-medium" htmlFor="bhk">BHK *</label>
              <select {...register("bhk")}
                className="input-dark" id="bhk" aria-invalid={!!errors.bhk}>
                <option value="">Select</option>
                {bhkOptions.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              {errors.bhk && <span className="form-error">{errors.bhk.message}</span>}
            </div>
          )}
          <div>
            <label className="block mb-1 font-medium" htmlFor="purpose">Purpose *</label>
            <select {...register("purpose")}
              className="input-dark" id="purpose" aria-invalid={!!errors.purpose}>
              <option value="">Select</option>
              {purposeOptions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.purpose && <span className="form-error">{errors.purpose.message}</span>}
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="budgetMin">Budget Min (INR)</label>
            <input type="number" {...register("budgetMin")}
              className="input-dark" id="budgetMin" aria-invalid={!!errors.budgetMin} />
            {errors.budgetMin && <span className="form-error">{errors.budgetMin.message}</span>}
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="budgetMax">Budget Max (INR)</label>
            <input type="number" {...register("budgetMax")}
              className="input-dark" id="budgetMax" aria-invalid={!!errors.budgetMax} />
            {errors.budgetMax && <span className="form-error">{errors.budgetMax.message}</span>}
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="timeline">Timeline *</label>
            <select {...register("timeline")}
              className="input-dark" id="timeline" aria-invalid={!!errors.timeline}>
              <option value="">Select</option>
              {timelineOptions.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.timeline && <span className="form-error">{errors.timeline.message}</span>}
          </div>
          <div>
            <label className="block mb-1 font-medium" htmlFor="source">Source *</label>
            <select {...register("source")}
              className="input-dark" id="source" aria-invalid={!!errors.source}>
              <option value="">Select</option>
              {sourceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.source && <span className="form-error">{errors.source.message}</span>}
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium" htmlFor="notes">Notes</label>
            <textarea {...register("notes")}
              className="input-dark" id="notes" rows={2} aria-invalid={!!errors.notes} />
            {errors.notes && <span className="form-error">{errors.notes.message}</span>}
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium" htmlFor="tags">Tags (comma separated)</label>
            <input {...register("tags")}
              className="input-dark" id="tags" aria-invalid={!!errors.tags} placeholder="e.g. NRI,Investor" />
            {errors.tags && <span className="form-error">{errors.tags.message}</span>}
          </div>
        </div>
        {serverError && <div className="form-error text-center">{serverError}</div>}
        <button
          type="submit"
          className="w-full py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold transition disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Create Lead"}
        </button>
      </form>
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
    </main>
  );
}
