
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Users, Award, Target } from "lucide-react";

interface ReferralAnalyticsProps {
  businessId: string;
}

interface ReferralStats {
  totalReferrals: number;
  totalBonusStampsAwarded: number;
  topReferrers: Array<{
    customer_name: string;
    referral_code: string;
    referralCount: number;
  }>;
  recentReferrals: Array<{
    referrer_name: string;
    referee_name: string;
    created_at: string;
  }>;
}

const ReferralAnalytics: React.FC<ReferralAnalyticsProps> = ({ businessId }) => {
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    totalBonusStampsAwarded: 0,
    topReferrers: [],
    recentReferrals: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferralStats();
  }, [businessId]);

  const fetchReferralStats = async () => {
    try {
      // Get total referrals and calculate bonus stamps
      const { data: referralData, error: referralError } = await supabase
        .from('business_members')
        .select('*')
        .eq('business_id', businessId)
        .not('referred_by_code', 'is', null)
        .eq('referral_bonus_awarded', true);

      if (referralError) throw referralError;

      // Get business settings for bonus calculation
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('referral_bonus_points, referral_referee_bonus_points')
        .eq('id', businessId)
        .single();

      if (businessError) throw businessError;

      const totalReferrals = referralData?.length || 0;
      const bonusPerReferral = (businessData.referral_bonus_points || 1) + (businessData.referral_referee_bonus_points || 3);
      const totalBonusStampsAwarded = totalReferrals * bonusPerReferral;

      // Get top referrers
      const { data: topReferrersData, error: topReferrersError } = await supabase
        .from('business_members')
        .select(`
          customer_name,
          referral_code,
          referral_count:business_members!referred_by_code(count)
        `)
        .eq('business_id', businessId)
        .not('referral_code', 'is', null)
        .order('referral_count', { ascending: false })
        .limit(5);

      // Note: The above query might not work as expected due to Supabase limitations
      // Let's use a simpler approach
      const { data: allMembers, error: allMembersError } = await supabase
        .from('business_members')
        .select('customer_name, referral_code, referred_by_code')
        .eq('business_id', businessId);

      if (allMembersError) throw allMembersError;

      // Calculate referral counts manually
      const referralCounts = new Map();
      allMembers?.forEach(member => {
        if (member.referred_by_code) {
          const referrer = allMembers.find(m => m.referral_code === member.referred_by_code);
          if (referrer) {
            const count = referralCounts.get(referrer.referral_code) || 0;
            referralCounts.set(referrer.referral_code, count + 1);
          }
        }
      });

      const topReferrers = Array.from(referralCounts.entries())
        .map(([code, count]) => {
          const referrer = allMembers?.find(m => m.referral_code === code);
          return {
            customer_name: referrer?.customer_name || 'Unknown',
            referral_code: code,
            referralCount: count as number
          };
        })
        .sort((a, b) => b.referralCount - a.referralCount)
        .slice(0, 5);

      setStats({
        totalReferrals,
        totalBonusStampsAwarded,
        topReferrers,
        recentReferrals: [] // We'll keep this simple for now
      });

    } catch (error) {
      console.error('Error fetching referral stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading referral analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{stats.totalReferrals}</p>
              <p className="text-sm text-gray-600">Total Referrals</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{stats.totalBonusStampsAwarded}</p>
              <p className="text-sm text-gray-600">Bonus Stamps Awarded</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">{stats.topReferrers.length}</p>
              <p className="text-sm text-gray-600">Active Referrers</p>
            </div>
          </div>
        </Card>
      </div>

      {stats.topReferrers.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold">Top Referrers</h3>
          </div>
          <div className="space-y-3">
            {stats.topReferrers.map((referrer, index) => (
              <div key={referrer.referral_code} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{referrer.customer_name}</p>
                    <p className="text-sm text-gray-600">Code: {referrer.referral_code}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-orange-600">{referrer.referralCount}</p>
                  <p className="text-xs text-gray-500">referrals</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ReferralAnalytics;
