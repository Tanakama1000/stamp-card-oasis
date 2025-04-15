
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
  
  useEffect(() => {
    if (!businessId) return;
    
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Get total customers
        const { count: customerCount, error: customerError } = await supabase
          .from('business_members')
          .select('id', { count: 'exact', head: true })
          .eq('business_id', businessId);
        
        if (customerError) throw customerError;
        
        // Get total stamps
        const { data: stampsData, error: stampsError } = await supabase
          .from('business_members')
          .select('stamps')
          .eq('business_id', businessId);
        
        if (stampsError) throw stampsError;
        
        // Calculate total stamps
        const totalStamps = stampsData.reduce((sum, member) => sum + (member.stamps || 0), 0);
        
        // Calculate estimated rewards redeemed (assume every 10 stamps is 1 reward)
        const maxStampsBeforeReward = 10;
        const estimatedRewardsRedeemed = Math.floor(totalStamps / maxStampsBeforeReward);
        
        // Calculate conversion rate (customers with at least 1 stamp / total customers)
        const activeCustomers = stampsData.filter(member => (member.stamps || 0) > 0).length;
        const totalCustomers = customerCount || 0;
        const conversionRate = totalCustomers ? Math.round((activeCustomers / totalCustomers) * 100) + "%" : "0%";
        
        setStats({
          customerCount: customerCount || 0,
          rewardsRedeemed: estimatedRewardsRedeemed,
          totalStamps,
          conversionRate,
        });
      } catch (error) {
        console.error("Error fetching business stats:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
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
        change={isLoading ? "" : "Estimated from stamps"}
        trend="neutral"
        isLoading={isLoading}
      />
      <StatsCard
        title="Total Stamps"
        value={stats.totalStamps}
        icon={<Coffee size={20} />}
        change={isLoading ? "" : "Total collected"}
        trend="neutral"
        isLoading={isLoading}
      />
      <StatsCard
        title="Conversion Rate"
        value={stats.conversionRate}
        icon={<TrendingUp size={20} />}
        change={isLoading ? "" : "Customers with stamps"}
        trend="neutral"
        isLoading={isLoading}
      />
    </div>
  );
};

export default BusinessStats;
