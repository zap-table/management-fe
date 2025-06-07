'use client';

import { Table } from '@/types';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, Printer, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface TablesGridProps {
  businessId: string;
  restaurantName: string;
}

export const TablesGrid: React.FC<TablesGridProps> = ({ businessId, restaurantName }) => {
  const { data: tables, isLoading, error } = useQuery<Table[]>({
    queryKey: ['tables', businessId],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/business/${businessId}/tables`);
        
        if (!response.ok) {
          const fallbackResponse = await fetch('/api/tables');
          if (!fallbackResponse.ok) {
            throw new Error('Falha ao carregar mesas');
          }
          return fallbackResponse.json();
        }
        
        return response.json();
      } catch (error) {
        console.error('Erro ao buscar mesas:', error);
        throw error;
      }
    },
  });

  // Function to generate QR code via external API
  const downloadQRCode = (table: Table) => {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(table.qr_code)}&format=png&download=1`;
    window.open(qrCodeUrl, '_blank');
  };

  // Function to print QR code via external API
  const printQRCode = (table: Table) => {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(table.qr_code)}`;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code Table ${table.table_number}</title>
          <style>
            body { margin: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif; }
            .container { text-align: center; }
            h1 { font-size: 24px; margin-bottom: 8px; }
            h2 { font-size: 20px; margin-bottom: 16px; }
            img { max-width: 300px; margin-bottom: 16px; }
            p { font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${restaurantName}</h1>
            <h2>Table ${table.table_number}</h2>
            <img src="${qrCodeUrl}" alt="QR Code" />
            <p>Scan to place your order</p>
          </div>
          <script>
            setTimeout(() => { window.print(); window.close(); }, 500);
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  // Função auxiliar para determinar o título do botão
  const getTableStatusButtonTitle = (table: Table) => {
    return table.active ? "Lock Table" : "Unlock Table";
  };

  // Função auxiliar para determinar a variante do badge
  const getBadgeVariant = (status: string) => {
    return status === 'open' ? 'secondary' : 'destructive';
  };

  // Função auxiliar para determinar o texto do badge
  const getBadgeText = (status: string) => {
    return status === 'open' ? 'Available' : 'Occupied';
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading tables: {(error as Error).message}</div>;
  }

  if (!tables || tables.length === 0) {
    return <div>No tables found. Please add some tables.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tables.map((table) => (
        <Card key={table.id} className="relative">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Table {table.table_number}
              <Badge variant={getBadgeVariant(table.status)}>
                {getBadgeText(table.status)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-4">
              <QRCodeSVG value={table.qr_code} size={120} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadQRCode(table)}
              title="Download QR Code"
            >
              <Download size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => printQRCode(table)}
              title="Print QR Code"
            >
              <Printer size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Implement table status toggle
              }}
              title={getTableStatusButtonTitle(table)}
            >
              {table.active ? <Lock size={16} /> : <Unlock size={16} />}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 