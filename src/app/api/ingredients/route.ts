import { NextResponse } from 'next/server';
import { Ingredient } from '@/types';

const ingredients: Ingredient[] = [];
let nextId = 1;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return new NextResponse("Dados inválidos", { status: 400 });
    }

    const ingredient: Ingredient = {
      id: nextId++,
      name,
      description,
      photo: '',
      business_id: 1,
    };

    ingredients.push(ingredient);
    return NextResponse.json(ingredient);
  } catch (error) {
    console.error('[INGREDIENTS_POST]', error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(ingredients);
} 