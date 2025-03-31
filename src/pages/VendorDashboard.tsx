
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Package, ShoppingCart, BarChart3 } from 'lucide-react';

const VendorDashboard = () => {
  const { user, loading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    productCount: 0,
    orderCount: 0,
    totalRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id && user.is_vendor) {
      fetchVendorProducts();
      fetchVendorOrders();
    }
  }, [user]);

  useEffect(() => {
    if (products.length > 0 || orders.length > 0) {
      // Calculate stats based on products and orders
      const productCount = products.length;
      const orderCount = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      
      setStats({
        productCount,
        orderCount,
        totalRevenue
      });
    }
  }, [products, orders]);

  const fetchVendorProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('vendor_id', user?.id);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching vendor products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVendorOrders = async () => {
    try {
      // This is a simplified query - in a real application, you would
      // need to join order_items with products to get orders for products by this vendor
      const { data: orderItems, error } = await supabase
        .from('order_items')
        .select(`
          id,
          quantity,
          price,
          variant,
          products!inner(id, name, vendor_id),
          orders!inner(id, status, created_at, user_id)
        `)
        .eq('products.vendor_id', user?.id);

      if (error) throw error;
      
      const ordersData = orderItems?.map(item => ({
        id: item.orders.id,
        status: item.orders.status,
        created_at: item.orders.created_at,
        user_id: item.orders.user_id,
        product_name: item.products.name,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
        variant: item.variant
      })) || [];
      
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching vendor orders:', error);
    }
  };

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-6">
                <Package className="h-12 w-12 text-primary mb-2" />
                <p className="text-2xl font-bold">{stats.productCount}</p>
                <p className="text-muted-foreground">Products</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-6">
                <ShoppingCart className="h-12 w-12 text-primary mb-2" />
                <p className="text-2xl font-bold">{stats.orderCount}</p>
                <p className="text-muted-foreground">Orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-6">
                <BarChart3 className="h-12 w-12 text-primary mb-2" />
                <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
                <p className="text-muted-foreground">Revenue</p>
              </CardContent>
            </Card>
          </div>

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
                  {isLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : products.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Price</th>
                            <th className="px-4 py-2 text-left">Category</th>
                            <th className="px-4 py-2 text-left">In Stock</th>
                            <th className="px-4 py-2 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product) => (
                            <tr key={product.id} className="border-b">
                              <td className="px-4 py-2 text-left">{product.name}</td>
                              <td className="px-4 py-2 text-left">${product.price.toFixed(2)}</td>
                              <td className="px-4 py-2 text-left capitalize">{product.category}</td>
                              <td className="px-4 py-2 text-left">
                                {product.in_stock ? 
                                  <span className="text-green-600">In Stock</span> : 
                                  <span className="text-red-600">Out of Stock</span>
                                }
                              </td>
                              <td className="px-4 py-2 text-right space-x-2">
                                <Button variant="outline" size="sm" asChild>
                                  <Link to={`/vendor/product/edit/${product.id}`}>Edit</Link>
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                  <Link to={`/products/${product.id}`}>View</Link>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground mb-4">You don't have any products yet.</p>
                      <Button asChild>
                        <Link to="/vendor/product/new">Add Your First Product</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : orders.length > 0 ? (
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
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
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
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No orders yet for your products.</p>
                    </div>
                  )}
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
