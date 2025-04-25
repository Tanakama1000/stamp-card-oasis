import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingState from "@/components/join/LoadingState";
import ErrorState from "@/components/join/ErrorState";
import JoinForm from "@/components/join/JoinForm";
import ProgramNotAvailable from "@/components/join/ProgramNotAvailable";
import AuthForm from "@/components/AuthForm";

const JoinPage = () => {
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessData, setBusinessData] = useState<any>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [loyaltyCardConfig, setLoyaltyCardConfig] = useState<any>(null);
  const [isAuthMode, setIsAuthMode] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [isBusinessActive, setIsBusinessActive] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: business, error } = await supabase
          .from('businesses')
          .select('*, loyalty_card_configs(*)')
          .eq('slug', businessSlug)
          .single();

        if (error) throw error;

        if (!business) {
          setError("Business not found");
          return;
        }

        setBusinessData(business);
        setBusinessId(business.id);
        setIsBusinessActive(business.is_active);
        if (business.loyalty_card_configs?.[0]?.config) {
          setLoyaltyCardConfig(business.loyalty_card_configs[0].config);
        }
      } catch (error) {
        console.error("Error fetching business:", error);
        setError("Could not load business details");
      } finally {
        setLoading(false);
      }
    };

    if (businessSlug) {
      fetchBusinessDetails();
    }
  }, [businessSlug]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!businessId) {
      setError("Business ID is missing.");
      return;
    }

    if (!customerName.trim()) {
      setError("Please enter your name.");
      return;
    }

    try {
      const { data: existingMember, error: existingMemberError } = await supabase
        .from('business_members')
        .select('*')
        .eq('business_id', businessId)
        .eq('customer_name', customerName)
        .single();

      if (existingMemberError && existingMemberError.code !== 'PGRST116') {
        throw existingMemberError;
      }

      if (existingMember) {
        setError("You are already a member of this program.");
        return;
      }

      const { data, error } = await supabase
        .from('business_members')
        .insert([{ business_id: businessId, customer_name: customerName }])
        .select()
        .single();

      if (error) throw error;

      navigate(`/scan`);
    } catch (error) {
      console.error("Error joining business:", error);
      setError("Could not join the loyalty program. Please try again.");
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !businessData) {
    return <ErrorState errorMessage={error || "Business not found"} />;
  }

  if (!isBusinessActive) {
    return <ProgramNotAvailable businessName={businessData.name} />;
  }

  return (
    <>
      {isAuthMode ? (
        <AuthForm 
          businessId={businessId}
          businessName={businessData.name}
          isSignup={isSignup}
          setIsAuthMode={setIsAuthMode}
        />
      ) : (
        <JoinForm
          businessName={businessData.name}
          loyaltyCardConfig={loyaltyCardConfig}
          customerName={customerName}
          setCustomerName={setCustomerName}
          onJoin={handleJoin}
          setIsAuthMode={setIsAuthMode}
          setIsSignup={setIsSignup}
        />
      )}
    </>
  );
};

export default JoinPage;
