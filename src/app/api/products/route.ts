import { NextResponse } from 'next/server';
import { Product } from '@/types';

let products: Product[] = [];
let nextId = 1;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, categoryId, ingredientIds } = body;

    if (!name || !categoryId || !Array.isArray(ingredientIds)) {
      return new NextResponse("Dados inválidos", { status: 400 });
    }

    const product: Product = {
      id: nextId++,
      name,
      description,
      photo: '',
      default_price: 0,
      business_id: 1,
    };

    products.push(product);
    return NextResponse.json(product);
  } catch (error) {
    console.error('[PRODUCTS_POST]', error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(products);
} 