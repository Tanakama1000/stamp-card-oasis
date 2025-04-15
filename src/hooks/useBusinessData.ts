
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoyaltyCardConfig } from "@/components/loyalty/types/LoyaltyCardConfig";

interface BusinessData {
  id?: string;
  name: string;
  slug: string;
}

export const useBusinessData = (businessSlug: string | undefined, userId: string | null) => {
  const [businessName, setBusinessName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [loyaltyCardConfig, setLoyaltyCardConfig] = useState<LoyaltyCardConfig | null>(null);
  const [joined, setJoined] = useState<boolean>(false);
  const [customer, setCustomer] = useState<any>(null);
  const [stamps, setStamps] = useState<number>(0);
  const { toast } = useToast();

  const fetchLoyaltyCardConfig = async (businessId: string) => {
    try {
      const { data: configData, error } = await supabase
        .from("loyalty_card_configs")
        .select("config")
        .eq("business_id", businessId)
        .single();
        
      if (!error && configData) {
        setLoyaltyCardConfig(configData.config as LoyaltyCardConfig);
        return;
      }
      
      const savedCardConfig = localStorage.getItem(`loyaltyCardConfig_${businessId}`);
      if (savedCardConfig) {
        try {
          const parsedConfig = JSON.parse(savedCardConfig);
          setLoyaltyCardConfig(parsedConfig);
        } catch (e) {
          console.error("Error parsing card config:", e);
          setDefaultLoyaltyConfig(businessName);
        }
      } else {
        setDefaultLoyaltyConfig(businessName);
      }
    } catch (e) {
      console.error("Error fetching loyalty card config:", e);
      setDefaultLoyaltyConfig(businessName);
    }
  };

  const setDefaultLoyaltyConfig = (name: string) => {
    setLoyaltyCardConfig({
      businessName: name || "Business",
      cardTitle: "Loyalty Card",
      maxStamps: 10,
      stampIcon: "Coffee",
      cardBgColor: "#FFFFFF",
      textColor: "#6F4E37",
      businessNameColor: "#2563EB",
      cardTitleColor: "#2563EB",
      rewardTextColor: "#2563EB"
    });
  };

  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!businessSlug) {
        setError("No business slug provided");
        setLoading(false);
        return;
      }

      try {
        // First try to get business from Supabase
        const { data: businesses, error } = await supabase
          .from("businesses")
          .select("*")
          .eq("slug", businessSlug);
        
        // Changed from .single() to allow more flexible handling
        if (error || !businesses || businesses.length === 0) {
          console.log("Error or no businesses found in Supabase:", error);
          
          // Check localStorage for businesses
          const savedBusinesses = localStorage.getItem('businesses');
          let foundBusiness = null;
          
          if (savedBusinesses) {
            try {
              const parsedBusinesses = JSON.parse(savedBusinesses);
              foundBusiness = Array.isArray(parsedBusinesses) ? 
                parsedBusinesses.find((b: any) => b.slug === businessSlug) : null;
              
              console.log("Checking localStorage for business:", businessSlug, foundBusiness);
            } catch (e) {
              console.error("Error parsing businesses from localStorage:", e);
            }
          }
          
          // Use demo business for testing purposes
          if (!foundBusiness && businessSlug === "coffee-oasis") {
            console.log("Using demo business: Coffee Oasis");
            setBusinessName("Coffee Oasis");
            const defaultBusinessData = {
              name: "Coffee Oasis",
              slug: "coffee-oasis",
              id: "coffee-oasis-id"
            };
            setBusinessData(defaultBusinessData);
            await fetchLoyaltyCardConfig(defaultBusinessData.id);
            setLoading(false);
            return;
          } else if (foundBusiness) {
            console.log("Found business in localStorage:", foundBusiness);
            setBusinessName(foundBusiness.name);
            setBusinessData(foundBusiness);
            await fetchLoyaltyCardConfig(foundBusiness.id);
            setLoading(false);
            
            // Also check for customer data in localStorage
            if (userId) {
              const savedCustomers = localStorage.getItem('customers');
              if (savedCustomers) {
                try {
                  const customers = JSON.parse(savedCustomers);
                  const customerData = customers.find((c: any) => 
                    c.id === userId && c.businessSlug === businessSlug
                  );
                  
                  if (customerData) {
                    setJoined(true);
                    setCustomer({
                      id: userId,
                      name: customerData.name,
                      stamps: customerData.stamps || 0
                    });
                    setStamps(customerData.stamps || 0);
                  }
                } catch (e) {
                  console.error("Error parsing customers from localStorage:", e);
                }
              }
            }
            
            return;
          }
          
          setError("Business not found");
          toast({
            title: "Business Not Found",
            description: "The business you're looking for couldn't be found.",
            variant: "destructive"
          });
        } else if (businesses && businesses.length > 0) {
          const business = businesses[0];
          setBusinessName(business.name);
          setBusinessData(business);
          await fetchLoyaltyCardConfig(business.id);
          
          if (userId) {
            const { data: membership, error: membershipError } = await supabase
              .from("business_members")
              .select("*")
              .eq("business_id", business.id)
              .eq("user_id", userId);
              
            if (!membershipError && membership && membership.length > 0) {
              setJoined(true);
              setCustomer({
                id: userId,
                name: "Member",
                stamps: membership[0].stamps || 0
              });
              setStamps(membership[0].stamps || 0);
            }
          }
        }
        
        setLoading(false);
      } catch (e) {
        console.error("Error in fetchBusinessData:", e);
        setError("Failed to load business data");
        toast({
          title: "Error",
          description: "Failed to load business data. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };
    
    fetchBusinessData();
  }, [businessSlug, userId, toast]);

  return {
    businessName,
    businessData,
    loyaltyCardConfig,
    loading,
    error,
    joined,
    customer,
    stamps,
    setCustomer,
    setJoined,
    setStamps
  };
};
