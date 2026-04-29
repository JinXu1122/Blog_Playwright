import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';
import { getAllCategories } from '@/lib/posts';

initDb();

export async function GET() {
  const categories = getAllCategories();
  return NextResponse.json(categories);
}
