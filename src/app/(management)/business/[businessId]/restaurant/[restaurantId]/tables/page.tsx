import { TablesHeader } from '@/components/tables/tables-header';
import { TablesGrid } from '@/components/tables/tables-grid';
import { AddTableDialog } from '@/components/tables/add-table-dialog';

const RESTAURANT_NAME = 'Seu Restaurante';
const BUSINESS_ID = '1';

export default function TablesPage() {
  return (
    <div className="p-6">
      <TablesHeader businessId={BUSINESS_ID} />
      
      <div className="flex justify-end my-4">
        <AddTableDialog />
      </div>
      
      <div className="mt-4">
        <TablesGrid businessId={BUSINESS_ID} restaurantName={RESTAURANT_NAME} />
      </div>
    </div>
  );
} 