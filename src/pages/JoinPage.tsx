
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import QRScannerDialog from "@/components/QRScannerDialog";

// Import refactored components
import LoadingState from "@/components/join/LoadingState";
import ErrorState from "@/components/join/ErrorState";
import JoinForm from "@/components/join/JoinForm";
import MemberCard from "@/components/join/MemberCard";

// Import hooks
import { useBusinessData } from "@/hooks/useBusinessData";
import { useLoyaltyActions } from "@/hooks/useLoyaltyActions";
import { Button } from "@/components/ui/button";

const JoinPage = () => {
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const [customerName, setCustomerName] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  // Get Supabase user session
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUserId(data.session.user.id);
        setIsAuthenticated(true);
      } else {
        // Set a temporary anonymous user ID if not logged in
        const tempId = localStorage.getItem('tempUserId') || `anon_${Date.now()}`;
        localStorage.setItem('tempUserId', tempId);
        setUserId(tempId);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
    
    // Listen for authentication changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const authenticated = !!session;
      setIsAuthenticated(authenticated);
      if (authenticated) {
        setUserId(session.user.id);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Use custom hook for business data
  const {
    businessName,
    businessData,
    loyaltyCardConfig,
    loading,
    error,
    joined,
    customer,
    stamps,
    setCustomer,
    setJoined,
    setStamps
  } = useBusinessData(businessSlug, userId);

  // Use custom hook for loyalty program actions
  const {
    scannerOpen,
    setScannerOpen,
    handleJoin,
    handleCollectStamp,
    handleSuccessfulScan
  } = useLoyaltyActions({
    businessData,
    userId,
    customerName,
    setJoined,
    setCustomer,
    setStamps
  });

  const handleSignInClick = () => {
    navigate('/auth');
  };

  if (loading) {
    return (
      <Layout>
        <LoadingState />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorState 
          title="Business Not Found"
          message="The business you're looking for doesn't exist or the link is invalid."
        />
      </Layout>
    );
  }

  if (joined && customer && businessData) {
    return (
      <Layout>
        <MemberCard
          businessName={businessName}
          customerName={customer.name}
          stamps={stamps}
          loyaltyCardConfig={loyaltyCardConfig}
          handleCollectStamp={handleCollectStamp}
        />
        <QRScannerDialog 
          isOpen={scannerOpen} 
          onClose={() => setScannerOpen(false)}
          onSuccessfulScan={handleSuccessfulScan}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <JoinForm
        businessName={businessName}
        customerName={customerName}
        setCustomerName={setCustomerName}
        handleJoin={handleJoin}
        loyaltyCardConfig={loyaltyCardConfig}
        isAuthenticated={isAuthenticated}
        onSignInClick={handleSignInClick}
      />
    </Layout>
  );
};

export default JoinPage;
