
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";

// Sample customer data
const initialCustomers = [
  { id: 1, name: "John Doe", email: "john@example.com", stamps: 7, rewards: 1 },
  { id: 2, name: "Jane Smith", email: "jane@example.com", stamps: 3, rewards: 0 },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", stamps: 9, rewards: 2 },
  { id: 4, name: "Alice Brown", email: "alice@example.com", stamps: 5, rewards: 0 },
  { id: 5, name: "Charlie Davis", email: "charlie@example.com", stamps: 8, rewards: 1 },
];

interface Customer {
  id: number;
  name: string;
  email: string;
  stamps: number;
  rewards: number;
}

const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredCustomers = customers.filter((customer) => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="p-6 bg-white card-shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-coffee-dark">Customer Database</h3>
        <Button className="bg-orange hover:bg-orange-light flex items-center gap-1">
          <UserPlus size={16} />
          <span>Add New</span>
        </Button>
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
              <th className="text-left p-3 text-coffee-dark">Email</th>
              <th className="text-center p-3 text-coffee-dark">Stamps</th>
              <th className="text-center p-3 text-coffee-dark">Rewards</th>
              <th className="text-right p-3 text-coffee-dark">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-cream hover:bg-cream/20 transition-colors">
                  <td className="p-3 font-medium">{customer.name}</td>
                  <td className="p-3 text-coffee-light">{customer.email}</td>
                  <td className="p-3 text-center">
                    <span className="px-3 py-1 bg-orange/10 text-orange-light rounded-full">
                      {customer.stamps}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-3 py-1 bg-coffee-medium/10 text-coffee-medium rounded-full">
                      {customer.rewards}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="outline" size="sm">View</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-coffee-light">
                  No customers found matching your search.
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
