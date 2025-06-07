import { NextResponse } from 'next/server';
import { tables } from '@/app/api/tables/route';

export async function GET(
  req: Request,
  { params }: { params: { businessId: string } }
) {
  try {
    const { businessId } = params;
    console.log(`Fetching tables for business: ${businessId}`);
    
    // Certifique-se de que temos algumas mesas para retornar
    if (tables.length === 0) {
      console.log('No tables found, generating mock data');
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
    
    console.log(`Returning ${tables.length} tables`);
    return NextResponse.json(tables);
  } catch (error) {
    console.error('[BUSINESS_TABLES_GET]', error);
    return new NextResponse("Erro interno", { status: 500 });
  }
} 