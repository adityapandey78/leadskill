import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { buyerSchema } from '@/validation/buyer';
import { db } from '../../../../drizzle/db';
import { buyers, buyerHistory } from '../../../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await req.json();
  const parsed = buyerSchema.safeParse({
    ...data,
    tags: typeof data.tags === 'string' ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : data.tags,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const lead = parsed.data;
  const ownerId = uuidv4(); // TODO: Replace with real user id from session
  const now = new Date();
  try {
    const allowedBhk = ["1", "2", "3", "4", "Studio"];
    const bhkValue = allowedBhk.includes(lead.bhk as any)
      ? (lead.bhk as "1" | "2" | "3" | "4" | "Studio")
      : null;
    const [created] = await db.insert(buyers).values({
      ...lead,
      bhk: bhkValue,
      tags: Array.isArray(lead.tags) ? lead.tags : [],
      ownerId,
      updatedAt: now,
    }).returning();
    await db.insert(buyerHistory).values({
      buyerId: created.id,
      changedBy: ownerId,
      changedAt: now,
      diff: { created: true, ...lead },
    });
    return NextResponse.json({ success: true, buyer: created });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to create lead' }, { status: 500 });
  }
}
