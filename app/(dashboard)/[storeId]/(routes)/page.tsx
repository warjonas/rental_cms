import { getGraphRevenue } from '@/actions/getGraphRevenue';
import { getSalesCount } from '@/actions/getSalesCount';
import { getStockCount } from '@/actions/getStockCount';
import { getTotalRevenue } from '@/actions/getTotalRevenue';
import { Overview } from '@/components/overview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import prismadb from '@/lib/prismadb';
import { formatter } from '@/lib/utils';
import { CreditCard, DollarSign, Package } from 'lucide-react';
import React from 'react';

type Props = {
  params: { storeId: string };
};

const DashboardPage: React.FC<Props> = async ({ params }) => {
  const parameters = await params;
  const totalRevenue = await getTotalRevenue(parameters.storeId);
  const salesCount = await getSalesCount(parameters.storeId);
  const stockCount = await getStockCount(parameters.storeId);

  const graphRevenue = await getGraphRevenue(parameters.storeId);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          title="Dashboard"
          description="Overview of your stores performance"
        />
        <Separator className="my-10" />
        <div className="grid gap-4 grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm lg:text-lg font-medium">
                Total Revenue
              </CardTitle>{' '}
              <DollarSign className="lg:h-6 h-4 lg:w-6 w-4 text-muted-foreground" />{' '}
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {formatter.format(totalRevenue)}{' '}
                <span className="text-muted-foreground text-sm">YTD</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm lg:text-lg font-medium">
                Total Sales
              </CardTitle>{' '}
              <CreditCard className="lg:h-6 h-4 lg:w-6 w-4 text-muted-foreground" />{' '}
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">{salesCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm lg:text-lg font-medium">
                Products In Stock
              </CardTitle>{' '}
              <Package className="lg:h-6 h-4 lg:w-6 w-4 text-muted-foreground" />{' '}
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">{stockCount}</div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span--4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphRevenue} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
