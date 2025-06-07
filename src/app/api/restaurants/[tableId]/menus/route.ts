import { NextResponse } from 'next/server';

// Dados mockados para menus
const mockMenus = [
  {
    id: '1',
    name: 'Menu Principal',
    description: 'Nossa seleção completa de pratos principais, entradas e sobremesas.',
    active: true,
    image_url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1000',
  },
  {
    id: '2',
    name: 'Menu de Bebidas',
    description: 'Bebidas alcoólicas e não alcoólicas, coquetéis especiais e vinhos selecionados.',
    active: true,
    image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1000',
  },
  {
    id: '3',
    name: 'Menu de Sobremesas',
    description: 'Deliciosas sobremesas para adoçar seu dia.',
    active: true,
    image_url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1000',
  },
  {
    id: '4',
    name: 'Menu Infantil',
    description: 'Opções especiais para os pequenos clientes.',
    active: false,
    image_url: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=1000',
  },
];

export async function GET(
  req: Request,
  { params }: { params: { tableId: string } }
) {
  try {
    // Aqui você poderia usar o tableId para filtrar menus específicos
    // para uma determinada mesa ou restaurante
    const { tableId } = params;
    console.log(`Fetching menus for table: ${tableId}`);
    
    // Simulando um pequeno atraso para mostrar o estado de carregamento
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return NextResponse.json(mockMenus);
  } catch (error) {
    console.error('[RESTAURANT_MENUS_GET]', error);
    return new NextResponse("Erro interno", { status: 500 });
  }
} 