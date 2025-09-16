import { csvBuyerSchema } from './buyer';
import { describe, it, expect } from 'vitest';

describe('csvBuyerSchema', () => {
  it('validates a correct buyer row', () => {
    const row = {
      fullName: 'John Doe',
      phone: '9876543210',
      city: 'Chandigarh',
      propertyType: 'Apartment',
      bhk: '2',
      purpose: 'Buy',
      budgetMin: 5000000,
      budgetMax: 8000000,
      timeline: '0-3m',
      source: 'Website',
      notes: 'Looking for a 2BHK',
      tags: ['NRI'],
      status: 'New',
      email: 'john@example.com',
    };
    const result = csvBuyerSchema.safeParse(row);
    expect(result.success).toBe(true);
  });

  it('fails if budgetMax < budgetMin', () => {
    const row = {
      ...validRow(),
      budgetMin: 9000000,
      budgetMax: 8000000,
    };
    const result = csvBuyerSchema.safeParse(row);
    expect(result.success).toBe(false);
    expect(result.error.issues.some(i => i.path.includes('budgetMax'))).toBe(true);
  });

  it('requires BHK for Apartment/Villa', () => {
    const row = {
      ...validRow(),
      propertyType: 'Apartment',
      bhk: undefined,
    };
    const result = csvBuyerSchema.safeParse(row);
    expect(result.success).toBe(false);
    expect(result.error.issues.some(i => i.path.includes('bhk'))).toBe(true);
  });
});

function validRow() {
  return {
    fullName: 'Jane Doe',
    phone: '9876543210',
    city: 'Chandigarh',
    propertyType: 'Apartment',
    bhk: '2',
    purpose: 'Buy',
    budgetMin: 5000000,
    budgetMax: 8000000,
    timeline: '0-3m',
    source: 'Website',
    notes: '',
    tags: ['NRI'],
    status: 'New',
    email: 'jane@example.com',
  };
}
