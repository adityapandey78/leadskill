import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store (for demo/dev only)
const ipHits: Record<string, { count: number; last: number }> = {};
const WINDOW = 60 * 1000; // 1 minute
const LIMIT = 30; // 30 requests per minute per IP

export function rateLimit(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  if (!ipHits[ip] || now - ipHits[ip].last > WINDOW) {
    ipHits[ip] = { count: 1, last: now };
  } else {
    ipHits[ip].count++;
    ipHits[ip].last = now;
  }
  if (ipHits[ip].count > LIMIT) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }
  return null;
}