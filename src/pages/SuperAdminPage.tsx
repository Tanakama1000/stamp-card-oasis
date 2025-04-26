
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Business {
  id: string;
  name: string;
  is_active: boolean;
  slug: string;
}

const SuperAdminPage = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setBusinesses(data || []);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      toast({
        title: "Error",
        description: "Failed to load businesses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (businessId: string, newStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ is_active: newStatus })
        .eq('id', businessId);

      if (error) throw error;

      setBusinesses(businesses.map(business => 
        business.id === businessId 
          ? { ...business, is_active: newStatus }
          : business
      ));

      toast({
        title: "Status Updated",
        description: `Business status has been ${newStatus ? 'activated' : 'deactivated'}`
      });
    } catch (error) {
      console.error('Error updating business status:', error);
      toast({
        title: "Error",
        description: "Failed to update business status",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Super Admin Dashboard</h1>
          
          {loading ? (
            <div className="text-center py-4">Loading businesses...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map((business) => (
                  <TableRow key={business.id}>
                    <TableCell className="font-medium">{business.name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        business.is_active 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {business.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={business.is_active}
                          onCheckedChange={(checked) => handleStatusChange(business.id, checked)}
                        />
                        <span className="text-sm text-muted-foreground">
                          {business.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default SuperAdminPage;
