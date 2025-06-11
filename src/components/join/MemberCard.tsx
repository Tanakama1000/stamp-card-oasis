import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import BonusTimeAlert from "@/components/BonusTimeAlert";
import { useToast } from "@/hooks/use-toast";
import ReferralCodeDisplay from "@/components/ReferralCodeDisplay";

interface MemberCardProps {
  memberData: any;
  businessData: any;
}

const MemberCard: React.FC<MemberCardProps> = ({ memberData, businessData }) => {
  const [progress, setProgress] = useState(0);
  const [isFirstStampCompleted, setIsFirstStampCompleted] = useState(memberData.first_stamp_completed || false);
  const { toast } = useToast();

  useEffect(() => {
    if (memberData && businessData) {
      setProgress(Math.min((memberData.stamps / businessData.max_stamps) * 100, 100));
    }
  }, [memberData, businessData]);

  useEffect(() => {
    const checkAndAwardBonus = async () => {
      if (memberData.stamps > 0 && !isFirstStampCompleted) {
        try {
          const { error } = await supabase
            .from('business_members')
            .update({
              first_stamp_completed: true,
              stamps: memberData.stamps
            })
            .eq('id', memberData.id);

          if (error) {
            console.error("Error awarding referral bonus:", error);
            toast({
              title: "Referral Bonus Error",
              description: "Failed to award referral bonus. Please contact support.",
              variant: "destructive"
            });
          } else {
            setIsFirstStampCompleted(true);
            toast({
              title: "Bonus Awarded!",
              description: "You've received bonus stamps for using a referral code!",
            });
          }
        } catch (error) {
          console.error("Unexpected error awarding referral bonus:", error);
          toast({
            title: "Unexpected Error",
            description: "An unexpected error occurred while awarding the referral bonus.",
            variant: "destructive"
          });
        }
      }
    };

    checkAndAwardBonus();
  }, [memberData, isFirstStampCompleted, toast]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Bonus Time Alert */}
      {businessData && businessData.id && (
        <BonusTimeAlert businessId={businessData.id} />
      )}

      {/* Main Loyalty Card */}
      <Card className="bg-white card-shadow">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-coffee-dark">
                {businessData.name}
              </h3>
              <p className="text-coffee-light">
                {memberData.customer_name}, you're collecting stamps!
              </p>
            </div>
            <img
              src="/coffee-shop.png"
              alt="Coffee Shop"
              className="w-16 h-16 object-cover rounded-md"
            />
          </div>

          <Progress value={progress} className="h-4 rounded-full" />

          <div className="flex items-center justify-between">
            <p className="text-coffee-light">
              {memberData.stamps} / {businessData.max_stamps} stamps
            </p>
            {memberData.stamps >= businessData.max_stamps ? (
              <Badge variant="success" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Reward unlocked!
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-2">
                <XCircle className="h-4 w-4" />
                Keep collecting
              </Badge>
            )}
          </div>
        </div>
      </Card>
      
      {/* Referral Code Section */}
      {memberData.referral_code && (
        <ReferralCodeDisplay
          referralCode={memberData.referral_code}
          customerName={memberData.customer_name || "Member"}
          businessName={businessData.name}
          businessSlug={businessData.slug}
        />
      )}
    </div>
  );
};

export default MemberCard;
