
import { Link } from "react-router-dom";
import { Image } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense, useState, useEffect } from "react";
import ProfileDropdown from "@/components/ProfileDropdown";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

// Loading fallback component
const LoadingFallback = () => <div className="flex justify-center items-center py-12">
    <div className="flex items-center space-x-2">
      <div className="w-3 h-3 bg-coffee-medium rounded-full animate-bounce" />
      <div className="w-3 h-3 bg-coffee-medium rounded-full animate-bounce [animation-delay:0.2s]" />
      <div className="w-3 h-3 bg-coffee-medium rounded-full animate-bounce [animation-delay:0.4s]" />
    </div>
  </div>;

const Layout: React.FC<LayoutProps> = ({
  children,
  isLoading = false
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUserId = session?.user?.id || null;
        setUserId(currentUserId);

        // Get business ID from localStorage
        const savedCardStyle = localStorage.getItem('loyaltyCardConfig');
        let businessId = "";
        
        if (savedCardStyle) {
          try {
            const parsedStyle = JSON.parse(savedCardStyle);
            businessId = parsedStyle.businessId || "3967978c-7313-4039-9d80-8b24af9c89fa";
          } catch {
            businessId = "3967978c-7313-4039-9d80-8b24af9c89fa";
          }
        } else {
          businessId = "3967978c-7313-4039-9d80-8b24af9c89fa";
        }

        // Fetch customer name from membership data
        if (businessId) {
          const { data: membershipData } = await supabase
            .from('business_members')
            .select('customer_name')
            .eq('business_id', businessId)
            .eq(currentUserId ? 'user_id' : 'is_anonymous', currentUserId || true)
            .maybeSingle();

          if (membershipData) {
            setCustomerName(membershipData.customer_name || '');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleNameUpdate = async (newName: string) => {
    try {
      const savedCardStyle = localStorage.getItem('loyaltyCardConfig');
      let businessId = "";
      
      if (savedCardStyle) {
        try {
          const parsedStyle = JSON.parse(savedCardStyle);
          businessId = parsedStyle.businessId || "3967978c-7313-4039-9d80-8b24af9c89fa";
        } catch {
          businessId = "3967978c-7313-4039-9d80-8b24af9c89fa";
        }
      } else {
        businessId = "3967978c-7313-4039-9d80-8b24af9c89fa";
      }

      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id;

      const { error } = await supabase
        .from('business_members')
        .update({ customer_name: newName })
        .eq('business_id', businessId)
        .eq(currentUserId ? 'user_id' : 'is_anonymous', currentUserId || true);

      if (error) throw error;
      
      setCustomerName(newName);
    } catch (error) {
      console.error('Error updating name:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    setUserId(null);
    setCustomerName('');
    localStorage.removeItem('anonymousUserId');
    window.location.reload();
  };

  return <div className="min-h-screen bg-white">
      <header className="bg-coffee-dark text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold flex items-center gap-2">
            <img src="/lovable-uploads/04523b06-63b5-485f-ac7d-8624e600ad0d.png" alt="InStamp Logo" className="h-8 w-8" />
            <span>InStamp</span>
          </Link>
          <ProfileDropdown
            userId={userId}
            customerName={customerName}
            onNameUpdate={handleNameUpdate}
            onLogout={handleLogout}
          />
        </div>
      </header>
      <main className="container mx-auto py-8 px-4 bg-white">
        <TooltipProvider>
          <Suspense fallback={<LoadingFallback />}>
            {isLoading ? <LoadingFallback /> : children}
          </Suspense>
        </TooltipProvider>
      </main>
      <footer className="bg-coffee-dark text-white p-4 mt-auto">
        <div className="container mx-auto text-center text-sm">
          &copy; {new Date().getFullYear()} InStamp. All rights reserved.
        </div>
      </footer>
    </div>;
};

export default Layout;
