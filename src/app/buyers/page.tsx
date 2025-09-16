'use client';

import { db } from '@/drizzle/db';
import { buyers } from '@/drizzle/schema';
import { eq, and, ilike, desc, or } from 'drizzle-orm';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Link from 'next/link';
import { BuyersListControls } from './BuyersListControls';
import { BuyersImportForm } from './BuyersImportForm';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 10;

function buildFilters(searchParams: Record<string, string | string[] | undefined>) {
  const filters = [];
  if (searchParams.city) filters.push(eq(buyers.city, searchParams.city as any));
  if (searchParams.propertyType) filters.push(eq(buyers.propertyType, searchParams.propertyType as any));
  if (searchParams.status) filters.push(eq(buyers.status, searchParams.status as any));
  if (searchParams.timeline) filters.push(eq(buyers.timeline, searchParams.timeline as any));
  if (searchParams.q) {
    const q = `%${searchParams.q}%`;
    filters.push(
      or(
        ilike(buyers.fullName, q),
        ilike(buyers.phone, q),
        ilike(buyers.email, q)
      )
    );
  }
  return filters.length ? and(...filters) : undefined;
}

export default async function BuyersPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const page = Number(searchParams.page) || 1;
  const filters = buildFilters(searchParams);
  const query = db.select().from(buyers)
    .where(filters)
    .orderBy(desc(buyers.updatedAt))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);
  const data = await query;

  // For pagination, get total count
  // Use Drizzle's sql template for count
  // @ts-ignore
  const countResult: any = await db.execute(`SELECT COUNT(*)::int as count FROM buyers${filters ? ' WHERE ' + filters : ''}`);
  const totalCount = Number(countResult?.rows?.[0]?.count || 0);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <main className="min-h-screen main-bg text-neutral-100 p-4">
      <ErrorBoundary>
        <div className="max-w-7xl mx-auto bg-opacity-90 bg-neutral-950 rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Buyer Leads</h1>
            <Link href="/buyers/new" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold">+ New Lead</Link>
          </div>
          <BuyersImportSection />
          <BuyersListControls />
          <Suspense fallback={<div>Loading...</div>}>
            <BuyersTable data={data} />
          </Suspense>
          <Pagination page={page} totalPages={totalPages} />
        </div>
      </ErrorBoundary>
    </main>
  );

function BuyersImportSection() {
  const [result, setResult] = useState<any>(null);
  return (
    <div className="mb-4">
      <BuyersImportForm onImport={setResult} />
      {result && (
        <div className="mt-2">
          <div className="text-sm text-green-400 mb-1">Imported: {result.imported} / {result.total}</div>
          {result.errors?.length > 0 && (
            <table className="text-xs bg-neutral-900 border border-neutral-800 rounded w-full">
              <thead><tr><th className="px-2 py-1">Row</th><th className="px-2 py-1">Errors</th></tr></thead>
              <tbody>
                {result.errors.map((e: any, i: number) => (
                  <tr key={i} className="border-t border-neutral-800">
                    <td className="px-2 py-1">{e.row}</td>
                    <td className="px-2 py-1 text-red-400">{e.errors?.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
}

function Pagination({ page, totalPages }: { page: number, totalPages: number }) {
  if (totalPages <= 1) return null;
  const prev = page > 1 ? page - 1 : 1;
  const next = page < totalPages ? page + 1 : totalPages;
  return (
    <div className="flex justify-center gap-2 mt-6">
      <Link href={`?page=${prev}`} className="px-3 py-1 rounded bg-neutral-800 text-neutral-200 hover:bg-neutral-700 disabled:opacity-50" aria-disabled={page === 1}>Prev</Link>
      <span className="px-3 py-1">Page {page} of {totalPages}</span>
      <Link href={`?page=${next}`} className="px-3 py-1 rounded bg-neutral-800 text-neutral-200 hover:bg-neutral-700 disabled:opacity-50" aria-disabled={page === totalPages}>Next</Link>
    </div>
  );
}

function BuyersTable({ data }: { data: any[] }) {
  if (!data.length) return <div className="text-center text-neutral-400 py-12">No leads found.</div>;
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-800">
      <table className="min-w-full bg-neutral-900 text-sm">
        <thead>
          <tr className="text-neutral-400">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">City</th>
            <th className="px-4 py-2">Property Type</th>
            <th className="px-4 py-2">Budget</th>
            <th className="px-4 py-2">Timeline</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Updated</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((b) => (
            <tr key={b.id} className="border-t border-neutral-800 hover:bg-neutral-800">
              <td className="px-4 py-2 font-medium">{b.fullName}</td>
              <td className="px-4 py-2">{b.phone}</td>
              <td className="px-4 py-2">{b.city}</td>
              <td className="px-4 py-2">{b.propertyType}</td>
              <td className="px-4 py-2">{b.budgetMin || '-'} - {b.budgetMax || '-'}</td>
              <td className="px-4 py-2">{b.timeline}</td>
              <td className="px-4 py-2">{b.status}</td>
              <td className="px-4 py-2">{b.updatedAt ? new Date(b.updatedAt).toLocaleString() : '-'}</td>
              <td className="px-4 py-2">
                <Link href={`/buyers/${b.id}`} className="text-blue-400 hover:underline">View / Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
