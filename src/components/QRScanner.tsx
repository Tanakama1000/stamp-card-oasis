
import { useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Card } from "@/components/ui/card";
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validateBusinessExists, checkCooldownPeriod } from "@/utils/qrScannerUtils";
import { checkActiveBonusPeriod } from "@/utils/bonusPeriodUtils";
import { StampProcessor } from "@/components/qr/StampProcessor";
import ScanResult from "@/components/qr/ScanResult";
import ScannerControls from "@/components/qr/ScannerControls";

interface QRScannerProps {
  onSuccessfulScan: (businessId: string, timestamp: number, stamps?: number) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onSuccessfulScan }) => {
  const { toast } = useToast();
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);
  const [processingQr, setProcessingQr] = useState<boolean>(false);

  useEffect(() => {
    const qrCodeScanner = new Html5Qrcode("qr-reader");
    setHtml5QrCode(qrCodeScanner);

    return () => {
      if (qrCodeScanner && qrCodeScanner.isScanning) {
        qrCodeScanner.stop().catch(err => console.error("Error stopping scanner:", err));
      }
    };
  }, []);

  const startScanner = () => {
    if (!html5QrCode) return;

    setScanning(true);
    setScanResult(null);

    const qrConfig = { fps: 10, qrbox: 250 };

    html5QrCode
      .start(
        { facingMode: "environment" },
        qrConfig,
        onQRCodeSuccess,
        onQRCodeError
      )
      .catch((err) => {
        console.error("❌ Error starting scanner:", err);
        setScanning(false);
        toast({
          title: "Camera Error",
          description: "Could not access your camera. Please check permissions.",
          variant: "destructive",
        });
      });
  };

  const stopScanner = () => {
    if (html5QrCode && html5QrCode.isScanning) {
      html5QrCode
        .stop()
        .then(() => {
          setScanning(false);
        })
        .catch((err) => {
          console.error("❌ Error stopping scanner:", err);
        });
    }
  };

  const onQRCodeSuccess = async (decodedText: string) => {
    if (processingQr) return;
    setProcessingQr(true);
    
    try {
      console.log("🔄 Processing QR code:", decodedText);
      stopScanner();

      let qrData;
      try {
        qrData = JSON.parse(decodedText);
        console.log("📄 Parsed QR data:", qrData);
      } catch (error) {
        console.error("❌ Failed to parse QR code JSON:", error);
        handleInvalidQR("Invalid QR code format. Please scan a valid business QR code.");
        return;
      }

      let businessId: string | undefined = qrData.businessId;
      let businessNumericId: string | undefined = qrData.businessNumericId;

      let foundBusiness: { id: string } | null = null;

      if (businessNumericId) {
        console.log("🔍 Trying numeric ID validation...");
        foundBusiness = await validateBusinessExists(businessNumericId, true);
      } else if (businessId) {
        console.log("🔍 Trying UUID validation...");
        foundBusiness = await validateBusinessExists(businessId, false);
      } else {
        console.error("❌ No business ID found in QR code");
        handleInvalidQR("Invalid QR code: missing business identifier.");
        return;
      }

      if (!foundBusiness) {
        console.error("❌ Business not found in database");
        handleInvalidQR("Business not found. This QR code refers to a business that doesn't exist.");
        return;
      }

      businessId = foundBusiness.id;
      console.log("✅ Business validated:", businessId);

      // Check authentication status
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("❌ Session error:", sessionError);
        handleInvalidQR("Authentication error. Please try logging in again.");
        return;
      }

      const userId = sessionData?.session?.user?.id;
      console.log("👤 User ID:", userId || "Anonymous");

      // Check cooldown period - this is now properly implemented for both auth and anon users
      console.log("🕐 Starting cooldown check...");
      const cooldownCheck = await checkCooldownPeriod(businessId, userId || null);
      console.log("🕐 Cooldown check result:", cooldownCheck);
      
      if (!cooldownCheck.allowed) {
        if (cooldownCheck.remainingMinutes) {
          const remainingText = cooldownCheck.remainingMinutes === 1 
            ? "1 minute" 
            : `${cooldownCheck.remainingMinutes} minutes`;
          
          const userType = userId ? "authenticated" : "anonymous";
          handleInvalidQR(`🕐 Please wait ${remainingText} before scanning again. This prevents duplicate stamps and ensures fair use of the loyalty program. (${userType} user)`);
        } else {
          handleInvalidQR("🔒 Unable to verify scan eligibility. Please try again in a moment.");
        }
        return;
      }

      console.log("✅ Cooldown check passed, proceeding with stamp collection");

      // Check for bonus period and calculate stamps to award
      const stampsToAward = await checkActiveBonusPeriod(businessId);
      console.log(`💰 Stamps to award: ${stampsToAward}`);

      if (userId) {
        console.log("🔄 Processing authenticated user scan...");
        const result = await StampProcessor.processAuthenticatedUser(businessId, userId, stampsToAward);
        
        if (result.success) {
          onSuccessfulScan(businessId, new Date().getTime(), stampsToAward);
          setScanResult({
            success: true,
            message: result.message,
          });
          toast({
            title: "Stamp Collected!",
            description: `${stampsToAward} stamp(s) have been added to your loyalty card.`,
          });
        } else {
          handleInvalidQR(result.message);
        }
      } else {
        // Anonymous user - use localStorage
        console.log("🔄 Processing anonymous user scan...");
        onSuccessfulScan(businessId, new Date().getTime(), stampsToAward);
        setScanResult({
          success: true,
          message: `Successfully scanned! ${stampsToAward} stamp(s) added to your loyalty card.`,
        });
      }
    } catch (err) {
      console.error("❌ Unexpected error in QR processing:", err);
      handleInvalidQR("Could not process QR code data. Please try again.");
    } finally {
      setProcessingQr(false);
    }
  };

  const handleInvalidQR = (message: string) => {
    console.error("❌ QR Scan failed:", message);
    setScanResult({
      success: false,
      message,
    });
    toast({
      title: "Scan Failed",
      description: message,
      variant: "destructive",
    });
    setProcessingQr(false);
  };

  const onQRCodeError = (err: any) => {
    // We don't need to do anything on error during scanning
    // This is just for QR reading errors, not for successful scans with invalid data
  };

  const handleScanAgain = () => {
    setScanResult(null);
    startScanner();
  };

  return (
    <Card className="p-6 bg-white card-shadow">
      <h3 className="text-xl font-semibold text-coffee-dark mb-4 flex items-center gap-2">
        <Camera size={24} className="text-orange" />
        Scan Business QR Code
      </h3>

      <div className="flex flex-col items-center gap-4">
        <div
          id="qr-reader"
          style={{ width: "100%", maxWidth: "300px", height: "300px" }}
          className="border border-coffee-light rounded-lg overflow-hidden bg-cream-light"
        ></div>

        {!scanning && !scanResult && (
          <ScannerControls
            scanning={false}
            processingQr={processingQr}
            onStartScanner={startScanner}
            onStopScanner={stopScanner}
          />
        )}

        {scanning && (
          <ScannerControls
            scanning={true}
            processingQr={processingQr}
            onStartScanner={startScanner}
            onStopScanner={stopScanner}
          />
        )}

        {scanResult && (
          <ScanResult result={scanResult} onScanAgain={handleScanAgain} />
        )}
      </div>
    </Card>
  );
};

export default QRScanner;
