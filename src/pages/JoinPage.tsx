
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Coffee, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LoyaltyCard from "@/components/LoyaltyCard";
import QRScannerDialog from "@/components/QRScannerDialog";

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
        // Use case insensitive comparison for the business slug
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
              .single();
              
            if (membership) {
              setJoined(true);
              setCustomer({
                id: userId,
                name: customerName || "Member",
                stamps: membership.stamps || 0
              });
              setStamps(membership.stamps || 0);
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
        let customerId = userId;
        
        if (!customerId) {
          customerId = `anon_${Date.now()}`;
        }
        
        if (businessData.id) {
          const { error } = await supabase
            .from('business_members')
            .upsert({
              business_id: businessData.id,
              user_id: customerId,
              stamps: 0,
            });
            
          if (error) {
            console.error("Error joining business:", error);
            toast({
              title: "Error",
              description: "Could not join the loyalty program. Please try again.",
              variant: "destructive"
            });
            return;
          }
        }
        
        try {
          const newCustomer = {
            id: customerId,
            name: customerName,
            businessSlug: businessSlug,
            businessId: businessData.id,
            joinedAt: new Date().toISOString(),
            stamps: 0
          };
          
          const savedCustomers = localStorage.getItem('customers') || '[]';
          const customers = JSON.parse(savedCustomers);
          customers.push(newCustomer);
          localStorage.setItem('customers', JSON.stringify(customers));
          
          setCustomer(newCustomer);
        } catch (e) {
          console.error("Error saving to localStorage:", e);
        }
        
        toast({
          title: "Welcome!",
          description: `You've successfully joined ${businessName}'s loyalty program!`,
        });
        
        setJoined(true);
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
    
    if (businessData?.id && (userId || customer?.id)) {
      const memberId = userId || customer?.id;
      
      supabase
        .from('business_members')
        .upsert({
          business_id: businessData.id,
          user_id: memberId,
          stamps: newStamps
        })
        .then(({ error }) => {
          if (error) {
            console.error("Error updating stamps:", error);
          }
        });
    }
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
            </div>
            
            <div className="mb-6">
              <LoyaltyCard 
                customerName={customerName}
                maxStamps={loyaltyCardConfig?.maxStamps || 10}
                currentStamps={stamps}
                cardStyle={loyaltyCardConfig}
                onStampCollected={() => {}}
                onReset={() => {}}
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
                className="w-full bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center gap-2"
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
              Enter your name to join the loyalty program
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

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: loyaltyCardConfig?.textColor || "#6F4E37" }}>
                Your Name
              </label>
              <Input
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full text-white"
              style={{ 
                backgroundColor: loyaltyCardConfig?.stampActiveColor || "#F97316",
                borderColor: loyaltyCardConfig?.stampActiveColor || "#F97316"
              }}
            >
              Join Loyalty Program
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default JoinPage;
