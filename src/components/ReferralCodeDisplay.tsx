
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReferralCodeDisplayProps {
  referralCode: string;
  customerName: string;
  businessName: string;
  businessSlug: string;
}

const ReferralCodeDisplay: React.FC<ReferralCodeDisplayProps> = ({
  referralCode,
  customerName,
  businessName,
  businessSlug
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}/join/${businessSlug}?ref=${referralCode}`;

  const copyToClipboard = async (text: string, type: "code" | "link") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Copied!",
        description: `Referral ${type} copied to clipboard.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const shareReferral = async () => {
    const shareData = {
      title: `Join ${businessName}`,
      text: `Join me at ${businessName} and we both get bonus stamps! Use my referral code: ${referralCode}`,
      url: referralLink
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard(referralLink, "link");
      }
    } else {
      copyToClipboard(referralLink, "link");
    }
  };

  return (
    <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-purple-900">Your Referral Code</h3>
        </div>
        
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-purple-700 tracking-wider">
            {referralCode}
          </div>
          <p className="text-sm text-purple-600">
            Share this code with friends to earn bonus stamps!
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(referralCode, "code")}
            className="flex-1"
          >
            <Copy className="h-4 w-4 mr-1" />
            {copied ? "Copied!" : "Copy Code"}
          </Button>
          
          <Button
            size="sm"
            onClick={shareReferral}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share Link
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ReferralCodeDisplay;
