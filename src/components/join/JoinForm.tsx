import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Business } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

interface JoinFormProps {
  businessData: Business;
  onJoinSuccess: (memberData: any) => void;
}

const JoinForm: React.FC<JoinFormProps> = ({ businessData, onJoinSuccess }) => {
  const [customerName, setCustomerName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Check for referral code in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
    }
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to join the loyalty program.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('business_members')
        .insert({
          business_id: businessData.id,
          customer_name: customerName.trim(),
          referred_by_code: referralCode.trim() || null,
          is_anonymous: true
        })
        .select()
        .single();

      if (error) throw error;

      if (referralCode) {
        toast({
          title: "Welcome!",
          description: `You've joined using a referral code! You'll get bonus stamps when you collect your first stamp.`,
        });
      } else {
        toast({
          title: "Welcome!",
          description: `You've successfully joined ${businessData.name}'s loyalty program.`,
        });
      }

      onJoinSuccess(data);
    } catch (error) {
      console.error('Error joining business:', error);
      toast({
        title: "Error",
        description: "Failed to join the loyalty program. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-coffee-dark mb-2">
            Join {businessData.name}
          </h2>
          <p className="text-coffee-light">
            Start collecting stamps and earning rewards!
          </p>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-coffee-dark mb-2">
              Your Name
            </label>
            <input
              id="customerName"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="referralCode" className="block text-sm font-medium text-coffee-dark mb-2">
              Referral Code (Optional)
            </label>
            <input
              id="referralCode"
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              placeholder="Enter referral code"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {referralCode && (
              <p className="text-xs text-purple-600 mt-1">
                🎉 You'll get bonus stamps when you collect your first stamp!
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange text-white py-2 px-4 rounded-md hover:bg-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Joining..." : "Join Loyalty Program"}
          </button>
        </form>
      </div>
    </Card>
  );
};

export default JoinForm;
