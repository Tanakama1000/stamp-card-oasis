
import React from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coffee, UserPlus, LogIn } from "lucide-react";
import LoyaltyCard from "@/components/LoyaltyCard";

interface JoinFormProps {
  businessName: string;
  loyaltyCardConfig: any;
  customerName: string;
  setCustomerName: (value: string) => void;
  onJoin: (e: React.FormEvent) => void;
  setIsAuthMode: (value: boolean) => void;
  setIsSignup: (value: boolean) => void;
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
  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8">
        <Card className="p-6 bg-white card-shadow">
          <div className="text-center mb-6">
            {loyaltyCardConfig?.businessLogo ? (
              <img 
                src={loyaltyCardConfig.businessLogo} 
                alt={businessName}
                className="h-16 w-16 object-contain mx-auto mb-2"
              />
            ) : (
              <Coffee size={40} className="mx-auto text-coffee-dark mb-2" />
            )}
            <h2 
              className="text-2xl font-bold"
              style={{ color: loyaltyCardConfig?.businessNameColor || "#2563EB" }}
            >
              Join {businessName || "Business"}
            </h2>
            <p 
              className="text-coffee-light mt-1"
              style={{ color: loyaltyCardConfig?.textColor || "#6F4E37" }}
            >
              Create an account to join the loyalty program
            </p>
          </div>

          <div className="mb-6">
            <p className="text-sm text-center mb-2 text-gray-500">Here's what your loyalty card will look like:</p>
            <LoyaltyCard 
              customerName="Your Name"
              maxStamps={loyaltyCardConfig?.maxStamps || 10}
              currentStamps={0}
              cardStyle={loyaltyCardConfig || {}}
              onStampCollected={() => {}}
              onReset={() => {}}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => { setIsSignup(true); setIsAuthMode(true); }}
              className="w-full bg-coffee-medium hover:bg-coffee-dark text-white flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: loyaltyCardConfig?.stampActiveColor || "#F97316",
                borderColor: loyaltyCardConfig?.stampActiveColor || "#F97316"
              }}
            >
              <UserPlus size={18} />
              Create Account
            </Button>
            
            <Button
              onClick={() => { setIsSignup(false); setIsAuthMode(true); }}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              Login
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default JoinForm;
