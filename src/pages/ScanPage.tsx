
import { useState } from "react";
import Layout from "@/components/Layout";
import EnhancedQRScanner from "@/components/EnhancedQRScanner";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ScanPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSuccessfulScan = async (businessId: string, timestamp: number, stamps: number = 1) => {
    try {
      setError(null);
      console.log("🎯 ScanPage handling successful scan:", { businessId, stamps });
      
      if (!businessId || businessId.trim() === '') {
        const errorMsg = "Invalid business QR code. Missing business identifier.";
        console.error("❌", errorMsg);
        setError(errorMsg);
        toast({
          title: "Scan Error",
          description: "Invalid QR code format. Please try again with a valid business QR code.",
          variant: "destructive",
        });
        return;
      }

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("❌ Session error in ScanPage:", sessionError);
      }
      
      if (sessionData?.session?.user?.id) {
        console.log("✅ Authenticated user scanned business QR:", businessId);
        
        // Enhanced toast message for bonus stamps
        if (stamps > 1) {
          toast({
            title: "🎉 Bonus Stamps Collected!",
            description: `You collected ${stamps} stamps! A bonus period was active. Check your loyalty card to see your progress.`,
            variant: "default",
          });
        } else {
          toast({
            title: "QR Code Scanned Successfully!",
            description: `You collected ${stamps} stamp! Check your loyalty card to see your progress.`,
            variant: "default",
          });
        }
      } else {
        console.log("👤 Anonymous user - storing in localStorage");
        try {
          const savedMemberships = localStorage.getItem('memberships') || '[]';
          const memberships = JSON.parse(savedMemberships);
          
          const existingIndex = memberships.findIndex((m: any) => m.businessId === businessId);
          
          if (existingIndex >= 0) {
            const oldStamps = memberships[existingIndex].stamps || 0;
            memberships[existingIndex].stamps = oldStamps + stamps;
            console.log(`📊 Updated localStorage stamps from ${oldStamps} to ${memberships[existingIndex].stamps} (+${stamps})`);
          } else {
            const newMembership = {
              id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              businessId: businessId,
              customerName: "Anonymous Customer",
              joinedAt: new Date().toISOString(),
              stamps: stamps
            };
            memberships.push(newMembership);
            console.log("🆕 Created new localStorage membership:", newMembership);
          }
          
          localStorage.setItem('memberships', JSON.stringify(memberships));
          console.log("✅ localStorage updated successfully");
          
          // Enhanced toast message for bonus stamps
          if (stamps > 1) {
            toast({
              title: "🎉 Bonus Stamps Collected!",
              description: `You collected ${stamps} stamps! A bonus period was active. Sign in to sync your stamps across devices.`,
              variant: "default",
            });
          } else {
            toast({
              title: "QR Code Scanned Successfully!",
              description: `You collected ${stamps} stamp! Sign in to sync your stamps across devices.`,
              variant: "default",
            });
          }
        } catch (e) {
          console.error("❌ Error updating localStorage:", e);
          setError("Could not save your stamp locally. Please try again or sign in to save your stamps.");
        }
      }

      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (err) {
      console.error("❌ Error in handleSuccessfulScan:", err);
      setError("An unexpected error occurred. Please try again.");
      toast({
        title: "Scan Error",
        description: "Could not process scan result. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-4">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-coffee-dark">Scan Business QR Code</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4">
            <p className="text-coffee-medium text-center mb-4">
              Scan a business QR code to collect stamps
            </p>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 text-sm text-red-600">
                {error}
              </div>
            )}
            
            <div className="w-full max-w-sm mx-auto">
              <EnhancedQRScanner onSuccessfulScan={handleSuccessfulScan} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ScanPage;
