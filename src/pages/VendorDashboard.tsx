
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import { VendorStats } from '@/components/vendor/VendorStats';
import { ProductsTable } from '@/components/vendor/ProductsTable';
import { OrdersTable } from '@/components/vendor/OrdersTable';
import { useVendorDashboard } from '@/hooks/useVendorDashboard';

const VendorDashboard = () => {
  const { user, loading } = useAuth();
  const { products, orders, stats, isLoading } = useVendorDashboard();

  // If still loading, show a loading indicator
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  // If not authenticated or not a vendor, redirect to login
  if (!loading && (!user || !user.is_vendor)) {
    return <Navigate to="/vendor/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto py-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
            <Button asChild>
              <Link to="/vendor/product/new" className="flex items-center gap-2">
                <PlusCircle size={18} />
                Add New Product
              </Link>
            </Button>
          </div>

          {/* Stats Overview */}
          <VendorStats 
            productCount={stats.productCount} 
            orderCount={stats.orderCount} 
            totalRevenue={stats.totalRevenue} 
          />

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="products" className="flex-1">Products</TabsTrigger>
              <TabsTrigger value="orders" className="flex-1">Orders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Your Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProductsTable products={products} isLoading={isLoading} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <OrdersTable orders={orders} isLoading={isLoading} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VendorDashboard;
