import { NextResponse } from 'next/server';
import { Category } from '@/types';

let categories: Category[] = [];
let nextId = 1;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("Dados inválidos", { status: 400 });
    }

    const category: Category = {
      id: nextId++,
      name,
      order: 0,
      menu_id: 1,
    };

    categories.push(category);
    return NextResponse.json(category);
  } catch (error) {
    console.error('[CATEGORIES_POST]', error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(categories);
} 