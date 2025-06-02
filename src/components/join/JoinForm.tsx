
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coffee, UserPlus, LogIn } from "lucide-react";
import LoyaltyCard from "@/components/LoyaltyCard";
import ReferralInput from "@/components/referral/ReferralInput";

interface JoinFormProps {
  businessName: string;
  loyaltyCardConfig: any;
  customerName: string;
  setCustomerName: (name: string) => void;
  onJoin: (e: React.FormEvent, referralCode?: string) => void;
  setIsAuthMode: (mode: boolean) => void;
  setIsSignup: (signup: boolean) => void;
}

const JoinForm: React.FC<JoinFormProps> = ({
  businessName,
  loyaltyCardConfig,
  customerName,
  setCustomerName,
  onJoin,
  setIsAuthMode,
  setIsSignup
}) => {
  const [referralCode, setReferralCode] = useState("");
  const themeColor = loyaltyCardConfig?.businessNameColor || "#0EA5E9";

  const handleJoin = (e: React.FormEvent) => {
    onJoin(e, referralCode);
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8">
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
              className="text-2xl font-bold mb-2"
              style={{ color: themeColor }}
            >
              Join {businessName}
            </h2>
            <p style={{ color: themeColor }}>
              Start collecting stamps and earn rewards!
            </p>
          </div>
          
          {loyaltyCardConfig && (
            <div className="mb-6">
              <LoyaltyCard 
                customerName={customerName || "Your Name"}
                maxStamps={loyaltyCardConfig.maxStamps || 10}
                currentStamps={0}
                cardStyle={loyaltyCardConfig}
                onStampCollected={() => {}}
                onReset={() => {}}
                businessId=""
                isPreview={true}
              />
            </div>
          )}

          <form onSubmit={handleJoin} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            
            <ReferralInput
              businessId="preview"
              referralCode={referralCode}
              setReferralCode={setReferralCode}
              themeColor={themeColor}
            />

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2 text-white"
              style={{ backgroundColor: themeColor }}
            >
              <UserPlus size={20} />
              Join Loyalty Program
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Already have an account?
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsSignup(false);
                setIsAuthMode(true);
              }}
              className="w-full flex items-center justify-center gap-2"
              style={{ borderColor: themeColor, color: themeColor }}
            >
              <LogIn size={20} />
              Sign In
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default JoinForm;
