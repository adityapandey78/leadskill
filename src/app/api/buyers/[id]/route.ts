import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/drizzle/db';
import { buyers, buyerHistory } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { buyerSchema } from '@/validation/buyer';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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
  // Concurrency check
  const existing = await db.query.buyers.findFirst({ where: eq(buyers.id, params.id) });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (data.updatedAt && new Date(data.updatedAt).getTime() !== new Date(existing.updatedAt).getTime()) {
    return NextResponse.json({ error: 'Record changed, please refresh' }, { status: 409 });
  }
  // Ownership check (replace with real user id logic)
  // if (existing.ownerId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const now = new Date();
  try {
    const allowedBhk = ["1", "2", "3", "4", "Studio"];
    const bhkValue = allowedBhk.includes(lead.bhk as any)
      ? (lead.bhk as "1" | "2" | "3" | "4" | "Studio")
      : null;
    const [updated] = await db.update(buyers)
      .set({ ...lead, bhk: bhkValue, updatedAt: now })
      .where(eq(buyers.id, params.id))
      .returning();
    await db.insert(buyerHistory).values({
      buyerId: params.id,
      changedBy: existing.ownerId,
      changedAt: now,
      diff: { updated: true, ...lead },
    });
    return NextResponse.json({ success: true, buyer: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to update lead' }, { status: 500 });
  }
}
