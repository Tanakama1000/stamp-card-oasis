import { Card } from "@/components/ui/card";
import { Users, Award, Coffee, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  trend?: "up" | "down" | "neutral";
  isLoading?: boolean;
}

interface BusinessStatsProps {
  businessId: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, change, trend, isLoading }) => {
  return (
    <Card className="p-4 flex flex-col bg-white card-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="font-medium text-coffee-medium text-sm">{title}</div>
        <div className="p-2 bg-cream rounded-md text-coffee-dark">{icon}</div>
      </div>
      <div className="text-2xl font-bold text-coffee-dark mb-1">
        {isLoading ? (
          <div className="h-7 bg-gray-200 animate-pulse rounded w-16"></div>
        ) : (
          value
        )}
      </div>
      {change && !isLoading && (
        <div className={`text-xs flex items-center gap-1
          ${trend === "up" ? "text-green-600" : ""}
          ${trend === "down" ? "text-red-600" : ""}
          ${trend === "neutral" ? "text-gray-500" : ""}
        `}>
          {trend === "up" && <TrendingUp size={12} />}
          {trend === "down" && <TrendingUp size={12} className="rotate-180" />}
          {change}
        </div>
      )}
      {isLoading && change && (
        <div className="h-4 bg-gray-200 animate-pulse rounded w-24 mt-1"></div>
      )}
    </Card>
  );
};

const BusinessStats: React.FC<BusinessStatsProps> = ({ businessId }) => {
  const [stats, setStats] = useState({
    customerCount: 0,
    rewardsRedeemed: 0,
    totalStamps: 0,
    conversionRate: "0%",
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const saveStatsToStorage = (newStats: any) => {
    if (!businessId) return;
    
    const allStats = JSON.parse(localStorage.getItem('businessStats') || '{}');
    allStats[businessId] = newStats;
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
      if (savedStats) {
        setStats(savedStats);
        setIsLoading(false);
        
        await updateStatsFromSupabase();
        return;
      }
      
      await updateStatsFromSupabase();
    };
    
    const updateStatsFromSupabase = async () => {
      try {
        const { count: customerCount, error: customerError } = await supabase
          .from('business_members')
          .select('id', { count: 'exact', head: true })
          .eq('business_id', businessId);
        
        if (customerError) throw customerError;
        
        const { data: membersData, error: membersError } = await supabase
          .from('business_members')
          .select('stamps, redeemed_rewards')
          .eq('business_id', businessId);
        
        if (membersError) throw membersError;
        
        if (membersData) {
          const currentStamps = membersData.reduce((sum, member) => {
            const memberStamps = member.stamps !== null && member.stamps !== undefined ? member.stamps : 0;
            return sum + memberStamps;
          }, 0);
          
          const totalRedeemedRewards = membersData.reduce((sum, member) => {
            const redeemedRewards = member.redeemed_rewards !== null && member.redeemed_rewards !== undefined ? member.redeemed_rewards : 0;
            return sum + redeemedRewards;
          }, 0);
          
          const activeCustomers = membersData.filter(member => {
            const hasStamps = member.stamps !== null && member.stamps !== undefined && member.stamps > 0;
            const hasRewards = member.redeemed_rewards !== null && member.redeemed_rewards !== undefined && member.redeemed_rewards > 0;
            return hasStamps || hasRewards;
          }).length;
          
          const totalCustomers = customerCount || 0;
          const conversionRate = totalCustomers ? Math.round((activeCustomers / totalCustomers) * 100) + "%" : "0%";
          
          const newStats = {
            customerCount: customerCount || 0,
            rewardsRedeemed: totalRedeemedRewards,
            totalStamps: currentStamps,
            conversionRate,
            lastUpdated: new Date().toISOString()
          };
          
          setStats(newStats);
          saveStatsToStorage(newStats);
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
    }, 5 * 60 * 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [businessId]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Customers"
        value={stats.customerCount}
        icon={<Users size={20} />}
        change={isLoading ? "" : "Based on program joins"}
        trend="neutral"
        isLoading={isLoading}
      />
      <StatsCard
        title="Rewards Redeemed"
        value={stats.rewardsRedeemed}
        icon={<Award size={20} />}
        change={isLoading ? "" : "Total rewards claimed"}
        trend="neutral"
        isLoading={isLoading}
      />
      <StatsCard
        title="Total Stamps"
        value={stats.totalStamps}
        icon={<Coffee size={20} />}
        change={isLoading ? "" : "Current stamps collected"}
        trend="neutral"
        isLoading={isLoading}
      />
      <StatsCard
        title="Conversion Rate"
        value={stats.conversionRate}
        icon={<TrendingUp size={20} />}
        change={isLoading ? "" : "Active customers"}
        trend="neutral"
        isLoading={isLoading}
      />
    </div>
  );
};

export default BusinessStats;
