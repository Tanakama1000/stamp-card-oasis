
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Share2, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReferralCardProps {
  referralCode: string;
  businessName: string;
  bonusPoints: number;
  themeColor: string;
}

const ReferralCard: React.FC<ReferralCardProps> = ({
  referralCode,
  businessName,
  bonusPoints,
  themeColor
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy referral code",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    const shareText = `Join ${businessName} loyalty program with my referral code: ${referralCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${businessName} Referral`,
          text: shareText,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback to copying
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied!",
        description: "Referral message copied to clipboard",
      });
    }
  };

  return (
    <Card className="p-4 mt-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed" style={{ borderColor: themeColor }}>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gift size={20} style={{ color: themeColor }} />
          <h3 className="font-bold text-lg" style={{ color: themeColor }}>
            Refer Friends & Earn {bonusPoints} Stamps!
          </h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Share your referral code and earn bonus stamps when your friends make their first purchase
        </p>
        
        <div className="flex items-center gap-2 mb-3">
          <Input
            value={referralCode}
            readOnly
            className="text-center font-mono font-bold text-lg"
            style={{ borderColor: themeColor }}
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleCopy}
            variant="outline"
            className="flex-1 flex items-center gap-2"
            style={{ borderColor: themeColor, color: themeColor }}
          >
            <Copy size={16} />
            {copied ? "Copied!" : "Copy Code"}
          </Button>
          
          <Button
            onClick={handleShare}
            className="flex-1 flex items-center gap-2 text-white"
            style={{ backgroundColor: themeColor }}
          >
            <Share2 size={16} />
            Share
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ReferralCard;
