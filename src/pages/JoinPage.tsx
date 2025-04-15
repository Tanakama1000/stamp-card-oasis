
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Coffee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LoyaltyCard from "@/components/LoyaltyCard";

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

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        // For development, we'll check if we have Supabase data
        const { data: businesses, error } = await supabase
          .from("businesses")
          .select("*")
          .eq("slug", businessSlug)
          .single();
        
        if (error) {
          console.error("Error fetching business:", error);
          // Fallback to local storage for development
          const savedBusinesses = localStorage.getItem('businesses');
          let foundBusiness = null;
          
          if (savedBusinesses) {
            try {
              const businesses = JSON.parse(savedBusinesses);
              foundBusiness = businesses.find((b: any) => b.slug === businessSlug);
            } catch (e) {
              console.error("Error parsing businesses:", e);
            }
          }
          
          if (foundBusiness) {
            setBusinessName(foundBusiness.name);
            setBusinessData(foundBusiness);
          } else if (businessSlug === "coffee-oasis") {
            // Fallback for demo
            setBusinessName("Coffee Oasis");
            setBusinessData({
              name: "Coffee Oasis",
              slug: "coffee-oasis",
              cardConfig: {
                businessName: "Coffee Oasis",
                cardTitle: "Loyalty Card",
                maxStamps: 10,
                stampIcon: "Coffee",
                cardBgColor: "#FFFFFF",
                textColor: "#6F4E37",
                businessNameColor: "#2563EB",
                cardTitleColor: "#2563EB",
                rewardTextColor: "#2563EB",
              }
            });
          } else {
            setError("Business not found");
          }
        } else if (businesses) {
          setBusinessName(businesses.name);
          setBusinessData(businesses);
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
    
    fetchBusinessData();
  }, [businessSlug]);

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
        // For development, store in local storage
        const customerId = `cust_${Date.now()}`;
        const newCustomer = {
          id: customerId,
          name: customerName,
          businessSlug: businessSlug,
          joinedAt: new Date().toISOString(),
          stamps: 0
        };
        
        // Try to insert into Supabase if available
        if (businessData.id) {
          // Generate a random UUID for user_id if no authentication is implemented
          // In a real app, this would be auth.uid() from the authenticated user
          const tempUserId = `temp_user_${Date.now()}`;
          
          const { error } = await supabase
            .from('business_members')
            .insert({
              business_id: businessData.id,
              user_id: tempUserId, // Add the required user_id field
              stamps: 0
            });
            
          if (error && error.code !== "23505") { // Ignore unique constraint violations
            console.error("Error joining business:", error);
          }
        }
        
        // Also store in local storage for development
        try {
          const savedCustomers = localStorage.getItem('customers') || '[]';
          const customers = JSON.parse(savedCustomers);
          customers.push(newCustomer);
          localStorage.setItem('customers', JSON.stringify(customers));
        } catch (e) {
          console.error("Error saving to localStorage:", e);
        }
        
        toast({
          title: "Welcome!",
          description: `You've successfully joined ${businessName}'s loyalty program!`,
        });
        
        setJoined(true);
        setCustomer(newCustomer);
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
    toast({
      title: "Not Available",
      description: "In a real app, stamps would be added by the business via QR code scanning.",
    });
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
        <div className="max-w-md mx-auto mt-8">
          <Card className="p-6 bg-white card-shadow">
            <div className="text-center mb-6">
              {businessData.cardConfig?.businessLogo ? (
                <img 
                  src={businessData.cardConfig.businessLogo} 
                  alt={businessName}
                  className="h-12 w-12 object-contain mx-auto mb-2"
                />
              ) : (
                <Coffee size={40} className="mx-auto text-coffee-dark mb-2" />
              )}
              <h2 
                className="text-2xl font-bold mb-1"
                style={{ color: businessData.cardConfig?.businessNameColor || "#2563EB" }}
              >
                Welcome to {businessName}!
              </h2>
              <p 
                style={{ color: businessData.cardConfig?.cardTitleColor || "#2563EB" }}
              >
                Here's your loyalty card
              </p>
            </div>
            
            <div className="mb-6">
              <LoyaltyCard 
                customerName={customerName}
                maxStamps={businessData.cardConfig?.maxStamps || 10}
                currentStamps={customer.stamps}
                cardStyle={businessData.cardConfig}
                onStampCollected={handleCollectStamp}
                onReset={() => {}}
              />
            </div>

            <div className="text-center space-y-4">
              <p 
                className="text-sm"
                style={{ color: businessData.cardConfig?.rewardTextColor || "#2563EB" }}
              >
                Show this card when you visit {businessName} to collect stamps
              </p>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8">
        <Card className="p-6 bg-white card-shadow">
          <div className="text-center mb-6">
            <Coffee size={40} className="mx-auto text-coffee-dark mb-2" />
            <h2 className="text-2xl font-bold text-coffee-dark">Join {businessName}</h2>
            <p className="text-coffee-light mt-1">Enter your name to join the loyalty program</p>
          </div>

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-coffee-dark mb-1">
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

            <Button type="submit" className="w-full bg-orange hover:bg-orange-dark text-white">
              Join Loyalty Program
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default JoinPage;
