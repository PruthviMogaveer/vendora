
import { Badge } from '@/components/ui/badge';

interface OrdersTableProps {
  orders: any[];
  isLoading: boolean;
}

export const OrdersTable = ({ orders, isLoading }: OrdersTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No orders yet for your products.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left">Order ID</th>
            <th className="px-4 py-2 text-left">Product</th>
            <th className="px-4 py-2 text-left">Quantity</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Total</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Sale</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const isDiscounted = order.old_price && order.price < order.old_price;
            const discountPercent = isDiscounted 
              ? Math.round(((order.old_price - order.price) / order.old_price) * 100) 
              : 0;
            
            return (
              <tr key={`${order.id}-${order.product_name}`} className="border-b">
                <td className="px-4 py-2 text-left">{order.id.slice(0, 8)}...</td>
                <td className="px-4 py-2 text-left">{order.product_name}</td>
                <td className="px-4 py-2 text-left">{order.quantity}</td>
                <td className="px-4 py-2 text-left">${order.price.toFixed(2)}</td>
                <td className="px-4 py-2 text-left">${order.total.toFixed(2)}</td>
                <td className="px-4 py-2 text-left capitalize">{order.status}</td>
                <td className="px-4 py-2 text-left">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-left">
                  {isDiscounted && (
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                      {discountPercent}% Off
                    </Badge>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
