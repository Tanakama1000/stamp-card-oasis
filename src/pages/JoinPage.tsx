import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ErrorState from "@/components/join/ErrorState";
import LoadingState from "@/components/join/LoadingState";
import LoginForm from "@/components/join/LoginForm";
import JoinForm from "@/components/join/JoinForm";

const JoinPage = () => {
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const [businessData, setBusinessData] = useState<any>(null);
  const [loyaltyCardConfig, setLoyaltyCardConfig] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string>("");
  const [isAuthMode, setIsAuthMode] = useState<boolean>(false);
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [businessActive, setBusinessActive] = useState<boolean>(true);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*, loyalty_card_configs(*)')
          .eq('slug', businessSlug)
          .single();

        if (error) {
          setError("Business not found");
          return;
        }

        if (!data.is_active) {
          setBusinessActive(false);
          return;
        }

        setBusinessData(data);
        setLoyaltyCardConfig(data.loyalty_card_configs?.config || {});
      } catch (error) {
        console.error('Error fetching business:', error);
        setError("Failed to load business data");
      } finally {
        setLoading(false);
      }
    };

    if (businessSlug) {
      fetchBusiness();
    }
  }, [businessSlug]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      if (isSignup) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              full_name: customerName,
            },
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        // Optionally, update business_members table upon signup
        if (businessData) {
          const { error: memberError } = await supabase
            .from('business_members')
            .insert({
              business_id: businessData.id,
              user_id: signUpData.user?.id,
              customer_name: customerName,
              joined_at: new Date().toISOString(),
            });

          if (memberError) {
            console.error("Error adding member:", memberError);
            setAuthError("Account created, but failed to join the loyalty program.");
          }
        }

        setAuthError(null);
      } else {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (signInError) {
          throw signInError;
        }
        setAuthError(null);
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      setAuthError(error.message || "Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !businessActive) {
    return <ErrorState errorMessage={error} businessActive={businessActive} />;
  }

  if (isAuthMode) {
    return (
      <LoginForm
        isSignup={isSignup}
        setIsSignup={setIsSignup}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        customerName={customerName}
        setCustomerName={setCustomerName}
        onSubmit={handleJoin}
        authLoading={authLoading}
        authError={authError}
      />
    );
  }

  return (
    <JoinForm
      businessName={businessData?.name}
      loyaltyCardConfig={loyaltyCardConfig}
      customerName={customerName}
      setCustomerName={setCustomerName}
      onJoin={handleJoin}
      setIsAuthMode={setIsAuthMode}
      setIsSignup={setIsSignup}
    />
  );
};

export default JoinPage;
