
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import Layout from "@/components/Layout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

type Business = {
  id: string;
  name: string;
  is_active: boolean;
  slug: string;
};

const AdminDashboard: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('id, name, is_active, slug');

      if (error) throw error;
      
      setBusinesses(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      toast.error('Failed to load businesses');
      setLoading(false);
    }
  };

  const toggleBusinessStatus = async (businessId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ is_active: !currentStatus })
        .eq('id', businessId);

      if (error) throw error;

      // Update local state to reflect the change
      setBusinesses(businesses.map(business => 
        business.id === businessId 
          ? { ...business, is_active: !currentStatus } 
          : business
      ));

      toast.success(`Business ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error updating business status:', error);
      toast.error('Failed to update business status');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <div>Loading businesses...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Business Management</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {businesses.map((business) => (
              <TableRow key={business.id}>
                <TableCell>{business.name}</TableCell>
                <TableCell>{business.slug}</TableCell>
                <TableCell>
                  {business.is_active ? 'Active' : 'Inactive'}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={business.is_active}
                    onCheckedChange={() => toggleBusinessStatus(business.id, business.is_active)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {businesses.length === 0 && (
          <div className="text-center text-gray-500 mt-4">
            No businesses found
          </div>
        )}
      </Card>
    </Layout>
  );
};

export default AdminDashboard;
