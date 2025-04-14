
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Coffee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const JoinPage = () => {
  const { businessSlug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [businessName, setBusinessName] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, you'd fetch business details from an API using the slug
    // For now we'll simulate with localStorage and a timeout
    setTimeout(() => {
      // Demo logic for finding business by slug
      const savedBusinesses = localStorage.getItem('businesses');
      let foundBusiness = null;
      
      if (savedBusinesses) {
        try {
          const businesses = JSON.parse(savedBusinesses);
          foundBusiness = businesses.find((b: any) => b.slug === businessSlug);
        } catch (e) {
          console.error("Error parsing businesses:", e);
        }
      }
      
      if (foundBusiness) {
        setBusinessName(foundBusiness.name);
        setLoading(false);
      } else {
        // For demo purposes, we'll use a hardcoded fallback if the business isn't found
        if (businessSlug === "coffee-oasis") {
          setBusinessName("Coffee Oasis");
          setLoading(false);
        } else {
          setError("Business not found");
          setLoading(false);
        }
      }
    }, 1000);
  }, [businessSlug]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to join.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, you'd make an API call to join the business
    // For now, we'll simulate with localStorage
    
    const customerId = `cust_${Date.now()}`;
    const newCustomer = {
      id: customerId,
      name: customerName,
      businessSlug: businessSlug,
      joinedAt: new Date().toISOString(),
      stamps: 0
    };
    
    // Save to localStorage
    try {
      const savedCustomers = localStorage.getItem('customers') || '[]';
      const customers = JSON.parse(savedCustomers);
      customers.push(newCustomer);
      localStorage.setItem('customers', JSON.stringify(customers));
      
      // Show success message
      toast({
        title: "Welcome!",
        description: `You've successfully joined ${businessName}'s loyalty program!`,
      });
      
      // Redirect to home or customer view
      navigate("/");
    } catch (e) {
      console.error("Error saving customer:", e);
      toast({
        title: "Error",
        description: "Could not complete your request. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-coffee-dark" />
          <p className="mt-4 text-coffee-light">Loading business details...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-12 text-center">
          <Card className="p-6 bg-white card-shadow">
            <div className="text-red-500 text-xl mb-4">Business Not Found</div>
            <p className="mb-6">The business you're looking for doesn't exist or the link is invalid.</p>
            <Link to="/">
              <Button>Return Home</Button>
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8">
        <Card className="p-6 bg-white card-shadow">
          <div className="text-center mb-6">
            <Coffee size={40} className="mx-auto text-coffee-dark mb-2" />
            <h2 className="text-2xl font-bold text-coffee-dark">Join {businessName}</h2>
            <p className="text-coffee-light mt-1">Enter your name to join the loyalty program</p>
          </div>

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-coffee-dark mb-1">
                Your Name
              </label>
              <Input
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-orange hover:bg-orange-dark text-white">
              Join Loyalty Program
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default JoinPage;
