
import { Card, CardContent } from '@/components/ui/card';
import { Package, ShoppingCart, BarChart3 } from 'lucide-react';

interface StatsProps {
  productCount: number;
  orderCount: number;
  totalRevenue: number;
}

export const VendorStats = ({ productCount, orderCount, totalRevenue }: StatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <Package className="h-12 w-12 text-primary mb-2" />
          <p className="text-2xl font-bold">{productCount}</p>
          <p className="text-muted-foreground">Products</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <ShoppingCart className="h-12 w-12 text-primary mb-2" />
          <p className="text-2xl font-bold">{orderCount}</p>
          <p className="text-muted-foreground">Orders</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <BarChart3 className="h-12 w-12 text-primary mb-2" />
          <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
          <p className="text-muted-foreground">Revenue</p>
        </CardContent>
      </Card>
    </div>
  );
};
