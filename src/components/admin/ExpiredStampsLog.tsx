
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Calendar, User, Hash } from "lucide-react";
import { format } from "date-fns";

interface ExpiredStamp {
  id: string;
  customer_name: string;
  stamps_expired: number;
  expired_at: string;
}

interface ExpiredStampsLogProps {
  businessId: string;
}

const ExpiredStampsLog: React.FC<ExpiredStampsLogProps> = ({ businessId }) => {
  const [expiredStamps, setExpiredStamps] = useState<ExpiredStamp[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchExpiredStamps();
  }, [businessId]);

  const fetchExpiredStamps = async () => {
    try {
      const { data, error } = await supabase
        .from('expired_stamps_log')
        .select('*')
        .eq('business_id', businessId)
        .order('expired_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setExpiredStamps(data || []);
    } catch (error) {
      console.error('Error fetching expired stamps log:', error);
      toast({
        title: "Error",
        description: "Failed to load expired stamps log.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading expired stamps log...</div>;
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-coffee-dark">Expired Stamps Log</h3>
        </div>

        {expiredStamps.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No expired stamps yet</p>
            <p className="text-sm">Stamps will appear here when they expire</p>
          </div>
        ) : (
          <div className="space-y-3">
            {expiredStamps.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 border rounded-lg bg-orange-50 border-orange-200"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="font-medium">{log.customer_name || "Anonymous"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-600" />
                    <Badge variant="destructive">
                      {log.stamps_expired} stamp{log.stamps_expired !== 1 ? 's' : ''} expired
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(log.expired_at), 'MMM dd, yyyy HH:mm')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ExpiredStampsLog;
