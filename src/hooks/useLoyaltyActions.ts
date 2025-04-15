
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LoyaltyActionsProps {
  businessData: any;
  userId: string | null;
  customerName: string;
  setJoined: (joined: boolean) => void;
  setCustomer: (customer: any) => void;
  setStamps: (stamps: number) => void;
}

export const useLoyaltyActions = ({
  businessData,
  userId,
  customerName,
  setJoined,
  setCustomer,
  setStamps
}: LoyaltyActionsProps) => {
  const { toast } = useToast();
  const [scannerOpen, setScannerOpen] = useState<boolean>(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to join.",
        variant: "destructive"
      });
      return;
    }

    if (businessData) {
      try {
        let customerId = userId;
        
        if (!customerId) {
          customerId = `anon_${Date.now()}`;
        }
        
        if (businessData.id) {
          const { error } = await supabase
            .from('business_members')
            .upsert({
              business_id: businessData.id,
              user_id: customerId,
              stamps: 0,
            });
            
          if (error) {
            console.error("Error joining business:", error);
            toast({
              title: "Error",
              description: "Could not join the loyalty program. Please try again.",
              variant: "destructive"
            });
            return;
          }
        }
        
        try {
          const newCustomer = {
            id: customerId,
            name: customerName,
            businessSlug: businessData.slug,
            businessId: businessData.id,
            joinedAt: new Date().toISOString(),
            stamps: 0
          };
          
          const savedCustomers = localStorage.getItem('customers') || '[]';
          const customers = JSON.parse(savedCustomers);
          customers.push(newCustomer);
          localStorage.setItem('customers', JSON.stringify(customers));
          
          setCustomer(newCustomer);
        } catch (e) {
          console.error("Error saving to localStorage:", e);
        }
        
        toast({
          title: "Welcome!",
          description: `You've successfully joined ${businessData.name}'s loyalty program!`,
        });
        
        setJoined(true);
      } catch (e) {
        console.error("Error joining:", e);
        toast({
          title: "Error",
          description: "Could not complete your request. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleCollectStamp = () => {
    setScannerOpen(true);
  };

  const handleSuccessfulScan = (businessId: string, timestamp: number, stampCount: number = 1) => {
    setScannerOpen(false);
    
    if (businessData && businessData.id && businessId !== businessData.id) {
      toast({
        title: "Wrong Business QR Code",
        description: "The QR code you scanned is for a different business.",
        variant: "destructive"
      });
      return;
    }
    
    const loyaltyCardConfig = businessData?.loyaltyCardConfig;
    const currentStamps = Math.min((businessData?.stamps || 0) + stampCount, loyaltyCardConfig?.maxStamps || 10);
    setStamps(currentStamps);
    
    setCustomer((prev: any) => ({
      ...prev,
      stamps: currentStamps
    }));
    
    toast({
      title: "Stamp Collected!",
      description: `You've collected ${stampCount} stamp${stampCount > 1 ? 's' : ''}.`,
    });
    
    if (businessData?.id && (userId || businessData?.customer?.id)) {
      const memberId = userId || businessData?.customer?.id;
      
      supabase
        .from('business_members')
        .upsert({
          business_id: businessData.id,
          user_id: memberId,
          stamps: currentStamps
        })
        .then(({ error }) => {
          if (error) {
            console.error("Error updating stamps:", error);
          }
        });
    }
  };

  return {
    scannerOpen,
    setScannerOpen,
    handleJoin,
    handleCollectStamp,
    handleSuccessfulScan
  };
};
