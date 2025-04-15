
import { useState } from "react";
import Layout from "@/components/Layout";
import QRScanner from "@/components/QRScanner";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ScanPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [scanning, setScanning] = useState<boolean>(true);

  const handleSuccessfulScan = (businessId: string, timestamp: number, stamps: number = 1) => {
    // Success toast notification
    toast({
      title: "QR Code Scanned Successfully!",
      description: `You collected ${stamps} stamp${stamps !== 1 ? 's' : ''}!`,
      variant: "default",
    });

    // Navigate back or to the appropriate page
    setTimeout(() => {
      navigate(-1);
    }, 2000);
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
