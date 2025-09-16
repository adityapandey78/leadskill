import { z } from 'zod';

export const cityEnum = [
  'Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other',
] as const;
export const propertyTypeEnum = [
  'Apartment', 'Villa', 'Plot', 'Office', 'Retail',
] as const;
export const bhkEnum = [
  '1', '2', '3', '4', 'Studio',
] as const;
export const purposeEnum = [
  'Buy', 'Rent',
] as const;
export const timelineEnum = [
  '0-3m', '3-6m', '>6m', 'Exploring',
] as const;
export const sourceEnum = [
  'Website', 'Referral', 'Walk-in', 'Call', 'Other',
] as const;
export const statusEnum = [
  'New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped',
] as const;

export const buyerSchema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().regex(/^\d{10,15}$/),
  city: z.enum(cityEnum),
  propertyType: z.enum(propertyTypeEnum),
  bhk: z.string().optional(),
  purpose: z.enum(purposeEnum),
  budgetMin: z.string().optional(),
  budgetMax: z.string().optional(),
  timeline: z.enum(timelineEnum),
  source: z.enum(sourceEnum),
  notes: z.string().max(1000).optional(),
  tags: z.string().max(500).optional(),
  status: z.enum(statusEnum).optional(),
}).superRefine((data, ctx) => {
  if ((data.propertyType === 'Apartment' || data.propertyType === 'Villa') && !data.bhk) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['bhk'],
      message: 'BHK required for Apartment/Villa',
    });
  }
  if (data.budgetMax && data.budgetMin && Number(data.budgetMax) < Number(data.budgetMin)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['budgetMax'],
      message: 'budgetMax must be ≥ budgetMin',
    });
  }
});

export const csvBuyerSchema = buyerSchema.transform((data) => ({
  ...data,
  budgetMin: data.budgetMin ? parseInt(String(data.budgetMin)) : undefined,
  budgetMax: data.budgetMax ? parseInt(String(data.budgetMax)) : undefined,
}));
