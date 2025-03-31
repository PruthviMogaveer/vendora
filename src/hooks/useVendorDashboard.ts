
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { useAuth } from '@/hooks/useAuth';

export const useVendorDashboard = () => {
  const { user } = useAuth();
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

  return {
    products,
    orders,
    stats,
    isLoading
  };
};
