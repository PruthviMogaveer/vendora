
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export const VendorSection = () => {
  const { user, becomeVendor } = useAuth();

  const handleBecomeVendor = async () => {
    try {
      await becomeVendor();
      toast.success("You are now a vendor! You can access your vendor dashboard.");
    } catch (error) {
      console.error("Error becoming a vendor:", error);
      toast.error("Could not activate vendor account. Please try again.");
    }
  };

  if (!user) return null;

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Vendor Dashboard</h2>
      
      {user.is_vendor ? (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            You are registered as a vendor. Access your vendor dashboard to manage products and orders.
          </p>
          <Button asChild className="w-full">
            <Link to="/vendor/dashboard">Go to Vendor Dashboard</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Become a vendor to start selling products on our platform.
          </p>
          <Button onClick={handleBecomeVendor} className="w-full">
            Become a Vendor
          </Button>
        </div>
      )}
    </div>
  );
};
