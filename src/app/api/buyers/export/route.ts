import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../drizzle/db';
import { buyers } from '../../../../../drizzle/schema';
import { eq, and, ilike, or, desc } from 'drizzle-orm';

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

function toCsv(rows: any[]): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return [
    headers.join(','),
    ...rows.map(row => headers.map(h => escape(row[h])).join(',')),
  ].join('\r\n');
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = Object.fromEntries(url.searchParams.entries());
  const filters = buildFilters(searchParams);
  const data = await db.select().from(buyers)
    .where(filters)
    .orderBy(desc(buyers.updatedAt))
    .limit(1000); // Export up to 1000 rows
  const csv = toCsv(data);
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="buyers.csv"',
    },
  });
}
