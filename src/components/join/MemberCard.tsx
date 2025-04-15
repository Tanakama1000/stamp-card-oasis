
import React from "react";
import { QrCode } from "lucide-react";
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
              className="h-12 w-12 object-contain mx-auto mb-2 rounded-full"
            />
          ) : (
            <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-gray-500 text-xl font-bold">{businessName.charAt(0)}</span>
            </div>
          )}
          <h2 
            className="text-2xl font-bold mb-1"
            style={{ color: loyaltyCardConfig?.businessNameColor || "#ad1818" }}
          >
            Welcome to {businessName}!
          </h2>
          <p 
            style={{ color: loyaltyCardConfig?.cardTitleColor || "#ad1818" }}
          >
            Here's your loyalty card
          </p>
        </div>
        
        <div className="mb-6">
          <LoyaltyCard 
            customerName={customerName}
            maxStamps={loyaltyCardConfig?.maxStamps || 5}
            currentStamps={stamps}
            cardStyle={{
              ...loyaltyCardConfig,
              cardBgColor: loyaltyCardConfig?.cardBgColor || "#fff0f0",
              textColor: loyaltyCardConfig?.textColor || "#ad1818",
              businessNameColor: loyaltyCardConfig?.businessNameColor || "#ad1818",
              cardTitleColor: loyaltyCardConfig?.cardTitleColor || "#ad1818",
              rewardTextColor: loyaltyCardConfig?.rewardTextColor || "#ad1818",
              stampActiveColor: loyaltyCardConfig?.stampActiveColor || "#ad1818",
              stampBgColor: loyaltyCardConfig?.stampBgColor || "#fff",
              lastStampText: loyaltyCardConfig?.lastStampText || "20%OFF",
              lastStampTextColor: loyaltyCardConfig?.lastStampTextColor || "#ad1818",
              lastStampBorderColor: loyaltyCardConfig?.lastStampBorderColor || "#ad1818",
            }}
            onStampCollected={() => {}}
            onReset={() => {}}
          />
        </div>

        <div className="text-center space-y-4">
          <p 
            className="text-sm"
            style={{ color: loyaltyCardConfig?.textColor || "#ad1818" }}
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
