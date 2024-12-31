'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPurchaseHistory } from '@/lib/purchaseApi';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DatePickerWithRange from '@/components/date-picker-with-range';
import { Purchase, PurchaseItem, Product } from '@prisma/client';

type PurchaseWithItems = Purchase & {
  items: (PurchaseItem & {
    product: Product;
  })[];
};

interface PurchaseHistoryResponse {
  purchases: PurchaseWithItems[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function PurchasesPage() {
  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date; }>({ from: new Date(), to: new Date() });
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useQuery<PurchaseHistoryResponse, Error>({
    queryKey: ['purchases', page, limit, dateRange],
    queryFn: () => getPurchaseHistory({
      startDate: dateRange.from?.toISOString(),
      endDate: dateRange.to?.toISOString(),
      page,
      limit
    }),
  });

  const totalPurchases = data?.purchases.reduce((sum, purchase) => sum + purchase.total, 0) || 0;

  if (isError) {
    return <div className="text-center text-red-500">Error loading purchase data</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Purchases Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-lg font-semibold">Total Purchases: Rwf {totalPurchases.toFixed(2)}</p>
          </div>
          <div>
            <DatePickerWithRange
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <PurchasesSkeleton />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Average Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.purchases.map((purchase) => {
                    const averagePrice = purchase.total / purchase.items.reduce((sum, item) => sum + item.quantity, 0);
                    return (
                      <TableRow key={purchase.id}>
                        <TableCell>{new Date(purchase.date).toLocaleDateString()}</TableCell>
                        <TableCell>Rwf {purchase.total.toFixed(2)}</TableCell>
                        <TableCell>{purchase.items.length}</TableCell>
                        <TableCell>Rwf {averagePrice.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between mt-4">
                <Button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  variant="outline"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <span>Page {page} of {data?.totalPages}</span>
                <Button
                  onClick={() => setPage(page + 1)}
                  disabled={page === data?.totalPages}
                  variant="outline"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PurchasesSkeleton() {
  return (
    <>
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
      <div className="flex items-center justify-between mt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </>
  );
}

