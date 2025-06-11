import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import BusinessStats from "@/components/BusinessStats";
import CustomerList from "@/components/CustomerList";
import RecentActivity from "@/components/RecentActivity";
import CardCustomization from "@/components/loyalty/CardCustomization";
import WelcomeStampsSettings from "@/components/admin/WelcomeStampsSettings";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, BarChart2, Users, UserCircle, Link as LinkIcon, Copy, CreditCard, Clock, Gift, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LoyaltyCardConfig } from "@/components/loyalty/types/LoyaltyCardConfig";
import ExpiringStampsAlert from "@/components/admin/ExpiringStampsAlert";
import StampExpirySettings from "@/components/admin/StampExpirySettings";
import TimeBonusSettings from "@/components/admin/TimeBonusSettings";
import ReferralSettings from "@/components/admin/ReferralSettings";
import ReferralAnalytics from "@/components/ReferralAnalytics";

const businessSchema = z.object({
  name: z.string().min(2, {
    message: "Business name must be at least 2 characters.",
  }),
});

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [businessData, setBusinessData] = useState(null);
  const [isCreatingBusiness, setIsCreatingBusiness] = useState(false);
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [slugEditing, setSlugEditing] = useState(false);
  const [tempSlug, setTempSlug] = useState('');
  const [cardConfig, setCardConfig] = useState<LoyaltyCardConfig | null>(null);
  
  const recentScans = [
    { customer: "John Doe", stamps: 1, timestamp: new Date().getTime() - 1000 * 60 * 5 },
    { customer: "Jane Smith", stamps: 1, timestamp: new Date().getTime() - 1000 * 60 * 30 },
    { customer: "Bob Johnson", stamps: 2, timestamp: new Date().getTime() - 1000 * 60 * 60 },
    { customer: "Alice Brown", stamps: 1, timestamp: new Date().getTime() - 1000 * 60 * 60 * 2 },
  ];

  const businessForm = useForm<z.infer<typeof businessSchema>>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Please Login",
          description: "You need to be logged in to access the admin page.",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }

      setUser(session.user);

      const { data: businesses, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', session.user.id)
        .single();

      if (businesses) {
        setBusinessData(businesses);
        localStorage.setItem('businessData', JSON.stringify(businesses));
        setTempSlug(businesses.slug);
      } else if (error && error.code !== 'PGRST116') {
        console.error('Error fetching business:', error);
      }
    };

    checkUser();
  }, [navigate, toast]);

  const handleCreateBusiness = async (values: z.infer<typeof businessSchema>) => {
    if (!user) return;

    try {
      const { data: slugData, error: slugError } = await supabase.rpc('generate_unique_slug', { 
        business_name: values.name 
      });

      if (slugError) {
        throw slugError;
      }

      const { data, error } = await supabase
        .from('businesses')
        .insert({
          name: values.name,
          slug: slugData,
          owner_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setBusinessData(data);
      localStorage.setItem('businessData', JSON.stringify(data));
      setTempSlug(data.slug);
      setIsCreatingBusiness(false);
      
      toast({
        title: "Business Created",
        description: `${values.name} has been successfully registered.`
      });
    } catch (error) {
      console.error('Error creating business:', error);
      toast({
        title: "Error",
        description: "Could not create business. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleBusinessNameSubmit = async (values: z.infer<typeof businessSchema>) => {
    if (!businessData || !user) return;
    
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ name: values.name })
        .eq('id', businessData.id)
        .eq('owner_id', user.id);
      
      if (error) throw error;
      
      const updatedBusinessData = {
        ...businessData,
        name: values.name
      };
      
      setBusinessData(updatedBusinessData);
      localStorage.setItem('businessData', JSON.stringify(updatedBusinessData));
      
      setIsNameEditing(false);
      
      toast({
        title: "Business Updated",
        description: "Your business name has been updated successfully."
      });
    } catch (error) {
      console.error('Error updating business name:', error);
      toast({
        title: "Error",
        description: "Could not update business name. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleSlugChange = async () => {
    if (!businessData || !user || !tempSlug.trim()) return;
    
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ slug: tempSlug.trim() })
        .eq('id', businessData.id)
        .eq('owner_id', user.id);
      
      if (error) throw error;
      
      const updatedBusinessData = {
        ...businessData,
        slug: tempSlug.trim()
      };
      
      setBusinessData(updatedBusinessData);
      localStorage.setItem('businessData', JSON.stringify(updatedBusinessData));
      
      setSlugEditing(false);
      
      toast({
        title: "URL Updated",
        description: "Your business URL has been updated successfully."
      });
    } catch (error) {
      console.error('Error updating business slug:', error);
      toast({
        title: "Error",
        description: "Could not update business URL. It may already be taken.",
        variant: "destructive"
      });
    }
  };
  
  const copyJoinLink = () => {
    const joinLink = `${window.location.origin}/join/${businessData.slug}`;
    navigator.clipboard.writeText(joinLink);
    
    toast({
      title: "Link Copied",
      description: "Join link copied to clipboard!"
    });
  };
  
  const handleQRGenerated = (codeData: string) => {
    console.log("QR code generated:", codeData);
  };
  
  const handleSaveCardConfig = async (config: LoyaltyCardConfig) => {
    if (!businessData || !user) return;
    
    try {
      setCardConfig(config);
      
      toast({
        title: "Card Saved",
        description: "Loyalty card configuration has been saved."
      });
    } catch (error) {
      console.error('Error saving card configuration:', error);
      toast({
        title: "Error",
        description: "Could not save loyalty card configuration.",
        variant: "destructive"
      });
    }
  };
  
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (!user) {
    return <Layout><div>Loading...</div></Layout>;
  }

  if (!businessData && !isCreatingBusiness) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-12 text-center">
          <Card className="p-6 bg-white card-shadow">
            <h2 className="text-2xl font-bold mb-4">Create Your Business</h2>
            <p className="mb-6">Let's set up your loyalty program. What's your business name?</p>
            <Button onClick={() => setIsCreatingBusiness(true)}>
              Create Business
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  if (isCreatingBusiness) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-12">
          <Card className="p-6 bg-white card-shadow">
            <h2 className="text-2xl font-bold mb-4">Create Your Business</h2>
            <Form {...businessForm}>
              <form onSubmit={businessForm.handleSubmit(handleCreateBusiness)} className="space-y-4">
                <FormField
                  control={businessForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="Business Name" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex space-x-2">
                  <Button type="submit">Create Business</Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreatingBusiness(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-coffee-dark mb-2">Business Admin Panel</h1>
          <p className="text-coffee-light">Manage your loyalty program and generate QR codes</p>
        </div>
        
        {/* Expiring stamps alert */}
        {businessData && (
          <div className="mb-6">
            <ExpiringStampsAlert businessId={businessData.id} />
          </div>
        )}
        
        <Card className="p-4 mb-4 bg-white card-shadow">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="font-semibold text-coffee-dark">Business Information</h3>
              <p className="text-coffee-light text-sm">Manage your business details</p>
            </div>
            
            {isNameEditing ? (
              <Form {...businessForm}>
                <form onSubmit={businessForm.handleSubmit(handleBusinessNameSubmit)} className="w-full md:w-auto">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <FormField
                      control={businessForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input 
                              placeholder="Business Name" 
                              {...field} 
                              className="min-w-0 w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" size="sm">Save</Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        businessForm.reset({ name: businessData.name });
                        setIsNameEditing(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="flex gap-2">
                <div className="py-2 px-3 border rounded-md bg-gray-50 min-w-[200px] text-center">
                  <span className="font-medium">{businessData.name}</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    businessForm.reset({ name: businessData.name });
                    setIsNameEditing(true);
                  }}
                >
                  Edit Name
                </Button>
              </div>
            )}
          </div>
        </Card>
        
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
          businessId={businessData.id}
        />

        <div className="mt-8">
          <Tabs defaultValue="qr-generator">
            <TabsList className="grid grid-cols-6 mb-6">
              <TabsTrigger value="qr-generator" className="flex items-center gap-2">
                <QrCode size={18} />
                <span className="hidden sm:inline">QR Generator</span>
                <span className="sm:hidden">QR</span>
              </TabsTrigger>
              <TabsTrigger value="card-editor" className="flex items-center gap-2">
                <CreditCard size={18} />
                <span className="hidden sm:inline">Card Editor</span>
                <span className="sm:hidden">Card</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings size={18} />
                <span className="hidden sm:inline">Settings</span>
                <span className="sm:hidden">Settings</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart2 size={18} />
                <span className="hidden sm:inline">Analytics</span>
                <span className="sm:hidden">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="recent-activity" className="flex items-center gap-2">
                <Users size={18} />
                <span className="hidden sm:inline">Activity</span>
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
                <QRCodeGenerator 
                  onGenerate={handleQRGenerated} 
                  businessId={businessData.id} 
                />
              </div>
            </TabsContent>
            <TabsContent value="card-editor">
              <CardCustomization 
                onSave={handleSaveCardConfig}
                initialConfig={cardConfig || {
                  businessName: businessData.name,
                  maxStamps: 10
                }}
              />
            </TabsContent>
            <TabsContent value="settings">
              <div className="space-y-6">
                <WelcomeStampsSettings businessId={businessData.id} />
                <StampExpirySettings businessId={businessData.id} />
                <TimeBonusSettings businessId={businessData.id} />
                <ReferralSettings businessId={businessData.id} />
              </div>
            </TabsContent>
            <TabsContent value="analytics">
              <ReferralAnalytics businessId={businessData.id} />
            </TabsContent>
            <TabsContent value="recent-activity">
              <RecentActivity businessId={businessData.id} />
            </TabsContent>
            <TabsContent value="customers">
              <CustomerList businessId={businessData.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
