import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Coffee, QrCode, UserPlus, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LoyaltyCard from "@/components/LoyaltyCard";
import QRScannerDialog from "@/components/QRScannerDialog";
import RewardsCard from "@/components/loyalty/RewardsCard";
import JoinForm from "@/components/join/JoinForm";
import MemberCard from "@/components/join/MemberCard";
import LoginForm from "@/components/join/LoginForm";
import LoadingState from "@/components/join/LoadingState";
import ErrorState from "@/components/join/ErrorState";

const JoinPage = () => {
  const { businessSlug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [businessName, setBusinessName] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [businessInactive, setBusinessInactive] = useState<boolean>(false);
  const [joined, setJoined] = useState<boolean>(false);
  const [businessData, setBusinessData] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [scannerOpen, setScannerOpen] = useState<boolean>(false);
  const [stamps, setStamps] = useState<number>(0);
  const [totalStampsCollected, setTotalStampsCollected] = useState<number>(0);
  const [totalRewardsEarned, setTotalRewardsEarned] = useState<number>(0);
  const [loyaltyCardConfig, setLoyaltyCardConfig] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);
  
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSignup, setIsSignup] = useState<boolean>(true);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUserId(data.session.user.id);
      }
    };
    
    checkAuth();
    
    const fetchBusinessData = async () => {
      try {
        const { data: businesses, error } = await supabase
          .from("businesses")
          .select("*")
          .ilike("slug", businessSlug || '')
          .single();
        
        if (error) {
          console.error("Error fetching business:", error);
          const savedBusinesses = localStorage.getItem('businesses');
          let foundBusiness = null;
          
          if (savedBusinesses) {
            try {
              const businesses = JSON.parse(savedBusinesses);
              foundBusiness = businesses.find((b: any) => 
                b.slug.toLowerCase() === (businessSlug || '').toLowerCase()
              );
            } catch (e) {
              console.error("Error parsing businesses:", e);
            }
          }
          
          if (foundBusiness) {
            if (!foundBusiness.is_active) {
              setBusinessInactive(true);
              setError("This loyalty program is currently not available.");
              setLoading(false);
              return;
            }
            setBusinessName(foundBusiness.name);
            setBusinessData(foundBusiness);
            await fetchLoyaltyCardConfig(foundBusiness.id);
          } else if (businessSlug === "coffee-oasis") {
            setBusinessName("Coffee Oasis");
            const defaultBusinessData = {
              name: "Coffee Oasis",
              slug: "coffee-oasis",
              id: "coffee-oasis-id",
              is_active: true
            };
            setBusinessData(defaultBusinessData);
            await fetchLoyaltyCardConfig(defaultBusinessData.id);
          } else {
            setError("Business not found");
          }
        } else if (businesses) {
          if (!businesses.is_active) {
            setBusinessInactive(true);
            setError("This loyalty program is currently not available.");
            setLoading(false);
            return;
          }
          setBusinessName(businesses.name);
          setBusinessData(businesses);
          await fetchLoyaltyCardConfig(businesses.id);
          
          if (userId) {
            const { data: membership } = await supabase
              .from("business_members")
              .select("*")
              .eq("business_id", businesses.id)
              .eq("user_id", userId)
              .eq("is_anonymous", false)
              .single();
              
            if (membership) {
              setJoined(true);
              setMemberId(membership.id);
              setCustomer({
                id: userId,
                name: membership.customer_name || "Member",
                stamps: membership.stamps || 0
              });
              setStamps(membership.stamps || 0);
            }
          } else {
            const savedMemberships = localStorage.getItem('memberships');
            if (savedMemberships) {
              try {
                const memberships = JSON.parse(savedMemberships);
                const membership = memberships.find((m: any) => 
                  m.businessId === businesses.id
                );
                
                if (membership) {
                  setJoined(true);
                  setMemberId(membership.id);
                  setCustomer({
                    id: membership.id,
                    name: membership.customerName,
                    stamps: membership.stamps || 0
                  });
                  setCustomerName(membership.customerName || "");
                  setStamps(membership.stamps || 0);
                }
              } catch (e) {
                console.error("Error parsing memberships:", e);
              }
            }
          }
        } else {
          setError("Business not found");
        }
        
        setLoading(false);
      } catch (e) {
        console.error("Error in fetchBusinessData:", e);
        setError("Failed to load business data");
        setLoading(false);
      }
    };
    
    const fetchLoyaltyCardConfig = async (businessId: string) => {
      try {
        const { data: configData, error } = await supabase
          .from("loyalty_card_configs")
          .select("config")
          .eq("business_id", businessId)
          .single();
          
        if (!error && configData) {
          setLoyaltyCardConfig(configData.config);
          return;
        }
        
        const savedCardConfig = localStorage.getItem(`loyaltyCardConfig_${businessId}`);
        if (savedCardConfig) {
          try {
            const parsedConfig = JSON.parse(savedCardConfig);
            setLoyaltyCardConfig(parsedConfig);
          } catch (e) {
            console.error("Error parsing card config:", e);
            
            setLoyaltyCardConfig({
              businessName: businessName || "Business",
              cardTitle: "Loyalty Card",
              maxStamps: 10,
              stampIcon: "Coffee",
              cardBgColor: "#FFFFFF",
              textColor: "#6F4E37",
              businessNameColor: "#2563EB",
              cardTitleColor: "#2563EB",
              rewardTextColor: "#2563EB"
            });
          }
        } else {
          setLoyaltyCardConfig({
            businessName: businessName || "Business",
            cardTitle: "Loyalty Card",
            maxStamps: 10,
            stampIcon: "Coffee",
            cardBgColor: "#FFFFFF",
            textColor: "#6F4E37",
            businessNameColor: "#2563EB",
            cardTitleColor: "#2563EB",
            rewardTextColor: "#2563EB"
          });
        }
      } catch (e) {
        console.error("Error fetching loyalty card config:", e);
      }
    };
    
    fetchBusinessData();
  }, [businessSlug, businessName, userId, customerName]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    
    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              full_name: customerName,
              user_type: 'customer'
            }
          }
        });
        
        if (error) {
          setAuthError(error.message);
          setAuthLoading(false);
          return;
        }
        
        toast({
          title: "Account Created",
          description: "Your account has been created successfully!",
        });
        
        if (data.user) {
          setUserId(data.user.id);
          
          if (businessData && businessData.id) {
            try {
              const memberData = {
                business_id: businessData.id,
                stamps: 0,
                customer_name: customerName || data.user.email?.split('@')[0] || "Member",
                user_id: data.user.id,
                is_anonymous: false,
                total_stamps_collected: 0,
                total_rewards_earned: 0
              };
              
              const { data: membership, error: membershipError } = await supabase
                .from('business_members')
                .insert(memberData)
                .select('id')
                .single();
                
              if (membershipError) {
                console.error("Error joining business:", membershipError);
              } else {
                setMemberId(membership.id);
                setJoined(true);
                setCustomer({
                  id: data.user.id,
                  name: memberData.customer_name,
                  stamps: 0
                });
                setStamps(0);
                setTotalStampsCollected(0);
                setTotalRewardsEarned(0);
                
                toast({
                  title: "Welcome!",
                  description: `You've been automatically enrolled in ${businessName}'s loyalty program!`,
                });
              }
            } catch (e) {
              console.error("Error auto-joining loyalty program:", e);
            }
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        
        if (error) {
          setAuthError(error.message);
          setAuthLoading(false);
          return;
        }
        
        toast({
          title: "Login Successful",
          description: "You've been logged in successfully!",
        });
        
        if (data.user) {
          setUserId(data.user.id);
          
          if (businessData && businessData.id) {
            const { data: membership, error: membershipError } = await supabase
              .from('business_members')
              .select('*')
              .eq('business_id', businessData.id)
              .eq('user_id', data.user.id)
              .single();
              
            if (!membershipError && membership) {
              setJoined(true);
              setMemberId(membership.id);
              setCustomerName(membership.customer_name || "");
              setCustomer({
                id: data.user.id,
                name: membership.customer_name || "Member",
                stamps: membership.stamps || 0
              });
              setStamps(membership.stamps || 0);
              setTotalStampsCollected(membership.total_stamps_collected || 0);
              setTotalRewardsEarned(membership.total_rewards_earned || 0);
            } else {
              try {
                const memberData = {
                  business_id: businessData.id,
                  stamps: 0,
                  customer_name: customerName || data.user.email?.split('@')[0] || "Member",
                  user_id: data.user.id,
                  is_anonymous: false,
                  total_stamps_collected: 0,
                  total_rewards_earned: 0
                };
                
                const { data: newMembership, error: newMembershipError } = await supabase
                  .from('business_members')
                  .insert(memberData)
                  .select('id')
                  .single();
                  
                if (!newMembershipError) {
                  setMemberId(newMembership.id);
                  setJoined(true);
                  setCustomer({
                    id: data.user.id,
                    name: memberData.customer_name,
                    stamps: 0
                  });
                  setStamps(0);
                  setTotalStampsCollected(0);
                  setTotalRewardsEarned(0);
                  
                  toast({
                    title: "Welcome!",
                    description: `You've been automatically enrolled in ${businessName}'s loyalty program!`,
                  });
                }
              } catch (e) {
                console.error("Error auto-joining loyalty program:", e);
              }
            }
          }
        }
      }
      
      setAuthLoading(false);
    } catch (error) {
      console.error('Authentication error:', error);
      setAuthError('An unexpected error occurred. Please try again.');
      setAuthLoading(false);
    }
  };

  const handleCollectStamp = () => {
    setScannerOpen(true);
  };

  const handleSuccessfulScan = (businessId: string, timestamp: number, stampCount: number = 1) => {
    setScannerOpen(false);
    
    if (businessData && businessData.id && businessId !== businessData.id) {
      toast({
        title: "Wrong Business QR Code",
        description: "The QR code you scanned is for a different business.",
        variant: "destructive"
      });
      return;
    }
    
    const newStamps = Math.min(stamps + stampCount, loyaltyCardConfig?.maxStamps || 10);
    const newTotalStamps = totalStampsCollected + stampCount;
    
    const oldRewards = Math.floor(stamps / (loyaltyCardConfig?.maxStamps || 10));
    const newRewards = Math.floor(newStamps / (loyaltyCardConfig?.maxStamps || 10));
    const newEarnedRewards = totalRewardsEarned + (newRewards > oldRewards ? 1 : 0);
    
    setStamps(newStamps);
    setTotalStampsCollected(newTotalStamps);
    setTotalRewardsEarned(newEarnedRewards);
    
    setCustomer(prev => ({
      ...prev,
      stamps: newStamps
    }));
    
    toast({
      title: "Stamp Collected!",
      description: `You've collected ${stampCount} stamp${stampCount > 1 ? 's' : ''}.`,
    });
    
    if (businessData?.id && memberId) {
      supabase
        .from('business_members')
        .update({ 
          stamps: newStamps,
          total_stamps_collected: newTotalStamps,
          total_rewards_earned: newEarnedRewards
        })
        .eq('id', memberId)
        .then(({ error }) => {
          if (error) {
            console.error("Error updating stamps:", error);
          }
        });
        
      if (!userId) {
        try {
          const savedMemberships = localStorage.getItem('memberships') || '[]';
          const memberships = JSON.parse(savedMemberships);
          const membershipIndex = memberships.findIndex((m: any) => m.id === memberId);
          
          if (membershipIndex !== -1) {
            memberships[membershipIndex].stamps = newStamps;
            memberships[membershipIndex].totalStampsCollected = newTotalStamps;
            memberships[membershipIndex].totalRewardsEarned = newEarnedRewards;
            localStorage.setItem('memberships', JSON.stringify(memberships));
          }
        } catch (e) {
          console.error("Error updating localStorage:", e);
        }
      }
    }
  };

  const handleNewCard = async () => {
    if (businessData?.id && memberId) {
      try {
        const wasRewardEarned = stamps >= (loyaltyCardConfig?.maxStamps || 10);
        const newTotalRewards = wasRewardEarned ? totalRewardsEarned + 1 : totalRewardsEarned;
        
        const { error } = await supabase
          .from('business_members')
          .update({ 
            stamps: 0,
            total_rewards_earned: newTotalRewards
          })
          .eq('id', memberId);
          
        if (error) {
          console.error("Error resetting stamps:", error);
          toast({
            title: "Error",
            description: "Could not reset your card. Please try again.",
            variant: "destructive"
          });
          return;
        }
        
        setStamps(0);
        setTotalRewardsEarned(newTotalRewards);
        
        if (!userId) {
          try {
            const savedMemberships = localStorage.getItem('memberships') || '[]';
            const memberships = JSON.parse(savedMemberships);
            const membershipIndex = memberships.findIndex((m: any) => m.id === memberId);
            
            if (membershipIndex !== -1) {
              memberships[membershipIndex].stamps = 0;
              memberships[membershipIndex].totalRewardsEarned = newTotalRewards;
              localStorage.setItem('memberships', JSON.stringify(memberships));
            }
          } catch (e) {
            console.error("Error updating localStorage:", e);
          }
        }
        
        toast({
          title: "Card Reset",
          description: "Your loyalty card has been reset. Your rewards history is maintained!"
        });
      } catch (e) {
        console.error("Error resetting card:", e);
        toast({
          title: "Error",
          description: "Could not reset your card. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState errorMessage={error} />;
  }

  if (businessInactive) {
    return <ErrorState errorMessage="This loyalty program is currently not available." />;
  }

  if (joined && customer && businessData) {
    return <MemberCard 
      businessName={businessName}
      businessData={businessData}
      loyaltyCardConfig={loyaltyCardConfig}
      customerName={customerName || customer.name}
      stamps={stamps}
      totalStampsCollected={totalStampsCollected}
      totalRewardsEarned={totalRewardsEarned}
      userId={userId}
      onCollectStamp={handleCollectStamp}
      onResetCard={handleNewCard}
      scannerOpen={scannerOpen}
      onScannerClose={() => setScannerOpen(false)}
      onSuccessfulScan={handleSuccessfulScan}
    />;
  }

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
      onSubmit={handleAuthSubmit}
      authLoading={authLoading}
      authError={authError}
    />
  );
};

export default JoinPage;
