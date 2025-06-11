
import { Link } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense } from "react";
import ProfileDropdown from "@/components/ProfileDropdown";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

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
  
  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUserId(session?.user?.id || null);
        
        if (session?.user?.id) {
          // If user is logged in, check if they have a name stored
          const { data: membershipData } = await supabase
            .from('business_members')
            .select('customer_name')
            .eq('user_id', session.user.id)
            .maybeSingle();
            
          if (membershipData && membershipData.customer_name) {
            setCustomerName(membershipData.customer_name);
          }
        } else {
          // Check for anonymous user data
          const businessId = localStorage.getItem('businessId') || 
            JSON.parse(localStorage.getItem('loyaltyCardConfig') || '{}')?.businessId;
            
          if (businessId) {
            const { data: anonMember } = await supabase
              .from('business_members')
              .select('customer_name')
              .eq('business_id', businessId)
              .eq('is_anonymous', true)
              .maybeSingle();
              
            if (anonMember && anonMember.customer_name) {
              setCustomerName(anonMember.customer_name);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleNameUpdate = async (newName: string) => {
    setCustomerName(newName);
  };
  
  const handleLogout = () => {
    // Logout handled in ProfileDropdown component
    window.location.reload();
  };

  return <div className="min-h-screen bg-white">
      <header className="bg-coffee-dark text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold flex items-center gap-2">
            <img src="/lovable-uploads/04523b06-63b5-485f-ac7d-8624e600ad0d.png" alt="InStamp Logo" className="h-8 w-8" />
            <span>InStamp</span>
          </Link>
          
          {/* Add ProfileDropdown to the right side of the header */}
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
