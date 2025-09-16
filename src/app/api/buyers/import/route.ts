import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/middleware/rateLimit';
import { db } from '@/drizzle/db';
import { buyers } from '@/drizzle/schema';
import { csvBuyerSchema } from '@/validation/buyer';
import { z } from 'zod';
import { parse } from 'csv-parse/sync';

export async function POST(req: NextRequest) {
  const limitRes = rateLimit(req);
  if (limitRes) return limitRes;
  const formData = await req.formData();
  const file = formData.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }
  const text = await file.text();
  let records: any[];
  try {
    records = parse(text, { columns: true, skip_empty_lines: true });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid CSV format' }, { status: 400 });
  }
  const results: { row: number; data?: any; errors?: string[] }[] = [];
  for (let i = 0; i < records.length; i++) {
    const row = records[i];
    const parsed = csvBuyerSchema.safeParse(row);
    if (parsed.success) {
      results.push({ row: i + 1, data: parsed.data });
    } else {
      results.push({ row: i + 1, errors: parsed.error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`) });
    }
  }
  const validRows = results.filter(r => r.data).map(r => r.data);
  if (validRows.length > 0) {
    await db.insert(buyers).values(validRows);
  }
  return NextResponse.json({
    imported: validRows.length,
    errors: results.filter(r => r.errors),
    total: records.length,
  });
}
