
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ErrorState from "@/components/join/ErrorState";
import LoadingState from "@/components/join/LoadingState";
import LoginForm from "@/components/join/LoginForm";
import JoinForm from "@/components/join/JoinForm";
import { useToast } from "@/hooks/use-toast";

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
  const navigate = useNavigate();
  const { toast } = useToast();

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
              user_type: "customer"
            },
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        // Optionally, update business_members table upon signup
        if (businessData && signUpData.user) {
          const { error: memberError } = await supabase
            .from('business_members')
            .insert({
              business_id: businessData.id,
              user_id: signUpData.user.id,
              customer_name: customerName,
              joined_at: new Date().toISOString(),
              stamps: 0,
              redeemed_rewards: 0
            });

          if (memberError) {
            console.error("Error adding member:", memberError);
            setAuthError("Account created, but failed to join the loyalty program.");
          } else {
            toast({
              title: "Account Created",
              description: "Your account has been created and you've joined the loyalty program!"
            });
            navigate("/");
          }
        }
      } else {
        // Login
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (signInError) {
          throw signInError;
        }

        // Check if user is already a member of this business
        if (signInData.user && businessData) {
          const { data: memberData, error: memberCheckError } = await supabase
            .from('business_members')
            .select('id')
            .eq('business_id', businessData.id)
            .eq('user_id', signInData.user.id)
            .single();

          // If not a member yet, add them
          if (memberCheckError && memberCheckError.code === 'PGRST116') {
            // User is not a member yet, add them
            const { error: memberAddError } = await supabase
              .from('business_members')
              .insert({
                business_id: businessData.id,
                user_id: signInData.user.id,
                customer_name: signInData.user.user_metadata.full_name || email.split('@')[0],
                joined_at: new Date().toISOString(),
                stamps: 0,
                redeemed_rewards: 0
              });

            if (memberAddError) {
              console.error("Error adding member during login:", memberAddError);
            } else {
              toast({
                title: "Login Successful",
                description: "You've joined this business's loyalty program!"
              });
            }
          } else {
            toast({
              title: "Login Successful",
              description: "You've logged into your account"
            });
          }
          navigate("/");
        }
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
