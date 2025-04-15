
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ActivityScan {
  id: string;
  customer_name: string | null;
  stamps: number;
  timestamp: string;
}

interface RecentActivityProps {
  businessId: string;
}

const RecentActivity = ({ businessId }: RecentActivityProps) => {
  const [recentScans, setRecentScans] = useState<ActivityScan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!businessId) return;
    
    const fetchRecentActivity = async () => {
      setIsLoading(true);
      try {
        // For now, we're using business_members as there's no dedicated scans table yet
        // In a real implementation, you'd have a scans or activity table
        const { data, error } = await supabase
          .from('business_members')
          .select('id, customer_name, stamps, joined_at')
          .eq('business_id', businessId)
          .order('joined_at', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        
        const formattedData = data.map(item => ({
          id: item.id,
          customer_name: item.customer_name || 'Anonymous Customer',
          stamps: item.stamps || 0,
          timestamp: item.joined_at
        }));
        
        setRecentScans(formattedData);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
        toast({
          title: "Error",
          description: "Failed to load recent activity. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentActivity();
  }, [businessId, toast]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Card className="p-6 bg-white card-shadow">
      <h3 className="text-xl font-semibold text-coffee-dark mb-4">Recent Stamp Collections</h3>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Stamps</TableHead>
              <TableHead>Date & Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6">
                  <div className="flex justify-center items-center space-x-2">
                    <div className="h-4 w-4 bg-coffee-light/20 rounded-full animate-pulse"></div>
                    <div className="h-4 w-4 bg-coffee-light/30 rounded-full animate-pulse"></div>
                    <div className="h-4 w-4 bg-coffee-light/40 rounded-full animate-pulse"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : recentScans.length > 0 ? (
              recentScans.map((scan) => (
                <TableRow key={scan.id} className="border-b border-cream">
                  <TableCell>{scan.customer_name}</TableCell>
                  <TableCell>+{scan.stamps}</TableCell>
                  <TableCell className="text-coffee-light">{formatTimestamp(scan.timestamp)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-coffee-light">
                  No recent activity found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default RecentActivity;
