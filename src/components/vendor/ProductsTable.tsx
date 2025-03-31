
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
}

export const ProductsTable = ({ products, isLoading }: ProductsTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-4">You don't have any products yet.</p>
        <Button asChild>
          <Link to="/vendor/product/new">Add Your First Product</Link>
        </Button>
      </div>
    );
  }

  return (
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
  );
};
