
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

    if (businessData && userId) {
      try {
        let isAnonymous = userId.startsWith('anon_');
        
        // For authenticated users with Supabase accounts, save to database
        if (!isAnonymous && businessData.id) {
          const { data: existingMember, error: checkError } = await supabase
            .from('business_members')
            .select('*')
            .eq('business_id', businessData.id)
            .eq('user_id', userId)
            .maybeSingle();
            
          if (checkError) {
            console.error("Error checking membership:", checkError);
          }
          
          if (existingMember) {
            // Update existing membership
            const { error: updateError } = await supabase
              .from('business_members')
              .update({ stamps: existingMember.stamps || 0 })
              .eq('id', existingMember.id);
                
            if (updateError) {
              console.error("Error updating membership:", updateError);
            }
            
            // Use the existing member data
            setStamps(existingMember.stamps || 0);
          } else {
            // Create new membership
            const { data: newMember, error: insertError } = await supabase
              .from('business_members')
              .insert({
                business_id: businessData.id,
                user_id: userId,
                stamps: 0,
              })
              .select()
              .single();
                
            if (insertError) {
              console.error("Error joining business:", insertError);
              toast({
                title: "Error",
                description: "Could not join the loyalty program. Please try again.",
                variant: "destructive"
              });
              return;
            }
            
            if (newMember) {
              setStamps(newMember.stamps || 0);
            }
          }
        }
        
        // Always save to localStorage for both authenticated and anonymous users
        try {
          const newCustomer = {
            id: userId,
            name: customerName,
            businessSlug: businessData.slug,
            businessId: businessData.id,
            joinedAt: new Date().toISOString(),
            stamps: 0
          };
          
          const savedCustomers = localStorage.getItem('customers') || '[]';
          let customers = JSON.parse(savedCustomers);
          
          // Check if this user already exists for this business
          const existingCustomerIndex = customers.findIndex((c: any) => 
            c.id === userId && c.businessSlug === businessData.slug
          );
          
          if (existingCustomerIndex >= 0) {
            // Update existing customer
            customers[existingCustomerIndex] = {
              ...customers[existingCustomerIndex],
              name: customerName
            };
          } else {
            // Add new customer
            customers.push(newCustomer);
          }
          
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

  const handleSuccessfulScan = async (businessId: string, timestamp: number, stampCount: number = 1) => {
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
    // Get current stamps from the customer via database or state
    let currentStamps = 0;
    
    try {
      // First get the current stamps state
      if (!userId.startsWith('anon_') && businessData?.id) {
        const { data: existingMember } = await supabase
          .from('business_members')
          .select('stamps')
          .eq('business_id', businessData.id)
          .eq('user_id', userId)
          .maybeSingle();
          
        if (existingMember) {
          currentStamps = existingMember.stamps || 0;
        }
      } else {
        // For anonymous users, try to get stamps from localStorage
        const savedCustomers = localStorage.getItem('customers') || '[]';
        let customers = JSON.parse(savedCustomers);
        const customerRecord = customers.find((c: any) => 
          c.id === userId && c.businessSlug === businessData.slug
        );
        if (customerRecord) {
          currentStamps = customerRecord.stamps || 0;
        }
      }
      
      // Now calculate new stamp count and update state
      const newStampCount = Math.min((currentStamps + stampCount), loyaltyCardConfig?.maxStamps || 10);
      setStamps(newStampCount);
      
      setCustomer((prev: any) => ({
        ...prev,
        stamps: newStampCount
      }));
      
      toast({
        title: "Stamp Collected!",
        description: `You've collected ${stampCount} stamp${stampCount > 1 ? 's' : ''}.`,
      });
      
      // Update both Supabase (for authenticated users) and localStorage
      if (businessData?.id && userId) {
        // Update localStorage first (for all users)
        try {
          const savedCustomers = localStorage.getItem('customers') || '[]';
          let customers = JSON.parse(savedCustomers);
          
          const customerIndex = customers.findIndex((c: any) => 
            c.id === userId && c.businessSlug === businessData.slug
          );
          
          if (customerIndex >= 0) {
            customers[customerIndex].stamps = newStampCount;
            localStorage.setItem('customers', JSON.stringify(customers));
          }
        } catch (e) {
          console.error("Error updating localStorage:", e);
        }
        
        // Update Supabase only for authenticated non-anon users
        if (!userId.startsWith('anon_')) {
          const { data: existingMember, error: checkError } = await supabase
            .from('business_members')
            .select('*')
            .eq('business_id', businessData.id)
            .eq('user_id', userId)
            .maybeSingle();
            
          if (checkError) {
            console.error("Error checking membership:", checkError);
          }
          
          if (existingMember) {
            // Update existing membership
            await supabase
              .from('business_members')
              .update({ stamps: newStampCount })
              .eq('id', existingMember.id);
          } else {
            // Create membership if it doesn't exist
            await supabase
              .from('business_members')
              .insert({
                business_id: businessData.id,
                user_id: userId,
                stamps: newStampCount
              });
          }
        }
      }
    } catch (error) {
      console.error("Error in handleSuccessfulScan:", error);
      toast({
        title: "Error",
        description: "Failed to collect stamp. Please try again.",
        variant: "destructive"
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
