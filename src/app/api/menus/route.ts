import { Menu } from '@/types';
import { NextResponse } from 'next/server';

let menus: Menu[] = [];
let nextId = 1;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return new NextResponse("Dados inválidos", { status: 400 });
    }

    const menu: Menu = {
      id: nextId++,
      name,
      description,
      active: true,
      photo: '',
      business_id: 1,
    };

    menus.push(menu);
    return NextResponse.json(menu);
  } catch (error) {
    console.error('[MENUS_POST]', error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(menus);
} 