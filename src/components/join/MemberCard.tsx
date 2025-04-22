
import React from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, QrCode } from "lucide-react";
import LoyaltyCard from "@/components/LoyaltyCard";
import QRScannerDialog from "@/components/QRScannerDialog";
import RewardsCard from "@/components/loyalty/RewardsCard";

interface MemberCardProps {
  businessName: string;
  businessData: any;
  loyaltyCardConfig: any;
  customerName: string;
  stamps: number;
  totalStampsCollected: number;
  totalRewardsEarned: number;
  userId: string | null;
  onCollectStamp: () => void;
  onResetCard: () => void;
  scannerOpen: boolean;
  onScannerClose: () => void;
  onSuccessfulScan: (businessId: string, timestamp: number, stampCount?: number) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({
  businessName,
  businessData,
  loyaltyCardConfig,
  customerName,
  stamps,
  totalStampsCollected,
  totalRewardsEarned,
  userId,
  onCollectStamp,
  onResetCard,
  scannerOpen,
  onScannerClose,
  onSuccessfulScan
}) => {
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
              customerName={customerName}
              maxStamps={loyaltyCardConfig?.maxStamps || 10}
              currentStamps={stamps}
              cardStyle={loyaltyCardConfig}
              onStampCollected={() => {}}
              onReset={onResetCard}
              businessId={businessData.id}
            />
          </div>
          
          <div className="mt-6 mb-6">
            <RewardsCard 
              rewardsCount={Math.floor(stamps / (loyaltyCardConfig?.maxStamps || 10))}
              totalEarned={totalRewardsEarned}
              totalStamps={totalStampsCollected}
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
              onClick={onCollectStamp}
              className="w-full flex items-center justify-center gap-2 bg-[#5271ff] hover:bg-[#3a5dff] text-white"
            >
              <QrCode size={20} />
              Scan QR Code to Collect Stamp
            </Button>
          </div>
        </Card>

        <QRScannerDialog 
          isOpen={scannerOpen} 
          onClose={onScannerClose}
          onSuccessfulScan={onSuccessfulScan}
        />
      </div>
    </Layout>
  );
};

export default MemberCard;
