
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import Layout from "@/components/Layout";

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'admin_password')
        .single();

      if (error) throw error;

      if (data.setting_value === password) {
        sessionStorage.setItem('is_admin', 'true');
        navigate('/admin/dashboard');
        toast.success('Successfully logged in as admin');
      } else {
        toast.error('Invalid password');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to verify password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-md p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center">Admin Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Admin Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Login'}
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminLogin;
