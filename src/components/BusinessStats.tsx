
import { Card } from "@/components/ui/card";
import { Coffee } from "lucide-react";
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

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, description, isLoading }) => {
  return (
    <Card className="p-6 flex flex-col bg-white shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <div className="font-medium text-coffee-medium text-sm">{title}</div>
        <div className="p-2 bg-blue-50 rounded-md text-coffee-dark">{icon}</div>
      </div>
      <div className="text-3xl font-bold text-coffee-dark mb-2">
        {isLoading ? (
          <div className="h-8 bg-gray-200 animate-pulse rounded w-16"></div>
        ) : (
          value
        )}
      </div>
      {description && !isLoading && (
        <div className="text-sm text-gray-500">
          {description}
        </div>
      )}
      {isLoading && description && (
        <div className="h-4 bg-gray-200 animate-pulse rounded w-24 mt-1"></div>
      )}
    </Card>
  );
};

const BusinessStats: React.FC<BusinessStatsProps> = ({ businessId }) => {
  const [totalStamps, setTotalStamps] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const saveStatsToStorage = (stamps: number) => {
    if (!businessId) return;
    
    const allStats = JSON.parse(localStorage.getItem('businessStats') || '{}');
    allStats[businessId] = { totalStamps: stamps, lastUpdated: new Date().toISOString() };
    localStorage.setItem('businessStats', JSON.stringify(allStats));
  };
  
  const loadStatsFromStorage = () => {
    if (!businessId) return null;
    
    const allStats = JSON.parse(localStorage.getItem('businessStats') || '{}');
    return allStats[businessId]?.totalStamps;
  };
  
  useEffect(() => {
    if (!businessId) return;
    
    const fetchStats = async () => {
      setIsLoading(true);
      
      const savedStamps = loadStatsFromStorage();
      if (savedStamps !== null && savedStamps !== undefined) {
        setTotalStamps(savedStamps);
        setIsLoading(false);
      }
      
      await updateStampsFromSupabase();
    };
    
    const updateStampsFromSupabase = async () => {
      try {
        const { data: membersData, error: membersError } = await supabase
          .from('business_members')
          .select('stamps')
          .eq('business_id', businessId);
        
        if (membersError) throw membersError;
        
        if (membersData) {
          const currentStamps = membersData.reduce((sum, member) => {
            const memberStamps = member.stamps !== null && member.stamps !== undefined ? member.stamps : 0;
            return sum + memberStamps;
          }, 0);
          
          setTotalStamps(currentStamps);
          saveStatsToStorage(currentStamps);
        }
      } catch (error) {
        console.error("Error fetching business stamps:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
    
    const intervalId = setInterval(() => {
      updateStampsFromSupabase();
    }, 5 * 60 * 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [businessId]);
  
  return (
    <div className="mb-8">
      <StatsCard
        title="Customer Stamps"
        value={totalStamps}
        icon={<Coffee size={20} />}
        description="Total stamps collected by customers"
        isLoading={isLoading}
      />
    </div>
  );
};

export default BusinessStats;
