
import { Card } from "@/components/ui/card";
import { Users, Award, Coffee, TrendingUp, Stamp } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  isLoading?: boolean;
}

interface BusinessStatsProps {
  businessId: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  description,
  isLoading
}) => {
  return (
    <Card className="p-6 flex flex-col bg-white shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <div className="font-medium text-blue-500 text-sm">{title}</div>
        <div className="p-2 rounded-md text-blue-500 bg-blue">{icon}</div>
      </div>
      <div className="text-3xl font-bold text-coffee-dark mb-2">
        {isLoading ? <div className="h-8 bg-gray-200 animate-pulse rounded w-16"></div> : value}
      </div>
      {description && !isLoading && <div className="text-sm text-gray-500">
          {description}
        </div>}
      {isLoading && description && <div className="h-4 bg-gray-200 animate-pulse rounded w-24 mt-1"></div>}
    </Card>
  );
};

const BusinessStats: React.FC<BusinessStatsProps> = ({
  businessId
}) => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [rewardsRedeemed, setRewardsRedeemed] = useState(0);
  const [conversionRate, setConversionRate] = useState("0%");
  const [allCustomerStamps, setAllCustomerStamps] = useState(0); // Renamed to represent all stamps collected
  const [isLoading, setIsLoading] = useState(true);

  const saveStatsToStorage = (stats: any) => {
    if (!businessId) return;
    const allStats = JSON.parse(localStorage.getItem('businessStats') || '{}');
    allStats[businessId] = {
      ...stats,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('businessStats', JSON.stringify(allStats));
  };

  const loadStatsFromStorage = () => {
    if (!businessId) return null;
    const allStats = JSON.parse(localStorage.getItem('businessStats') || '{}');
    return allStats[businessId];
  };

  useEffect(() => {
    if (!businessId) return;

    const fetchStats = async () => {
      setIsLoading(true);
      const savedStats = loadStatsFromStorage();
      if (savedStats !== null && savedStats !== undefined) {
        setTotalCustomers(savedStats.totalCustomers || 0);
        setRewardsRedeemed(savedStats.rewardsRedeemed || 0);
        setConversionRate(savedStats.conversionRate || "0%");
        setAllCustomerStamps(savedStats.allCustomerStamps || 0); 
        setIsLoading(false);
      }
      await updateStatsFromSupabase();
    };

    const updateStatsFromSupabase = async () => {
      try {
        const {
          data: membersData,
          error: membersError
        } = await supabase.from('business_members').select('*').eq('business_id', businessId);
        
        if (membersError) throw membersError;
        
        if (membersData) {
          // Calculate total customers (permanent stat)
          const customerCount = membersData.length;
          
          // Calculate all stamps ever collected (total of current active + redeemed stamps)
          const totalStampCount = membersData.reduce((sum, member) => {
            // Current active stamps on cards
            const currentStamps = member.stamps !== null && 
                                member.stamps !== undefined ? 
                                member.stamps : 0;
            
            // Plus all stamps ever collected (includes redeemed stamps)
            const totalCollected = member.total_stamps_collected !== null && 
                                  member.total_stamps_collected !== undefined ? 
                                  member.total_stamps_collected : 0;
            
            // We need to make sure we're using the larger value between total_stamps_collected
            // and the sum of current stamps + (redeemed_rewards * maxStamps)
            // This ensures we never lose track of stamps due to data inconsistencies
            const redeemedRewards = member.redeemed_rewards || 0;
            const estimatedTotalFromRedeemed = currentStamps + (redeemedRewards * 10); // assuming 10 stamps per reward
            const bestTotalEstimate = Math.max(totalCollected, estimatedTotalFromRedeemed);
            
            return sum + bestTotalEstimate;
          }, 0);

          // Calculate total rewards redeemed (permanent stat)
          const totalRewardsRedeemed = membersData.reduce((sum, member) => {
            const redeemed = member.redeemed_rewards !== null && 
                            member.redeemed_rewards !== undefined ? 
                            member.redeemed_rewards : 0;
            return sum + redeemed;
          }, 0);

          // Calculate active customers (those with at least one stamp)
          const activeCustomers = membersData.filter(member => 
            member.stamps !== null && 
            member.stamps !== undefined && 
            member.stamps > 0
          ).length;

          // Calculate conversion rate
          let conversionRateValue = "0%";
          if (customerCount > 0) {
            const rate = Math.round(activeCustomers / customerCount * 100);
            conversionRateValue = `${rate}%`;
          }

          setTotalCustomers(customerCount);
          setAllCustomerStamps(totalStampCount); // Now using totalStampCount for all stamps collected
          setRewardsRedeemed(totalRewardsRedeemed);
          setConversionRate(conversionRateValue);

          saveStatsToStorage({
            totalCustomers: customerCount,
            allCustomerStamps: totalStampCount, // Save total stamps collected
            rewardsRedeemed: totalRewardsRedeemed,
            conversionRate: conversionRateValue
          });
          
          // Log for debugging
          console.log("BusinessStats - Total stamps calculated:", totalStampCount);
        }
      } catch (error) {
        console.error("Error fetching business stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    
    const intervalId = setInterval(() => {
      updateStatsFromSupabase();
    }, 5 * 60 * 1000); // Update every 5 minutes

    return () => {
      clearInterval(intervalId);
    };
  }, [businessId]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatsCard 
        title="Total Customers" 
        value={totalCustomers} 
        icon={<Users size={20} />} 
        description="Based on program joins" 
        isLoading={isLoading} 
      />
      
      <StatsCard 
        title="Rewards Redeemed" 
        value={rewardsRedeemed} 
        icon={<Award size={20} />} 
        description="Total rewards claimed" 
        isLoading={isLoading} 
      />

      <StatsCard 
        title="All Stamps" 
        value={allCustomerStamps} 
        icon={<Stamp size={20} />} 
        description="All stamps ever collected" 
        isLoading={isLoading} 
      />
      
      <StatsCard 
        title="Conversion Rate" 
        value={conversionRate} 
        icon={<TrendingUp size={20} />} 
        description="Active customers" 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default BusinessStats;
