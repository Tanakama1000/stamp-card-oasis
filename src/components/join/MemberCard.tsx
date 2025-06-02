
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, ScanQrCode } from "lucide-react";
import LoyaltyCard from "@/components/LoyaltyCard";
import QRScannerDialog from "@/components/QRScannerDialog";
import CookieConsent from "@/components/CookieConsent";
import { supabase } from "@/integrations/supabase/client";

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
  const themeColor = loyaltyCardConfig?.businessNameColor || "#0EA5E9";
  const [verifiedTotalStamps, setVerifiedTotalStamps] = useState<number>(totalStampsCollected);
  
  // Double check the total stamps value from database to ensure it's accurate
  useEffect(() => {
    const verifyTotalStamps = async () => {
      if (!businessData?.id) return;
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUserId = session?.user?.id;
        
        const { data: membershipData, error } = await supabase
          .from('business_members')
          .select('total_stamps_collected')
          .eq('business_id', businessData.id)
          .eq(currentUserId ? 'user_id' : 'is_anonymous', currentUserId || true)
          .maybeSingle();
          
        if (error) {
          console.error('Error verifying total stamps:', error);
          return;
        }
        
        if (membershipData) {
          const dbTotalStamps = membershipData.total_stamps_collected || 0;
          console.log("Verified total stamps from database:", dbTotalStamps);
          setVerifiedTotalStamps(dbTotalStamps);
        }
      } catch (error) {
        console.error('Exception verifying total stamps:', error);
      }
    };
    
    verifyTotalStamps();
  }, [businessData?.id, totalStampsCollected]);
  
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
              <Coffee size={40} className="mx-auto mb-2" style={{ color: themeColor }} />
            )}
            <h2 
              className="text-2xl font-bold mb-1"
              style={{ color: themeColor }}
            >
              Welcome to {businessName}!
            </h2>
            <p style={{ color: themeColor }}>
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

          <div className="text-center space-y-4">
            <p className="text-sm" style={{ color: themeColor }}>
              Show this card when you visit {businessName} to collect stamps
            </p>
            
            <Button
              onClick={onCollectStamp}
              className="w-full flex items-center justify-center gap-2 text-white"
              style={{ backgroundColor: themeColor, borderColor: themeColor }}
            >
              <ScanQrCode size={20} />
              Scan QR Code to Collect Stamp
            </Button>
          </div>
          
          {/* Removed the RewardsCard component from here */}
        </Card>

        <QRScannerDialog 
          isOpen={scannerOpen} 
          onClose={onScannerClose}
          onSuccessfulScan={onSuccessfulScan}
        />
      </div>
      <CookieConsent />
    </Layout>
  );
};

export default MemberCard;
