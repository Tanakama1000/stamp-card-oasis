
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ReferralInputProps {
  businessId: string;
  referralCode: string;
  setReferralCode: (code: string) => void;
  themeColor?: string;
}

const ReferralInput: React.FC<ReferralInputProps> = ({
  businessId,
  referralCode,
  setReferralCode,
  themeColor = "#0EA5E9"
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'valid' | 'invalid' | null>(null);

  const validateReferralCode = async (code: string) => {
    if (!code.trim()) {
      setValidationStatus(null);
      return;
    }

    setIsValidating(true);
    
    try {
      const { data, error } = await supabase
        .from('business_members')
        .select('id, customer_name')
        .eq('referral_code', code.toUpperCase())
        .eq('business_id', businessId)
        .maybeSingle();
        
      if (error) {
        console.error('Error validating referral code:', error);
        setValidationStatus('invalid');
      } else if (data) {
        setValidationStatus('valid');
      } else {
        setValidationStatus('invalid');
      }
    } catch (error) {
      console.error('Exception validating referral code:', error);
      setValidationStatus('invalid');
    }
    
    setIsValidating(false);
  };

  const handleCodeChange = (value: string) => {
    const upperCode = value.toUpperCase();
    setReferralCode(upperCode);
    
    // Debounce validation
    const timeoutId = setTimeout(() => {
      validateReferralCode(upperCode);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="referral-code" className="flex items-center gap-2">
        <Gift size={16} style={{ color: themeColor }} />
        Referral Code (Optional)
      </Label>
      
      <div className="relative">
        <Input
          id="referral-code"
          type="text"
          placeholder="Enter referral code"
          value={referralCode}
          onChange={(e) => handleCodeChange(e.target.value)}
          className="pr-10 uppercase"
          style={{ borderColor: validationStatus === 'valid' ? '#10B981' : validationStatus === 'invalid' ? '#EF4444' : undefined }}
        />
        
        {isValidating && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
        
        {!isValidating && validationStatus === 'valid' && (
          <Check size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
        )}
        
        {!isValidating && validationStatus === 'invalid' && referralCode.trim() && (
          <X size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" />
        )}
      </div>
      
      {validationStatus === 'valid' && (
        <p className="text-sm text-green-600">✓ Valid referral code</p>
      )}
      
      {validationStatus === 'invalid' && referralCode.trim() && (
        <p className="text-sm text-red-600">✗ Invalid referral code</p>
      )}
      
      <p className="text-xs text-gray-500">
        Have a friend who's already a member? Enter their referral code to give them bonus stamps when you make your first purchase!
      </p>
    </div>
  );
};

export default ReferralInput;
