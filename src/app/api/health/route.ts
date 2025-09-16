import { NextResponse } from 'next/server';
import { db } from '@/drizzle/db';

export async function GET() {
  try {
    // Test environment variables
    const hasDbUrl = !!process.env.DATABASE_URL;
    const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET;
    const hasNextAuthUrl = !!process.env.NEXTAUTH_URL;
    
    // Test database connection with a simple query
    let dbConnected = false;
    try {
      const result = await db.execute('SELECT 1 as test');
      dbConnected = !!result;
    } catch (dbError) {
      console.error('Database connection error:', dbError);
    }

    return NextResponse.json({
      status: 'ok',
      environment: process.env.NODE_ENV,
      envVars: {
        DATABASE_URL: hasDbUrl,
        NEXTAUTH_SECRET: hasNextAuthSecret,
        NEXTAUTH_URL: hasNextAuthUrl,
      },
      database: {
        connected: dbConnected,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}