
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, ScanQrCode } from "lucide-react";
import LoyaltyCard from "@/components/LoyaltyCard";
import QRScannerDialog from "@/components/QRScannerDialog";
import CookieConsent from "@/components/CookieConsent";
import BonusTimeAlert from "@/components/BonusTimeAlert";
import ProfileDropdown from "@/components/ProfileDropdown";
import { supabase } from "@/integrations/supabase/client";
import { checkScanCooldown, recordScanTimestamp, formatCooldownTime, CooldownInfo } from "@/utils/cooldownUtils";

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
  onNameUpdate: (newName: string) => void;
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
  onSuccessfulScan,
  onNameUpdate
}) => {
  const themeColor = loyaltyCardConfig?.businessNameColor || "#0EA5E9";
  const [verifiedTotalStamps, setVerifiedTotalStamps] = useState<number>(totalStampsCollected);
  const [cooldownInfo, setCooldownInfo] = useState<CooldownInfo>({ isInCooldown: false, remainingSeconds: 0, lastScanTime: null });
  const [cooldownTimer, setCooldownTimer] = useState<NodeJS.Timeout | null>(null);
  
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

  // Check cooldown status on component mount and when stamps change
  useEffect(() => {
    const checkCooldown = async () => {
      if (!businessData?.id) return;
      
      const cooldownMinutes = businessData.cooldown_minutes || 2; // Default to 2 minutes
      const cooldownStatus = await checkScanCooldown(businessData.id, cooldownMinutes);
      setCooldownInfo(cooldownStatus);
      
      if (cooldownStatus.isInCooldown) {
        // Start the countdown timer
        const timer = setInterval(async () => {
          const updatedStatus = await checkScanCooldown(businessData.id, cooldownMinutes);
          setCooldownInfo(updatedStatus);
          
          if (!updatedStatus.isInCooldown) {
            clearInterval(timer);
            setCooldownTimer(null);
          }
        }, 1000);
        
        setCooldownTimer(timer);
      }
    };
    
    checkCooldown();
    
    // Cleanup timer on unmount
    return () => {
      if (cooldownTimer) {
        clearInterval(cooldownTimer);
      }
    };
  }, [businessData?.id, stamps]);

  // Clear timer on component unmount
  useEffect(() => {
    return () => {
      if (cooldownTimer) {
        clearInterval(cooldownTimer);
      }
    };
  }, [cooldownTimer]);

  const handleScanButtonClick = () => {
    if (!cooldownInfo.isInCooldown) {
      onCollectStamp();
    }
  };

  const handleSuccessfulScanWithCooldown = async (businessId: string, timestamp: number, stampCount?: number) => {
    // Record the scan timestamp for cooldown tracking
    await recordScanTimestamp(businessId);
    
    // Call the original success handler
    onSuccessfulScan(businessId, timestamp, stampCount);
    
    // Check cooldown again after successful scan
    const cooldownMinutes = businessData.cooldown_minutes || 2;
    const cooldownStatus = await checkScanCooldown(businessId, cooldownMinutes);
    setCooldownInfo(cooldownStatus);
    
    if (cooldownStatus.isInCooldown) {
      // Start the countdown timer
      const timer = setInterval(async () => {
        const updatedStatus = await checkScanCooldown(businessId, cooldownMinutes);
        setCooldownInfo(updatedStatus);
        
        if (!updatedStatus.isInCooldown) {
          clearInterval(timer);
          setCooldownTimer(null);
        }
      }, 1000);
      
      setCooldownTimer(timer);
    }
  };

  const getButtonText = () => {
    if (cooldownInfo.isInCooldown) {
      return `Wait ${formatCooldownTime(cooldownInfo.remainingSeconds)} to scan again`;
    }
    return "Scan QR Code to Collect Stamp";
  };
  
  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8 mb-12">
        {/* Add BonusTimeAlert at the top */}
        {businessData?.id && <BonusTimeAlert businessId={businessData.id} />}
        
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
              onClick={handleScanButtonClick}
              disabled={cooldownInfo.isInCooldown}
              className={`w-full flex items-center justify-center gap-2 text-white ${
                cooldownInfo.isInCooldown ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{ 
                backgroundColor: cooldownInfo.isInCooldown ? '#9CA3AF' : themeColor, 
                borderColor: cooldownInfo.isInCooldown ? '#9CA3AF' : themeColor 
              }}
            >
              <ScanQrCode size={20} />
              {getButtonText()}
            </Button>

            <ProfileDropdown
              customerName={customerName}
              onNameUpdate={onNameUpdate}
              themeColor={themeColor}
            />
          </div>
          
          {/* Removed the RewardsCard component from here */}
        </Card>

        <QRScannerDialog 
          isOpen={scannerOpen} 
          onClose={onScannerClose}
          onSuccessfulScan={handleSuccessfulScanWithCooldown}
        />
      </div>
      <CookieConsent />
    </Layout>
  );
};

export default MemberCard;
