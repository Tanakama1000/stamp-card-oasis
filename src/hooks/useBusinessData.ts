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
        const { data: businesses, error } = await supabase
          .from("businesses")
          .select("*")
          .eq("slug", businessSlug)
          .single();
        
        if (error) {
          console.error("Error fetching business:", error);
          const savedBusinesses = localStorage.getItem('businesses');
          let foundBusiness = null;
          
          if (savedBusinesses) {
            try {
              const businesses = JSON.parse(savedBusinesses);
              foundBusiness = businesses.find((b: any) => b.slug === businessSlug);
            } catch (e) {
              console.error("Error parsing businesses:", e);
            }
          }
          
          if (foundBusiness) {
            setBusinessName(foundBusiness.name);
            setBusinessData(foundBusiness);
            await fetchLoyaltyCardConfig(foundBusiness.id);
          } else if (businessSlug === "coffee-oasis") {
            setBusinessName("Coffee Oasis");
            const defaultBusinessData = {
              name: "Coffee Oasis",
              slug: "coffee-oasis",
              id: "coffee-oasis-id"
            };
            setBusinessData(defaultBusinessData);
            await fetchLoyaltyCardConfig(defaultBusinessData.id);
          } else {
            setError("Business not found");
          }
        } else if (businesses) {
          setBusinessName(businesses.name);
          setBusinessData(businesses);
          await fetchLoyaltyCardConfig(businesses.id);
          
          if (userId) {
            const { data: membership } = await supabase
              .from("business_members")
              .select("*")
              .eq("business_id", businesses.id)
              .eq("user_id", userId)
              .single();
              
            if (membership) {
              setJoined(true);
              setCustomer({
                id: userId,
                name: "Member",
                stamps: membership.stamps || 0
              });
              setStamps(membership.stamps || 0);
            }
          }
        } else {
          setError("Business not found");
        }
        
        setLoading(false);
      } catch (e) {
        console.error("Error in fetchBusinessData:", e);
        setError("Failed to load business data");
        setLoading(false);
      }
    };
    
    fetchBusinessData();
  }, [businessSlug, userId]);

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
