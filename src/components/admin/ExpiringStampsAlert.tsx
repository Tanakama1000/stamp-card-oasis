
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, RefreshCw, Clock } from "lucide-react";

interface ExpiringStampsAlertProps {
  businessId: string;
}

interface ExpiringStamp {
  customer_name: string;
  stamps_expiring: number;
  expires_in_days: number;
}

const ExpiringStampsAlert: React.FC<ExpiringStampsAlertProps> = ({ businessId }) => {
  const [expiringStamps, setExpiringStamps] = useState<ExpiringStamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchExpiringStamps();
    
    // Set up an interval to refresh data every 5 minutes
    const interval = setInterval(fetchExpiringStamps, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [businessId]);

  const fetchExpiringStamps = async () => {
    if (!refreshing) setLoading(true);
    
    try {
      const { data, error } = await supabase.rpc('get_expiring_stamps', {
        days_ahead: 3
      });

      if (error) {
        console.error('Error fetching expiring stamps:', error);
        return;
      }

      // Filter for this specific business
      const businessStamps = data?.filter(stamp => stamp.business_id === businessId) || [];
      setExpiringStamps(businessStamps);
    } catch (error) {
      console.error('Error fetching expiring stamps:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchExpiringStamps();
  };

  if (loading && !refreshing) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 animate-spin" />
          <span className="text-sm">Checking for expiring stamps...</span>
        </div>
      </Card>
    );
  }

  if (expiringStamps.length === 0) {
    return null;
  }

  const totalExpiringStamps = expiringStamps.reduce((sum, item) => sum + item.stamps_expiring, 0);

  return (
    <Card className="p-4 border-orange-200 bg-orange-50">
      <Alert>
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <strong className="text-orange-800">
                {totalExpiringStamps} stamps expiring soon
              </strong>
              <div className="mt-2 space-y-1">
                {expiringStamps.map((item, index) => (
                  <div key={index} className="text-sm text-orange-700">
                    <strong>{item.customer_name}</strong>: {item.stamps_expiring} stamps 
                    expire in {item.expires_in_days} day{item.expires_in_days !== 1 ? 's' : ''}
                  </div>
                ))}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="ml-4"
            >
              {refreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </Card>
  );
};

export default ExpiringStampsAlert;
