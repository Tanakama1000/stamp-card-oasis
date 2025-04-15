
import React from "react";
import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import LoyaltyCard from "@/components/LoyaltyCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface JoinFormProps {
  businessName: string;
  customerName: string;
  setCustomerName: (name: string) => void;
  handleJoin: (e: React.FormEvent) => void;
  loyaltyCardConfig: any;
  isAuthenticated?: boolean;
  onSignInClick?: () => void;
}

const JoinForm = ({ 
  businessName, 
  customerName, 
  setCustomerName, 
  handleJoin, 
  loyaltyCardConfig,
  isAuthenticated = false,
  onSignInClick
}: JoinFormProps) => {
  return (
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
            Join {businessName}
          </h2>
          <p 
            className="text-coffee-light mt-1"
            style={{ color: loyaltyCardConfig?.textColor || "#6F4E37" }}
          >
            Enter your name to join the loyalty program
          </p>
        </div>

        {!isAuthenticated && (
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-sm">
              Sign in to permanently save your loyalty cards and stamps across devices.
            </AlertDescription>
            <div className="mt-2">
              <Button 
                variant="outline" 
                onClick={onSignInClick}
                className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                Sign In or Create Account
              </Button>
            </div>
          </Alert>
        )}

        <div className="mb-6">
          <p className="text-sm text-center mb-2 text-gray-500">Here's what your loyalty card will look like:</p>
          <LoyaltyCard 
            customerName="Your Name"
            maxStamps={loyaltyCardConfig?.maxStamps || 10}
            currentStamps={0}
            cardStyle={loyaltyCardConfig}
            onStampCollected={() => {}}
            onReset={() => {}}
          />
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: loyaltyCardConfig?.textColor || "#6F4E37" }}>
              Your Name
            </label>
            <Input
              id="name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full text-white"
            style={{ 
              backgroundColor: loyaltyCardConfig?.stampActiveColor || "#F97316",
              borderColor: loyaltyCardConfig?.stampActiveColor || "#F97316"
            }}
          >
            Join Loyalty Program
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default JoinForm;
