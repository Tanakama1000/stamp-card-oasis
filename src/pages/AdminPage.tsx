
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import BusinessStats from "@/components/BusinessStats";
import CustomerList from "@/components/CustomerList";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, BarChart2, Users, UserCircle, Link as LinkIcon, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface BusinessData {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

const AdminPage = () => {
  const { toast } = useToast();
  const [qrCodeGenerated, setQrCodeGenerated] = useState<number>(0);
  const isMobile = useIsMobile();
  
  const [recentScans, setRecentScans] = useState<
    Array<{ customer: string; stamps: number; timestamp: number }>
  >([
    { customer: "John Doe", stamps: 1, timestamp: Date.now() - 20000 },
    { customer: "Jane Smith", stamps: 2, timestamp: Date.now() - 120000 },
    { customer: "Bob Johnson", stamps: 1, timestamp: Date.now() - 300000 },
  ]);
  
  const [businessData, setBusinessData] = useState<BusinessData>({
    id: "b_" + Date.now(),
    name: "Coffee Oasis",
    slug: "coffee-oasis",
    createdAt: new Date().toISOString()
  });
  
  const [slugEditing, setSlugEditing] = useState(false);
  const [tempSlug, setTempSlug] = useState(businessData.slug);

  useEffect(() => {
    const savedBusinessData = localStorage.getItem('businessData');
    if (savedBusinessData) {
      try {
        const parsedData = JSON.parse(savedBusinessData);
        setBusinessData(parsedData);
        setTempSlug(parsedData.slug);
      } catch (e) {
        console.error("Error parsing business data:", e);
      }
    } else {
      localStorage.setItem('businessData', JSON.stringify(businessData));
    }
  }, []);

  const handleQRGenerated = (codeData: string) => {
    try {
      const data = JSON.parse(codeData);
      setQrCodeGenerated(prev => prev + 1);
      
      const newScan = {
        customer: data.customer || "Unknown Customer",
        stamps: data.stamps,
        timestamp: data.timestamp,
      };
      
      setRecentScans(prev => [newScan, ...prev].slice(0, 10));
    } catch (err) {
      console.error("Error parsing QR data:", err);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleSlugChange = () => {
    if (!tempSlug.trim()) {
      toast({
        title: "Invalid Slug",
        description: "Business URL cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    const validSlug = tempSlug.trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    
    const updatedBusinessData = {
      ...businessData,
      slug: validSlug
    };
    
    setBusinessData(updatedBusinessData);
    setTempSlug(validSlug);
    setSlugEditing(false);
    
    localStorage.setItem('businessData', JSON.stringify(updatedBusinessData));
    
    toast({
      title: "URL Updated",
      description: "Your business join link has been updated."
    });
  };

  const copyJoinLink = () => {
    const joinLink = `${window.location.origin}/join/${businessData.slug}`;
    navigator.clipboard.writeText(joinLink);
    
    toast({
      title: "Link Copied",
      description: "Join link copied to clipboard"
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-coffee-dark mb-2">Business Admin Panel</h1>
          <p className="text-coffee-light">Manage your loyalty program and generate QR codes</p>
        </div>
        
        <Card className="p-4 mb-6 bg-white card-shadow">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-coffee-dark flex items-center gap-2">
                <LinkIcon size={18} className="text-orange" />
                Customer Join Link
              </h3>
              <p className="text-coffee-light text-sm mt-1">
                Share this link with customers to join your loyalty program
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              {slugEditing ? (
                <div className="flex gap-2 w-full sm:w-auto">
                  <Input 
                    value={tempSlug}
                    onChange={(e) => setTempSlug(e.target.value)}
                    className="min-w-0 w-full"
                    placeholder="business-url"
                  />
                  <Button size="sm" onClick={handleSlugChange}>Save</Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setTempSlug(businessData.slug);
                      setSlugEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button className="gap-1" variant="outline">
                        <span className="truncate max-w-[200px]">
                          {window.location.origin}/join/{businessData.slug}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                      <div className="text-sm font-medium">
                        {window.location.origin}/join/{businessData.slug}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button onClick={copyJoinLink} size="icon" variant="ghost">
                    <Copy size={18} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setSlugEditing(true)}
                  >
                    Edit URL
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        <BusinessStats 
          customerCount={26}
          rewardsRedeemed={8}
          totalStamps={142}
          conversionRate="31%"
        />

        <div className="mt-8">
          <Tabs defaultValue="qr-generator">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="qr-generator" className="flex items-center gap-2">
                <QrCode size={18} />
                <span className="hidden sm:inline">QR Generator</span>
                <span className="sm:hidden">QR</span>
              </TabsTrigger>
              <TabsTrigger value="recent-activity" className="flex items-center gap-2">
                <BarChart2 size={18} />
                <span className="hidden sm:inline">Recent Activity</span>
                <span className="sm:hidden">Activity</span>
              </TabsTrigger>
              <TabsTrigger value="customers" className="flex items-center gap-2">
                <UserCircle size={18} />
                <span className="hidden sm:inline">Customers</span>
                <span className="sm:hidden">Users</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="qr-generator">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <QRCodeGenerator onGenerate={handleQRGenerated} />
              </div>
            </TabsContent>
            <TabsContent value="recent-activity">
              <Card className="p-6 bg-white card-shadow">
                <h3 className="text-xl font-semibold text-coffee-dark mb-4">Recent Stamp Collections</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-coffee-light">
                        <th className="text-left p-3 text-coffee-dark">Customer</th>
                        <th className="text-left p-3 text-coffee-dark">Stamps</th>
                        <th className="text-left p-3 text-coffee-dark">Date & Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentScans.map((scan, index) => (
                        <tr key={index} className="border-b border-cream">
                          <td className="p-3">{scan.customer}</td>
                          <td className="p-3">+{scan.stamps}</td>
                          <td className="p-3 text-coffee-light">{formatTimestamp(scan.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="customers">
              <CustomerList />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
