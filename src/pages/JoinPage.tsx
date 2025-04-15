
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

const JoinPage = () => {
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const [customerName, setCustomerName] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);

  // Get Supabase user session
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUserId(data.session.user.id);
      }
    };
    
    checkAuth();
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
        <ErrorState />
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
      />
    </Layout>
  );
};

export default JoinPage;
