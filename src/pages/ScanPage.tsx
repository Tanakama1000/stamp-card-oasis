import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import QRScanner from "@/components/QRScanner";
import LoyaltyCard from "@/components/LoyaltyCard";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ScanLine, BadgeCheck } from "lucide-react";
import { LoyaltyCardConfig } from "@/components/loyalty/editor/types";

const ScanPage = () => {
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState<string>("");  // Default to empty string
  const [stamps, setStamps] = useState<number>(3);
  const [maxStamps, setMaxStamps] = useState<number>(10);
  const [lastScanTime, setLastScanTime] = useState<number | null>(null);
  const [lastBusinessId, setLastBusinessId] = useState<string | null>(null);
  const [cardStyle, setCardStyle] = useState<LoyaltyCardConfig | null>(null);

  // Fetch card style from localStorage on component mount
  useEffect(() => {
    const savedCardStyle = localStorage.getItem('loyaltyCardStyle');
    if (savedCardStyle) {
      try {
        const parsedStyle = JSON.parse(savedCardStyle);
        setCardStyle(parsedStyle);
        setMaxStamps(parsedStyle.maxStamps || 10);
      } catch (error) {
        console.error("Error parsing card style from localStorage", error);
      }
    }
  }, []);

  const handleSuccessfulScan = (businessId: string, timestamp: number, stampCount: number = 1) => {
    console.log("Successful scan:", { businessId, timestamp, stampCount });
    
    // Check if user has already scanned this business today
    if (lastScanTime && lastBusinessId === businessId) {
      const lastScanDate = new Date(lastScanTime).setHours(0, 0, 0, 0);
      const today = new Date().setHours(0, 0, 0, 0);
      
      if (lastScanDate === today) {
        toast({
          title: "Already Scanned Today",
          description: "You've already collected stamps from this business today.",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Update stamp count
    if (stamps < maxStamps) {
      // Add stamps but don't exceed the maximum
      const newStampCount = Math.min(stamps + stampCount, maxStamps);
      setStamps(newStampCount);
      setLastScanTime(Date.now());
      setLastBusinessId(businessId);
      
      toast({
        title: "Stamps Added!",
        description: `${stampCount} stamp${stampCount > 1 ? 's' : ''} has been added to your loyalty card.`,
      });
    } else {
      toast({
        title: "Card Full!",
        description: "Your card is already full! Redeem your reward.",
      });
    }
  };
  
  const handleCardReset = () => {
    setStamps(0);
    toast({
      title: "New Card Started",
      description: "Your loyalty card has been reset. Start collecting stamps!",
      duration: 3000,
    });
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-coffee-dark mb-2">Scan & Collect</h1>
          <p className="text-coffee-light">Scan a business QR code to collect your stamp</p>
        </div>

        <Card className="bg-gradient-to-r from-coffee-light to-orange p-6 mb-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <ScanLine size={24} className="text-cream" />
            <h2 className="text-xl font-semibold">How It Works</h2>
          </div>
          <ol className="list-decimal list-inside space-y-2 ml-4">
            <li>Ask the business to show their QR code</li>
            <li>Scan it with your camera</li>
            <li>Get your stamp automatically added</li>
            <li>Collect {maxStamps} stamps for a free reward!</li>
          </ol>
          <div className="flex items-center gap-2 mt-4">
            <BadgeCheck size={20} className="text-cream" />
            <p className="text-sm">You can scan once per business per day</p>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <QRScanner onSuccessfulScan={handleSuccessfulScan} />
        </div>

        <div className="mb-8">
          <LoyaltyCard
            customerName={customerName}  // Can now be empty
            maxStamps={maxStamps}
            currentStamps={stamps}
            cardStyle={cardStyle || undefined}
            onStampCollected={() => {}}
            onReset={handleCardReset}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ScanPage;
