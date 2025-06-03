import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Business } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import WelcomeStampsMessage from "@/components/WelcomeStampsMessage";

interface JoinFormProps {
  business: Business;
  onJoinSuccess: (member: any) => void;
}

const JoinForm: React.FC<JoinFormProps> = ({ business, onJoinSuccess }) => {
  const [customerName, setCustomerName] = useState('');
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
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to join this loyalty program.",
          variant: "destructive"
        });
        return;
      }

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('business_members')
        .select('id')
        .eq('business_id', business.id)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        toast({
          title: "Already a Member",
          description: "You're already part of this loyalty program!",
          variant: "destructive"
        });
        return;
      }

      // Create new member
      const memberData = {
        business_id: business.id,
        user_id: user.id,
        customer_name: customerName.trim(),
        referred_by_code: referralCode.trim() || null,
        is_anonymous: false
      };

      const { data: newMember, error } = await supabase
        .from('business_members')
        .insert(memberData)
        .select()
        .single();

      if (error) throw error;

      // Check if welcome stamps were awarded
      if (business.welcome_stamps_enabled && business.welcome_stamps > 0) {
        setWelcomeStampsAwarded(business.welcome_stamps);
        setShowWelcomeMessage(true);
      }

      toast({
        title: "Welcome!",
        description: `You've successfully joined ${business.name}'s loyalty program!`
      });

      onJoinSuccess(newMember);
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
          <CardTitle>Join {business?.name}'s Loyalty Program</CardTitle>
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
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default JoinForm;
