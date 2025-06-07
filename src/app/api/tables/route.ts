import { NextResponse } from 'next/server';
import { generateQRCode } from '@/lib/utils';

// Simulação de banco de dados
export interface Table {
  id: number;
  table_number: number;
  restaurant_id: string | number;
  qr_code: string;
  active: boolean;
  status: 'open' | 'closed';
}

export const tables: Table[] = [];
let nextId = 1;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { table_number, restaurant_id } = body;

    if (!table_number || !restaurant_id) {
      return new NextResponse("Dados inválidos", { status: 400 });
    }

    // Gerar URL para o QR code
    const tableUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/table/${nextId}?table=${table_number}`;
    const qrCode = await generateQRCode(tableUrl);

    // Criar nova mesa
    const table: Table = {
      id: nextId++,
      table_number,
      restaurant_id,
      qr_code: qrCode,
      active: true,
      status: 'open' as const,
    };

    tables.push(table);

    return NextResponse.json(table);
  } catch (error) {
    console.error('[TABLES_POST]', error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

// GET para listar todas as mesas
export async function GET() {
  console.log('GET /api/tables - Current tables:', tables.length);
  
  // Gerar algumas mesas de exemplo se não houver nenhuma
  if (tables.length === 0) {
    console.log('Generating mock tables');
    for (let i = 1; i <= 5; i++) {
      tables.push({
        id: i,
        table_number: i,
        restaurant_id: 1,
        qr_code: `http://localhost:3000/table/${i}?table=${i}`,
        active: true,
        status: i % 2 === 0 ? 'closed' : 'open' as 'open' | 'closed',
      });
    }
  }
  
  console.log('Returning tables:', tables.length);
  return NextResponse.json(tables);
}