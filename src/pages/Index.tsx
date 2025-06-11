import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import LoyaltyCard from "@/components/LoyaltyCard";
import ProfileDropdown from "@/components/ProfileDropdown";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoyaltyCardConfig } from "@/components/loyalty/types/LoyaltyCardConfig";
import { supabase } from "@/integrations/supabase/client";
import CookieConsent from "@/components/CookieConsent";
import BonusTimeAlert from "@/components/BonusTimeAlert";

const Index = () => {
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState<string>("");
  const [stamps, setStamps] = useState<number>(0);
  const [cardStyle, setCardStyle] = useState<LoyaltyCardConfig | null>(null);
  const maxStamps = cardStyle?.maxStamps || 10;
  const [totalEarned, setTotalEarned] = useState<number>(0);
  const [businessId, setBusinessId] = useState<string>("");
  const [totalStampsCollected, setTotalStampsCollected] = useState<number>(0);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserStats = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        const savedCardStyle = localStorage.getItem('loyaltyCardConfig');
        if (savedCardStyle) {
          try {
            const parsedStyle = JSON.parse(savedCardStyle);
            setCardStyle(parsedStyle);
            
            if (parsedStyle.businessId) {
              setBusinessId(parsedStyle.businessId);
              console.log("Business ID set from localStorage:", parsedStyle.businessId);
            } else {
              console.warn("No businessId found in card configuration");
              const fallbackId = "3967978c-7313-4039-9d80-8b24af9c89fa";
              setBusinessId(fallbackId);
              const updatedStyle = { ...parsedStyle, businessId: fallbackId };
              localStorage.setItem('loyaltyCardConfig', JSON.stringify(updatedStyle));
              console.log("Using and storing fallback businessId");
            }
          } catch (error) {
            console.error("Error parsing card style from localStorage", error);
            handleFallbackBusinessId();
          }
        } else {
          handleFallbackBusinessId();
        }

        if (businessId) {
          // Generate a consistent anonymous ID if user is not logged in
          let anonymousId = localStorage.getItem('anonymousUserId');
          if (!userId && !anonymousId) {
            anonymousId = crypto.randomUUID();
            localStorage.setItem('anonymousUserId', anonymousId);
          }
          
          console.log("Fetching membership data with businessId:", businessId);
          console.log("User ID:", userId || "Anonymous");
          
          const { data: membershipData, error } = await supabase
            .from('business_members')
            .select('*')
            .eq('business_id', businessId)
            .eq(userId ? 'user_id' : 'is_anonymous', userId || true)
            .maybeSingle();

          if (error) {
            console.error('Error fetching membership data:', error);
            throw error;
          }

          if (membershipData) {
            console.log("Retrieved membership data:", membershipData);
            // Set all membership data including persistent total_stamps_collected
            setMemberId(membershipData.id);
            setStamps(membershipData.stamps || 0);
            setTotalEarned(membershipData.total_rewards_earned || 0);
            setCustomerName(membershipData.customer_name || '');
            
            // Explicitly set total stamps collected with proper logging
            const totalStamps = membershipData.total_stamps_collected || 0;
            setTotalStampsCollected(totalStamps);
            console.log("Retrieved total_stamps_collected from database:", totalStamps);
          } else {
            console.log("No existing membership found, creating new one");
            const { data: newMember, error: insertError } = await supabase
              .from('business_members')
              .insert({
                business_id: businessId,
                user_id: userId,
                is_anonymous: !userId,
                stamps: 0,
                total_rewards_earned: 0,
                total_stamps_collected: 0,
                customer_name: ''
              })
              .select('id')
              .single();

            if (insertError) {
              console.error('Error creating membership:', insertError);
              toast({
                title: "Error",
                description: "Failed to create your loyalty card. Please try again.",
                variant: "destructive",
              });
            } else if (newMember) {
              console.log("Created new membership:", newMember);
              setMemberId(newMember.id);
              setStamps(0);
              setTotalStampsCollected(0);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
        toast({
          title: "Error",
          description: "Failed to load your loyalty card. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, [businessId, toast]);

  useEffect(() => {
    // Only run this when we have a valid businessId and we're not initially loading
    if (businessId && !isLoading) {
      console.log("Business ID is set, checking for membership data");
      const checkMembershipData = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          const userId = session?.user?.id;
          
          const { data: membershipData, error } = await supabase
            .from('business_members')
            .select('total_stamps_collected, stamps')
            .eq('business_id', businessId)
            .eq(userId ? 'user_id' : 'is_anonymous', userId || true)
            .maybeSingle();
            
          if (error) {
            console.error('Error checking membership data:', error);
            return;
          }
          
          if (membershipData) {
            console.log("Membership data validation check:", membershipData);
            // Ensure our state matches what's in the database
            setTotalStampsCollected(membershipData.total_stamps_collected || 0);
            setStamps(membershipData.stamps || 0);
          }
        } catch (error) {
          console.error('Error checking membership data:', error);
        }
      };
      
      checkMembershipData();
    }
  }, [businessId, isLoading]);

  useEffect(() => {
    const earnedRewards = Math.floor(stamps / maxStamps);
    setTotalEarned(earnedRewards);
  }, [stamps, maxStamps]);

  const handleFallbackBusinessId = () => {
    const fallbackId = "3967978c-7313-4039-9d80-8b24af9c89fa";
    setBusinessId(fallbackId);
    const basicConfig = {
      businessId: fallbackId,
      maxStamps: 10,
    };
    localStorage.setItem('loyaltyCardConfig', JSON.stringify(basicConfig));
    console.log("Created and stored basic config with fallback businessId");
  };

  const handleStampCollected = async () => {
    if (!businessId) {
      console.error("No business ID available");
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      // Fetch current membership data first
      const { data: membership, error: fetchError } = await supabase
        .from('business_members')
        .select('*')
        .eq('business_id', businessId)
        .eq(userId ? 'user_id' : 'is_anonymous', userId || true)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching membership:', fetchError);
        throw fetchError;
      }

      const newStamps = stamps + 1;
      
      // Important: Increment both current stamps and total stamps collected (permanent stat)
      // Even if we reset the card, total_stamps_collected keeps growing
      const newTotalStampsCollected = (membership?.total_stamps_collected || 0) + 1;
      console.log("Incrementing total stamps collected to:", newTotalStampsCollected);
      setTotalStampsCollected(newTotalStampsCollected);
      
      if (membership) {
        const { error: updateError } = await supabase
          .from('business_members')
          .update({
            stamps: newStamps, 
            total_stamps_collected: newTotalStampsCollected // Update the persistent counter
          })
          .eq('id', membership.id);

        if (updateError) {
          console.error('Error updating stamps:', updateError);
          throw updateError;
        }
        setMemberId(membership.id);
        console.log("Updated membership:", membership.id, "stamps:", newStamps, "total:", newTotalStampsCollected);
      } else {
        const { data: newMembership, error: insertError } = await supabase
          .from('business_members')
          .insert({
            business_id: businessId,
            user_id: userId,
            is_anonymous: !userId,
            stamps: newStamps,
            total_stamps_collected: 1,
            customer_name: customerName
          })
          .select('id')
          .single();

        if (insertError) {
          console.error('Error creating new membership:', insertError);
          throw insertError;
        }
        if (newMembership) {
          console.log("Created new membership with stamps:", newStamps);
          setMemberId(newMembership.id);
        }
      }

      setStamps(newStamps);
      
      toast({
        title: "Stamp Collected!",
        description: "You're getting closer to your reward!",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error collecting stamp:', error);
      toast({
        title: "Error",
        description: "Failed to collect stamp. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleCardReset = async () => {
    console.log("Card reset in Index.tsx");
    
    if (!businessId || !memberId) {
      console.error("Missing business ID or member ID for reset");
      return;
    }
    
    try {
      // Get current data before updating to ensure we preserve the total_stamps_collected value EXACTLY
      const { data: currentMembership, error: fetchError } = await supabase
        .from('business_members')
        .select('total_stamps_collected, stamps')
        .eq('id', memberId)
        .single();
        
      if (fetchError) {
        console.error("Error fetching current membership data:", fetchError);
        throw fetchError;
      }
      
      // Preserve the EXACT total_stamps_collected value without any modifications
      const preservedTotalStamps = currentMembership?.total_stamps_collected || 0;
      const currentStamps = currentMembership?.stamps || 0;
      
      console.log("Index.tsx - Current stamps before reset:", currentStamps);
      console.log("Index.tsx - Preserving exact total stamps value:", preservedTotalStamps);
      
      // Reset the current card stamps but preserve total_stamps_collected EXACTLY as it was
      const { error } = await supabase
        .from('business_members')
        .update({
          stamps: 0, // Reset only the current stamps to 0
          total_stamps_collected: preservedTotalStamps // Keep the EXACT same value, no changes
        })
        .eq('id', memberId);
          
      if (error) {
        console.error("Error resetting stamps in database:", error);
        throw error;
      }
      
      // Update local state to match database
      setStamps(0);
      setTotalStampsCollected(preservedTotalStamps);
      
      console.log("Index.tsx - Card reset complete. Stamps: 0, Total preserved exactly:", preservedTotalStamps);
      
    } catch (error) {
      console.error("Exception while resetting stamps:", error);
      toast({
        title: "Error",
        description: "Failed to reset your card. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSaveName = async () => {
    if (!businessId) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      const { error } = await supabase
        .from('business_members')
        .update({
          customer_name: customerName
        })
        .eq('business_id', businessId)
        .eq(userId ? 'user_id' : 'is_anonymous', userId || true);

      if (error) throw error;
      
      if (customerName.trim()) {
        toast({
          title: "Name Updated",
          description: "Your customer name has been updated.",
          duration: 2000,
        });
      } else {
        toast({
          title: "Name Cleared",
          description: "Customer name has been removed.",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error saving customer name:', error);
      toast({
        title: "Error",
        description: "Failed to save your name. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNameUpdate = (newName: string) => {
    setCustomerName(newName);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      
      // Clear all local state
      setCustomerName("");
      setStamps(0);
      setTotalStampsCollected(0);
      setTotalEarned(0);
      setMemberId(null);
      setUserId(null);
      
      // Clear localStorage
      localStorage.removeItem('anonymousUserId');
      localStorage.removeItem('loyaltyCardConfig');
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        duration: 2000,
      });
      
      // Reload the page to reset everything
      window.location.reload();
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const miniRewards = cardStyle?.rewards || [];
  const sortedRewards = [...(miniRewards || [])].sort((a, b) => a.stampNumber - b.stampNumber);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Header with Profile Button */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-coffee-dark mb-2">Welcome to Stamp Card Oasis</h1>
            <p className="text-coffee-light">Collect stamps and earn rewards from your favorite businesses</p>
          </div>
          <div className="ml-4">
            <ProfileDropdown
              customerName={customerName}
              businessId={businessId}
              onNameUpdate={handleNameUpdate}
              onLogout={handleLogout}
            />
          </div>
        </div>

        {/* Add BonusTimeAlert right after the header */}
        {businessId && <BonusTimeAlert businessId={businessId} />}

        <Card className="bg-gradient-to-r from-coffee-light to-orange p-6 mb-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles size={24} className="text-cream" />
            <h2 className="text-xl font-semibold">Your Loyalty Rewards</h2>
          </div>
          <p className="mb-4">Collect {maxStamps} stamps to earn a free item of your choice!</p>
          
          {sortedRewards.length > 0 && (
            <div className="mb-4 p-3 bg-white/10 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Progress Rewards:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sortedRewards.map((reward, idx) => (
                  <div key={idx} className="flex items-center gap-1 text-sm">
                    <Gift size={14} className={stamps >= reward.stampNumber ? "text-yellow-300" : ""} />
                    <span>
                      Stamp {reward.stampNumber}: {reward.description}
                      {stamps >= reward.stampNumber && " (Unlocked!)"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
              {maxStamps - stamps} stamps to go!
            </div>
            {stamps >= maxStamps && (
              <div className="text-sm bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
                <Gift size={14} />
                Reward Ready!
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <Card className="p-4 bg-white card-shadow">
            <h3 className="font-semibold text-coffee-dark mb-3">Update Your Name</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your name (optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="border-coffee-light"
              />
              <Button
                onClick={handleSaveName}
                className="bg-coffee-medium hover:bg-coffee-dark"
              >
                Save
              </Button>
            </div>
          </Card>
        </div>

        <div className="mb-8">
          <LoyaltyCard
            customerName={customerName}
            maxStamps={maxStamps}
            currentStamps={stamps}
            cardStyle={cardStyle || undefined}
            onStampCollected={handleStampCollected}
            onReset={handleCardReset}
            businessId={businessId}
          />
        </div>
      </div>
      <CookieConsent />
    </Layout>
  );
};

export default Index;
