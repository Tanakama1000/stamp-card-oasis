
import { useState } from "react";
import Layout from "@/components/Layout";
import QRScanner from "@/components/QRScanner";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ScanPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [scanning, setScanning] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleSuccessfulScan = async (businessId: string, timestamp: number, stamps: number = 1) => {
    try {
      setError(null);
      // Success toast notification
      toast({
        title: "QR Code Scanned Successfully!",
        description: `You collected ${stamps} stamp${stamps !== 1 ? 's' : ''}!`,
        variant: "default",
      });

      // Get the current session to check if user is authenticated
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        // Continue with anonymous flow, don't show error to user
      }
      
      if (sessionData?.session?.user?.id) {
        // User is authenticated, database update was handled in QRScanner component
        console.log("Authenticated user scanned business QR:", businessId);
      } else {
        // For anonymous users, store in localStorage
        try {
          const savedMemberships = localStorage.getItem('memberships') || '[]';
          const memberships = JSON.parse(savedMemberships);
          
          // Find if user already has membership with this business
          const existingIndex = memberships.findIndex((m: any) => m.businessId === businessId);
          
          if (existingIndex >= 0) {
            // Update existing membership
            memberships[existingIndex].stamps = (memberships[existingIndex].stamps || 0) + stamps;
          } else {
            // Create new membership
            memberships.push({
              id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              businessId: businessId,
              customerName: "Anonymous Customer",
              joinedAt: new Date().toISOString(),
              stamps: stamps
            });
          }
          
          localStorage.setItem('memberships', JSON.stringify(memberships));
        } catch (e) {
          console.error("Error updating localStorage:", e);
          setError("Could not save your stamp locally. Please try again or sign in to save your stamps.");
        }
      }

      // Navigate back or to the appropriate page after a short delay
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (err) {
      console.error("Error in handleSuccessfulScan:", err);
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
            
            {scanning ? (
              <div className="w-full max-w-sm mx-auto">
                <QRScanner onSuccessfulScan={handleSuccessfulScan} />
              </div>
            ) : (
              <div className="text-center py-8">
                <Button
                  onClick={() => setScanning(true)}
                  className="bg-orange hover:bg-orange-dark text-white"
                >
                  Start Scanning
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ScanPage;
