import { NextResponse } from 'next/server';
import { initDb, clearAllData } from '@/lib/db';

initDb();

export async function POST() {
  clearAllData();
  return NextResponse.json({ success: true });
}
