
import { useState } from "react";
import Layout from "@/components/Layout";
import LoyaltyCard from "@/components/LoyaltyCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState<string>("Coffee Lover");
  const [stamps, setStamps] = useState<number>(3);
  const maxStamps = 10;

  const handleStampCollected = () => {
    toast({
      title: "Stamp Collected!",
      description: "You're getting closer to your reward!",
      duration: 2000,
    });
  };

  const simulateAddStamp = () => {
    if (stamps < maxStamps) {
      setStamps(stamps + 1);
      toast({
        title: "Stamp Added!",
        description: "A stamp has been added to your card.",
        duration: 2000,
      });
    }
  };

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
                placeholder="Enter your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="border-coffee-light"
              />
              <Button
                onClick={() => {
                  toast({
                    title: "Name Updated",
                    description: "Your customer name has been updated.",
                    duration: 2000,
                  });
                }}
                className="bg-coffee-medium hover:bg-coffee-dark"
              >
                Save
              </Button>
            </div>
          </Card>

          <Card className="p-4 bg-white card-shadow">
            <h3 className="font-semibold text-coffee-dark mb-3">Simulation Controls</h3>
            <div className="flex gap-2">
              <Button onClick={simulateAddStamp} className="bg-orange hover:bg-orange-light w-full">
                Simulate Stamp Collection
              </Button>
            </div>
          </Card>
        </div>

        <div className="mb-8">
          <LoyaltyCard
            customerName={customerName}
            maxStamps={maxStamps}
            currentStamps={stamps}
            onStampCollected={handleStampCollected}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
