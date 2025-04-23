import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import LoyaltyCard from "@/components/LoyaltyCard";
import RewardsCard from "@/components/loyalty/RewardsCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoyaltyCardConfig } from "@/components/loyalty/types/LoyaltyCardConfig";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState<string>("");
  const [stamps, setStamps] = useState<number>(0);
  const [cardStyle, setCardStyle] = useState<LoyaltyCardConfig | null>(null);
  const maxStamps = cardStyle?.maxStamps || 10;
  const [totalEarned, setTotalEarned] = useState<number>(0);
  const [businessId, setBusinessId] = useState<string>("");

  useEffect(() => {
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

    const savedName = localStorage.getItem('customerName');
    if (savedName) {
      setCustomerName(savedName);
    }

    const savedStamps = localStorage.getItem('stamps');
    if (savedStamps) {
      setStamps(parseInt(savedStamps, 10));
    }

    const savedTotalEarned = localStorage.getItem('totalEarned');
    if (savedTotalEarned) {
      setTotalEarned(parseInt(savedTotalEarned, 10));
    }
  }, []);

  useEffect(() => {
    const earnedRewards = Math.floor(stamps / maxStamps);
    setTotalEarned(earnedRewards);
    
    localStorage.setItem('stamps', stamps.toString());
    localStorage.setItem('totalEarned', earnedRewards.toString());
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

  const handleStampCollected = () => {
    toast({
      title: "Stamp Collected!",
      description: "You're getting closer to your reward!",
      duration: 2000,
    });
    
    const newStamps = stamps + 1;
    setStamps(newStamps);
    localStorage.setItem('stamps', newStamps.toString());
  };
  
  const handleCardReset = () => {
    console.log("Card reset in Index.tsx");
    setStamps(0);
    localStorage.setItem('stamps', '0');
    
    const historicalEarned = totalEarned;
    localStorage.setItem('totalEarned', historicalEarned.toString());
  };
  
  useEffect(() => {
    console.log("Current business ID:", businessId);
  }, [businessId]);
  
  const handleSaveName = () => {
    localStorage.setItem('customerName', customerName);
    
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
  };

  const miniRewards = cardStyle?.rewards || [];
  const sortedRewards = [...(miniRewards || [])].sort((a, b) => a.stampNumber - b.stampNumber);
  const availableRewards = Math.floor(stamps / maxStamps);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-coffee-dark mb-2">Welcome to Stamp Card Oasis</h1>
          <p className="text-coffee-light">Collect stamps and earn rewards from your favorite businesses</p>
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
        
        <div className="mb-8">
          <RewardsCard 
            rewardsCount={Math.floor(stamps / maxStamps)}
            totalEarned={totalEarned}
            totalStamps={stamps}
            textColor={cardStyle?.businessNameColor || "#0066CC"}
            accentColor={cardStyle?.stampBgColor || "#E5F0FF"}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
