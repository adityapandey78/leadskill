import { db } from '@/drizzle/db';
import { buyers, buyerHistory } from '@/drizzle/schema';
import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';

import { BuyerEditForm } from './BuyerEditForm';

export default async function BuyerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Auth handled by middleware - keeping for future use
  // const session = await getServerSession(authOptions);
  const buyer = await db.query.buyers.findFirst({ where: eq(buyers.id, id) });
  if (!buyer) return notFound();
  const history = await db.select().from(buyerHistory)
    .where(eq(buyerHistory.buyerId, id))
    .orderBy(desc(buyerHistory.changedAt))
    .limit(5);

  // Convert Date objects to strings for client component compatibility
  const buyerWithStringDates = {
    ...buyer,
    updatedAt: buyer.updatedAt.toISOString(),
  };
  
  const historyWithStringDates = history.map(h => ({
    ...h,
    changedAt: h.changedAt.toISOString(),
    diff: h.diff as Record<string, unknown>,
  }));

  // Editable form (client component)
  return <BuyerEditForm buyer={buyerWithStringDates} history={historyWithStringDates} />;
}

// (imports already present at top of file)

// All form logic moved to BuyerEditForm.tsx
