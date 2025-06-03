
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import WelcomeStampsMessage from "@/components/WelcomeStampsMessage";

interface JoinFormProps {
  businessName: string;
  loyaltyCardConfig: any;
  customerName: string;
  setCustomerName: (name: string) => void;
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
  const [isLoading, setIsLoading] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [welcomeStampsAwarded, setWelcomeStampsAwarded] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const storedName = localStorage.getItem('customerName');
    if (storedName) {
      setCustomerName(storedName);
    }
  }, [setCustomerName]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onJoin(e);
    } catch (error) {
      console.error('Error joining business:', error);
      toast({
        title: "Error",
        description: "Failed to join loyalty program. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showWelcomeMessage && (
        <WelcomeStampsMessage
          stampsAwarded={welcomeStampsAwarded}
          onDismiss={() => setShowWelcomeMessage(false)}
        />
      )}
      
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Join {businessName}'s Loyalty Program</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <Label htmlFor="customerName">Your Name</Label>
              <Input
                type="text"
                id="customerName"
                placeholder="Enter your name"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  localStorage.setItem('customerName', e.target.value);
                }}
                required
              />
            </div>
            <div>
              <Label htmlFor="referralCode">Referral Code (Optional)</Label>
              <Input
                type="text"
                id="referralCode"
                placeholder="Enter referral code"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
              />
            </div>
            <Button disabled={isLoading} className="w-full">
              {isLoading ? 'Joining...' : 'Join Now'}
            </Button>
            
            <div className="text-center mt-4">
              <Button 
                type="button" 
                variant="link"
                onClick={() => {
                  setIsAuthMode(true);
                  setIsSignup(true);
                }}
              >
                Create an account for better experience
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default JoinForm;
