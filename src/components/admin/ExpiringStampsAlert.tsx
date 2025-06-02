
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Bell, User, Hash, Calendar } from "lucide-react";

interface ExpiringStamp {
  business_member_id: string;
  customer_name: string;
  stamps_expiring: number;
  expires_in_days: number;
}

interface ExpiringStampsAlertProps {
  businessId: string;
}

const ExpiringStampsAlert: React.FC<ExpiringStampsAlertProps> = ({ businessId }) => {
  const [expiringStamps, setExpiringStamps] = useState<ExpiringStamp[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchExpiringStamps();
  }, [businessId]);

  const fetchExpiringStamps = async () => {
    try {
      const { data, error } = await supabase.rpc('get_expiring_stamps', { days_ahead: 3 });

      if (error) throw error;
      
      // Filter for current business
      const businessExpiringStamps = (data || []).filter(
        (stamp: any) => stamp.business_id === businessId
      );
      
      setExpiringStamps(businessExpiringStamps);
    } catch (error) {
      console.error('Error fetching expiring stamps:', error);
      toast({
        title: "Error",
        description: "Failed to load expiring stamps.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading expiring stamps...</div>;
  }

  if (expiringStamps.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 border-yellow-200 bg-yellow-50">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-yellow-800">Stamps Expiring Soon</h3>
          <Badge variant="outline" className="text-yellow-700 border-yellow-300">
            {expiringStamps.length} customer{expiringStamps.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        <div className="space-y-3">
          {expiringStamps.map((stamp, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="font-medium">{stamp.customer_name || "Anonymous"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-600" />
                  <Badge variant="outline" className="text-yellow-700">
                    {stamp.stamps_expiring} stamp{stamp.stamps_expiring !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-yellow-600" />
                <span className="text-yellow-700 font-medium">
                  {stamp.expires_in_days} day{stamp.expires_in_days !== 1 ? 's' : ''} left
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchExpiringStamps}
            className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
          >
            <Bell className="h-4 w-4 mr-2" />
            Refresh Alerts
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ExpiringStampsAlert;
