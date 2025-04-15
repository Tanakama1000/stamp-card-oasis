
import React from "react";
import { Coffee, QrCode } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoyaltyCard from "@/components/LoyaltyCard";

interface MemberCardProps {
  businessName: string;
  customerName: string;
  stamps: number;
  loyaltyCardConfig: any;
  handleCollectStamp: () => void;
}

const MemberCard = ({ 
  businessName, 
  customerName, 
  stamps, 
  loyaltyCardConfig,
  handleCollectStamp
}: MemberCardProps) => {
  return (
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
  );
};

export default MemberCard;
