
import React from "react";
import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import LoyaltyCard from "@/components/LoyaltyCard";

interface JoinFormProps {
  businessName: string;
  customerName: string;
  setCustomerName: (name: string) => void;
  handleJoin: (e: React.FormEvent) => void;
  loyaltyCardConfig: any;
}

const JoinForm = ({ 
  businessName, 
  customerName, 
  setCustomerName, 
  handleJoin, 
  loyaltyCardConfig 
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
