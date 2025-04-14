
import { Card } from "@/components/ui/card";
import { Users, Award, Coffee, TrendingUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

interface BusinessStatsProps {
  customerCount: number;
  rewardsRedeemed: number;
  totalStamps: number;
  conversionRate: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, change, trend }) => {
  return (
    <Card className="p-4 flex flex-col bg-white card-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="font-medium text-coffee-medium text-sm">{title}</div>
        <div className="p-2 bg-cream rounded-md text-coffee-dark">{icon}</div>
      </div>
      <div className="text-2xl font-bold text-coffee-dark mb-1">{value}</div>
      {change && (
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
    </Card>
  );
};

const BusinessStats: React.FC<BusinessStatsProps> = ({
  customerCount,
  rewardsRedeemed,
  totalStamps,
  conversionRate,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Customers"
        value={customerCount}
        icon={<Users size={20} />}
        change="+5% vs last week"
        trend="up"
      />
      <StatsCard
        title="Rewards Redeemed"
        value={rewardsRedeemed}
        icon={<Award size={20} />}
        change="+12% vs last week"
        trend="up"
      />
      <StatsCard
        title="Total Stamps"
        value={totalStamps}
        icon={<Coffee size={20} />}
        change="+8% vs last week"
        trend="up"
      />
      <StatsCard
        title="Conversion Rate"
        value={conversionRate}
        icon={<TrendingUp size={20} />}
        change="Same as last week"
        trend="neutral"
      />
    </div>
  );
};

export default BusinessStats;
