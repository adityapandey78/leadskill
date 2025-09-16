import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/middleware/rateLimit';
import { db } from '@/drizzle/db';
import { buyers } from '@/drizzle/schema';
import { csvBuyerSchema } from '@/validation/buyer';
import { parse } from 'csv-parse/sync';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
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
    } catch (parseError) {
      console.error('CSV Parse Error:', parseError);
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
          ownerId: uuidv4(), // Generate a unique ID for each import
        };
        results.push({ row: i + 1, data: buyerData });
      } else {
        results.push({ row: i + 1, errors: parsed.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`) });
      }
    }
    
    const validRows = results.filter(r => r.data).map(r => r.data!);
    
    if (validRows.length > 0) {
      try {
        // Type assertion is needed here because of complex Drizzle types
        await db.insert(buyers).values(validRows as typeof buyers.$inferInsert[]);
      } catch (dbError) {
        console.error('Database Insert Error:', dbError);
        return NextResponse.json({ 
          error: 'Database error occurred during import',
          details: dbError instanceof Error ? dbError.message : 'Unknown database error'
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({
      imported: validRows.length,
      errors: results.filter(r => r.errors),
      total: records.length,
    });
  } catch (error) {
    console.error('Import Route Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
