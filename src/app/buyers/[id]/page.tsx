import { db } from '../../../../drizzle/db';
import { buyers, buyerHistory } from '../../../../drizzle/schema';
import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { buyerSchema } from '@/validation/buyer';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]';

import { BuyerEditForm } from './BuyerEditForm';

export default async function BuyerDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  // const userId = session?.user?.id; // Not used for demo
  const buyer = await db.query.buyers.findFirst({ where: eq(buyers.id, params.id) });
  if (!buyer) return notFound();
  const history = await db.select().from(buyerHistory)
    .where(eq(buyerHistory.buyerId, params.id))
    .orderBy(desc(buyerHistory.changedAt))
    .limit(5);

  // Editable form (client component)
  return <BuyerEditForm buyer={buyer} history={history} />;
}

// (imports already present at top of file)

// All form logic moved to BuyerEditForm.tsx
