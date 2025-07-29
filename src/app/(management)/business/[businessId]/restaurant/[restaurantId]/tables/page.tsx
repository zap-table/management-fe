import TablesPage from "@/components/tables/tables-page";

interface TablePageProps {
  params: Promise<{
    restaurantId: string;
    businessId: string;
  }>;
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
}

export default async function Tables({ params, searchParams }: TablePageProps) {
  const { businessId, restaurantId } = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <TablesPage
      restaurantId={restaurantId}
      businessId={businessId}
      searchParams={resolvedSearchParams}
    />
  );
}
