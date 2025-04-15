
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

const JoinPage = () => {
  const { businessSlug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [businessName, setBusinessName] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState<boolean>(false);
  const [businessData, setBusinessData] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [scannerOpen, setScannerOpen] = useState<boolean>(false);
  const [stamps, setStamps] = useState<number>(0);
  const [loyaltyCardConfig, setLoyaltyCardConfig] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);
  
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isAuthMode, setIsAuthMode] = useState<boolean>(false);
  const [isSignup, setIsSignup] = useState<boolean>(true);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUserId(data.session.user.id);
      } else {
        setIsAuthMode(true);
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
            setBusinessName(foundBusiness.name);
            setBusinessData(foundBusiness);
            await fetchLoyaltyCardConfig(foundBusiness.id);
          } else if (businessSlug === "coffee-oasis") {
            setBusinessName("Coffee Oasis");
            const defaultBusinessData = {
              name: "Coffee Oasis",
              slug: "coffee-oasis",
              id: "coffee-oasis-id"
            };
            setBusinessData(defaultBusinessData);
            await fetchLoyaltyCardConfig(defaultBusinessData.id);
          } else {
            setError("Business not found");
          }
        } else if (businesses) {
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

  // This function is now only used for manual joins (deprecated/less used path)
  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to join.",
        variant: "destructive"
      });
      return;
    }

    if (businessData) {
      try {
        let membershipId;
        
        if (businessData.id) {
          const memberData = {
            business_id: businessData.id,
            stamps: 0,
            customer_name: customerName,
            is_anonymous: !userId
          };
          
          if (userId) {
            memberData['user_id'] = userId;
          }
          
          const { data: membership, error } = await supabase
            .from('business_members')
            .insert(memberData)
            .select('id')
            .single();
            
          if (error) {
            console.error("Error joining business:", error);
            toast({
              title: "Error",
              description: "Could not join the loyalty program. Please try again.",
              variant: "destructive"
            });
            return;
          }
          
          membershipId = membership.id;
          setMemberId(membershipId);
        }
        
        if (!userId) {
          try {
            const membershipData = {
              id: membershipId,
              businessId: businessData.id,
              businessSlug: businessSlug,
              customerName: customerName,
              joinedAt: new Date().toISOString(),
              stamps: 0
            };
            
            const savedMemberships = localStorage.getItem('memberships') || '[]';
            const memberships = JSON.parse(savedMemberships);
            memberships.push(membershipData);
            localStorage.setItem('memberships', JSON.stringify(memberships));
          } catch (e) {
            console.error("Error saving to localStorage:", e);
          }
        }
        
        toast({
          title: "Welcome!",
          description: `You've successfully joined ${businessName}'s loyalty program!`,
        });
        
        setJoined(true);
        setCustomer({
          id: membershipId || 'temp-id',
          name: customerName,
          stamps: 0
        });
        setStamps(0);
      } catch (e) {
        console.error("Error joining:", e);
        toast({
          title: "Error",
          description: "Could not complete your request. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  // Updated to automatically join the loyalty program after signup
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
          
          // Automatically join the loyalty program after successful signup
          if (businessData && businessData.id) {
            try {
              const memberData = {
                business_id: businessData.id,
                stamps: 0,
                customer_name: customerName,
                user_id: data.user.id,
                is_anonymous: false
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
                  name: customerName,
                  stamps: 0
                });
                setStamps(0);
              }
            } catch (e) {
              console.error("Error auto-joining loyalty program:", e);
            }
          }
          
          setIsAuthMode(false);
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
          setIsAuthMode(false);
          
          // Check if the user is already a member
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
            } else {
              // Automatically join if not already joined
              try {
                const memberData = {
                  business_id: businessData.id,
                  stamps: 0,
                  customer_name: customerName || data.user.email?.split('@')[0] || "Member",
                  user_id: data.user.id,
                  is_anonymous: false
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
    setStamps(newStamps);
    
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
        .update({ stamps: newStamps })
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
            localStorage.setItem('memberships', JSON.stringify(memberships));
          }
        } catch (e) {
          console.error("Error updating localStorage:", e);
        }
      }
    }
  };

  const toggleAuthMode = () => {
    setIsAuthMode(!isAuthMode);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-coffee-dark" />
          <p className="mt-4 text-coffee-light">Loading business details...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-12 text-center">
          <Card className="p-6 bg-white card-shadow">
            <div className="text-red-500 text-xl mb-4">Business Not Found</div>
            <p className="mb-6">The business you're looking for doesn't exist or the link is invalid.</p>
            <Link to="/">
              <Button>Return Home</Button>
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  if (isAuthMode) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-8">
          <Card className="p-6 bg-white card-shadow">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-1">
                {isSignup ? 'Create an Account' : 'Login'}
              </h2>
              <p className="text-gray-600">
                {isSignup 
                  ? 'Join with an account to access loyalty cards and rewards' 
                  : 'Welcome back! Login to access your loyalty cards'}
              </p>
            </div>
            
            {authError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {authError}
              </div>
            )}
            
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isSignup && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={authLoading}
              >
                {authLoading 
                  ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  : isSignup ? 'Create Account' : 'Login'}
              </Button>
              
              <div className="text-center mt-4">
                <Button 
                  type="button" 
                  variant="link"
                  onClick={() => setIsSignup(!isSignup)}
                >
                  {isSignup 
                    ? 'Already have an account? Login' 
                    : "Don't have an account? Sign Up"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </Layout>
    );
  }

  if (joined && customer && businessData) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-8 mb-12">
          <Card className="p-6 bg-white card-shadow">
            <div className="text-center mb-6">
              {loyaltyCardConfig?.businessLogo ? (
                <img 
                  src={loyaltyCardConfig.businessLogo} 
                  alt={businessName}
                  className="h-12 w-12 object-contain mx-auto mb-2"
                />
              ) : (
                <Coffee size={40} className="mx-auto text-coffee-dark mb-2" />
              )}
              <h2 
                className="text-2xl font-bold mb-1"
                style={{ color: loyaltyCardConfig?.businessNameColor || "#2563EB" }}
              >
                Welcome to {businessName}!
              </h2>
              <p 
                style={{ color: loyaltyCardConfig?.cardTitleColor || "#2563EB" }}
              >
                Here's your loyalty card
              </p>
              
              {userId ? (
                <div className="mt-2 text-sm text-green-600 flex items-center justify-center gap-1">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Signed in as member
                </div>
              ) : (
                <div className="mt-2 text-sm text-gray-500">
                  Guest mode - card stored on this device only
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <LoyaltyCard 
                customerName={customerName || customer.name}
                maxStamps={loyaltyCardConfig?.maxStamps || 10}
                currentStamps={stamps}
                cardStyle={loyaltyCardConfig}
                onStampCollected={() => {}}
                onReset={() => {}}
              />
            </div>
            
            <div className="mt-6 mb-6">
              <RewardsCard 
                rewardsCount={Math.floor(stamps / (loyaltyCardConfig?.maxStamps || 10))}
                totalEarned={Math.floor(stamps / (loyaltyCardConfig?.maxStamps || 10))}
                redeemed={0}
                textColor={loyaltyCardConfig?.businessNameColor || "#2563EB"}
                accentColor={loyaltyCardConfig?.stampBgColor || "#E5F0FF"}
              />
            </div>

            <div className="text-center space-y-4">
              <p 
                className="text-sm"
                style={{ color: loyaltyCardConfig?.rewardTextColor || "#2563EB" }}
              >
                Show this card when you visit {businessName} to collect stamps
              </p>
              
              <Button
                onClick={handleCollectStamp}
                className="w-full flex items-center justify-center gap-2 bg-[#5271ff] hover:bg-[#3a5dff] text-white"
              >
                <QrCode size={20} />
                Scan QR Code to Collect Stamp
              </Button>
            </div>
          </Card>
        </div>

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
      <div className="max-w-md mx-auto mt-8">
        <Card className="p-6 bg-white card-shadow">
          <div className="text-center mb-6">
            {loyaltyCardConfig?.businessLogo ? (
              <img 
                src={loyaltyCardConfig.businessLogo} 
                alt={businessName}
                className="h-16 w-16 object-contain mx-auto mb-2"
              />
            ) : (
              <Coffee size={40} className="mx-auto text-coffee-dark mb-2" />
            )}
            <h2 
              className="text-2xl font-bold"
              style={{ color: loyaltyCardConfig?.businessNameColor || "#2563EB" }}
            >
              Join {businessName}
            </h2>
            <p 
              className="text-coffee-light mt-1"
              style={{ color: loyaltyCardConfig?.textColor || "#6F4E37" }}
            >
              Create an account to join the loyalty program
            </p>
          </div>

          <div className="mb-6">
            <p className="text-sm text-center mb-2 text-gray-500">Here's what your loyalty card will look like:</p>
            <LoyaltyCard 
              customerName="Your Name"
              maxStamps={loyaltyCardConfig?.maxStamps || 10}
              currentStamps={0}
              cardStyle={loyaltyCardConfig}
              onStampCollected={() => {}}
              onReset={() => {}}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => { setIsSignup(true); setIsAuthMode(true); }}
              className="w-full bg-coffee-medium hover:bg-coffee-dark text-white flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: loyaltyCardConfig?.stampActiveColor || "#F97316",
                borderColor: loyaltyCardConfig?.stampActiveColor || "#F97316"
              }}
            >
              <UserPlus size={18} />
              Create Account
            </Button>
            
            <Button
              onClick={() => { setIsSignup(false); setIsAuthMode(true); }}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              Login
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default JoinPage;
