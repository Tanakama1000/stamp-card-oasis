import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  user_id?: string;
  customer_name?: string;
  email?: string;
  stamps: number;
  rewards: number;
}

interface CustomerListProps {
  businessId: string;
}

const CustomerList = ({ businessId }: CustomerListProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!businessId) return;
    
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('business_members')
          .select('id, user_id, customer_name, stamps')
          .eq('business_id', businessId);
        
        if (error) throw error;
        
        const customersWithRewards = data.map(customer => {
          return {
            ...customer,
            rewards: Math.floor((customer.stamps || 0) / 10)
          };
        });
        
        setCustomers(customersWithRewards);
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast({
          title: "Error",
          description: "Failed to load customers. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCustomers();
  }, [businessId, toast]);

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase();
    const customerName = customer.customer_name?.toLowerCase() || '';
    return customerName.includes(searchLower);
  });

  return (
    <Card className="p-6 bg-white card-shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-coffee-dark">Customer Database</h3>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-light" size={18} />
        <Input
          className="pl-10 border-coffee-light"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-coffee-light">
              <th className="text-left p-3 text-coffee-dark">Name</th>
              <th className="text-center p-3 text-coffee-dark">Stamps</th>
              <th className="text-center p-3 text-coffee-dark">Rewards</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="p-4 text-center">
                  <div className="flex justify-center items-center space-x-2">
                    <div className="h-4 w-4 bg-coffee-light/20 rounded-full animate-pulse"></div>
                    <div className="h-4 w-4 bg-coffee-light/30 rounded-full animate-pulse"></div>
                    <div className="h-4 w-4 bg-coffee-light/40 rounded-full animate-pulse"></div>
                  </div>
                </td>
              </tr>
            ) : filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-cream hover:bg-cream/20 transition-colors">
                  <td className="p-3 font-medium">{customer.customer_name || 'Anonymous Customer'}</td>
                  <td className="p-3 text-center">
                    <span className="px-3 py-1 bg-orange/10 text-orange-light rounded-full">
                      {customer.stamps || 0}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-3 py-1 bg-coffee-medium/10 text-coffee-medium rounded-full">
                      {customer.rewards}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="p-4 text-center text-coffee-light">
                  {searchTerm ? "No customers found matching your search." : "No customers have joined your loyalty program yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {customers.length > 5 && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" className="text-coffee-medium">
            View All Customers
          </Button>
        </div>
      )}
    </Card>
  );
};

export default CustomerList;
