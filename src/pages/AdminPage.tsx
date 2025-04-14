
import { useState } from "react";
import Layout from "@/components/Layout";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import BusinessStats from "@/components/BusinessStats";
import CustomerList from "@/components/CustomerList";
import LoyaltyCardEditor from "@/components/LoyaltyCardEditor";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, BarChart2, Users, UserCircle, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoyaltyCardConfig } from "@/components/LoyaltyCardEditor";
import LoyaltyCard from "@/components/LoyaltyCard";

const AdminPage = () => {
  const { toast } = useToast();
  const [qrCodeGenerated, setQrCodeGenerated] = useState<number>(0);
  const [cardConfig, setCardConfig] = useState<LoyaltyCardConfig | null>(null);
  const [recentScans, setRecentScans] = useState<
    Array<{ customer: string; stamps: number; timestamp: number }>
  >([
    { customer: "John Doe", stamps: 1, timestamp: Date.now() - 20000 },
    { customer: "Jane Smith", stamps: 2, timestamp: Date.now() - 120000 },
    { customer: "Bob Johnson", stamps: 1, timestamp: Date.now() - 300000 },
  ]);

  const handleQRGenerated = (codeData: string) => {
    try {
      const data = JSON.parse(codeData);
      setQrCodeGenerated(prev => prev + 1);
      
      // Add to recent scans for demonstration purposes
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
  
  const handleCardUpdate = (cardConfig: LoyaltyCardConfig) => {
    // Save the card configuration to localStorage
    localStorage.setItem('loyaltyCardStyle', JSON.stringify(cardConfig));
    setCardConfig(cardConfig);
    toast({
      title: "Card Style Saved",
      description: "The loyalty card style has been saved and will be visible to customers.",
      duration: 2000,
    });
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-coffee-dark mb-2">Business Admin Panel</h1>
          <p className="text-coffee-light">Manage your loyalty program and generate QR codes</p>
        </div>

        <BusinessStats 
          customerCount={26}
          rewardsRedeemed={8}
          totalStamps={142}
          conversionRate="31%"
        />

        <div className="mt-8">
          <Tabs defaultValue="qr-generator">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="qr-generator" className="flex items-center gap-2">
                <QrCode size={18} />
                QR Generator
              </TabsTrigger>
              <TabsTrigger value="card-editor" className="flex items-center gap-2">
                <Palette size={18} />
                Card Editor
              </TabsTrigger>
              <TabsTrigger value="recent-activity" className="flex items-center gap-2">
                <BarChart2 size={18} />
                Recent Activity
              </TabsTrigger>
              <TabsTrigger value="customers" className="flex items-center gap-2">
                <UserCircle size={18} />
                Customers
              </TabsTrigger>
            </TabsList>
            <TabsContent value="qr-generator">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <QRCodeGenerator onGenerate={handleQRGenerated} />
                
                <Card className="p-6 bg-white card-shadow">
                  <h3 className="text-xl font-semibold text-coffee-dark mb-4">Instructions</h3>
                  <ol className="list-decimal list-inside space-y-3 text-coffee-medium">
                    <li>Enter the customer's name</li>
                    <li>Select how many stamps to award</li>
                    <li>Generate the QR code</li>
                    <li>Let the customer scan it with their phone</li>
                    <li>Or download the QR code to print</li>
                  </ol>
                  
                  <div className="mt-6 p-4 bg-cream rounded-lg">
                    <div className="flex items-center gap-2 text-coffee-dark">
                      <Users size={20} />
                      <h4 className="font-medium">QR Codes Generated</h4>
                    </div>
                    <p className="text-3xl font-bold text-coffee-dark mt-2">{qrCodeGenerated}</p>
                  </div>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="card-editor">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LoyaltyCardEditor onCardUpdate={handleCardUpdate} />
                
                <Card className="p-6 bg-white card-shadow">
                  <h3 className="text-xl font-semibold text-coffee-dark mb-4">Card Preview</h3>
                  <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
                    <div className="w-full max-w-md">
                      {cardConfig ? (
                        <LoyaltyCard {...cardConfig} />
                      ) : (
                        <div className="text-center p-4 text-coffee-light">
                          Edit and save the card to see a preview
                        </div>
                      )}
                    </div>
                    <p className="mt-4 text-sm text-coffee-light text-center">
                      This preview shows how the loyalty card will appear to customers.
                    </p>
                  </div>
                </Card>
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
