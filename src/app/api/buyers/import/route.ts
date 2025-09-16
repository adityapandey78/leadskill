import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/middleware/rateLimit';
import { db } from '@/drizzle/db';
import { buyers } from '@/drizzle/schema';
import { csvBuyerSchema } from '@/validation/buyer';
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
  let records: Record<string, string>[];
  try {
    records = parse(text, { columns: true, skip_empty_lines: true });
  } catch {
    return NextResponse.json({ error: 'Invalid CSV format' }, { status: 400 });
  }
  const results: { row: number; data?: unknown; errors?: string[] }[] = [];
  for (let i = 0; i < records.length; i++) {
    const row: Record<string, string | undefined> = { ...records[i] };
    
    // Clean up empty string fields
    Object.keys(row).forEach(key => {
      if (row[key] === '') {
        row[key] = undefined;
      }
    });
    
    const parsed = csvBuyerSchema.safeParse(row);
    if (parsed.success) {
      // Add required fields for database insert
      const buyerData = {
        ...parsed.data,
        ownerId: '00000000-0000-0000-0000-000000000000', // Default owner for imports
      };
      results.push({ row: i + 1, data: buyerData });
    } else {
      results.push({ row: i + 1, errors: parsed.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`) });
    }
  }
  const validRows = results.filter(r => r.data).map(r => r.data!);
  if (validRows.length > 0) {
    // Type assertion is needed here because of complex Drizzle types
    await db.insert(buyers).values(validRows as typeof buyers.$inferInsert[]);
  }
  return NextResponse.json({
    imported: validRows.length,
    errors: results.filter(r => r.errors),
    total: records.length,
  });
}
