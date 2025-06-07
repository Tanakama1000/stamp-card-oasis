import { useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, Camera, CameraOff, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QRScannerProps {
  onSuccessfulScan: (businessId: string, timestamp: number, stamps?: number) => void;
}

interface BonusPeriod {
  id: string;
  name: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  bonus_type: "multiplier" | "fixed";
  bonus_value: number;
}

function uuidToNumericId(uuid: string): string {
  let num = 0;
  for (let i = 0; i < uuid.length; i++) {
    num = ((num << 5) - num) + uuid.charCodeAt(i);
    num = num & num;
  }
  num = Math.abs(num) % 1_000_000_0000;
  return num.toString().padStart(10, "0");
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

  const checkActiveBonusPeriod = async (businessId: string): Promise<{ stamps: number; bonusInfo?: { name: string; type: string; value: number } }> => {
    try {
      console.log("🔍 Checking for active bonus periods...");
      
      const { data, error } = await supabase
        .from('businesses')
        .select('bonus_periods')
        .eq('id', businessId)
        .single();

      if (error) {
        console.error('❌ Error fetching bonus periods:', error);
        return { stamps: 1 };
      }

      if (data?.bonus_periods && Array.isArray(data.bonus_periods)) {
        const bonusPeriods = data.bonus_periods as unknown as BonusPeriod[];
        const now = new Date();
        const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const currentTime = now.toTimeString().substr(0, 5); // "HH:MM" format

        console.log(`🕐 Current time: ${currentDay} (${now.toLocaleDateString('en-US', { weekday: 'long' })}) ${currentTime}`);

        const activePeriod = bonusPeriods.find(period => {
          const matches = (
            period.day_of_week === currentDay &&
            currentTime >= period.start_time &&
            currentTime <= period.end_time
          );
          
          if (matches) {
            console.log(`🎯 Found matching period: ${period.name} (${period.day_of_week}, ${period.start_time}-${period.end_time})`);
          }
          
          return matches;
        });

        if (activePeriod) {
          console.log(`🚀 Active bonus period: ${activePeriod.name} (${activePeriod.bonus_type}: ${activePeriod.bonus_value})`);
          
          let stampsToAward = 1;
          if (activePeriod.bonus_type === "multiplier") {
            stampsToAward = activePeriod.bonus_value; // e.g., 2x stamps = 2 stamps
          } else {
            stampsToAward = 1 + activePeriod.bonus_value; // e.g., +1 extra stamp = 2 total stamps
          }
          
          return { 
            stamps: stampsToAward,
            bonusInfo: {
              name: activePeriod.name,
              type: activePeriod.bonus_type,
              value: activePeriod.bonus_value
            }
          };
        }
      }

      console.log("📋 No active bonus periods found, awarding 1 stamp");
      return { stamps: 1 };
    } catch (error) {
      console.error('❌ Error checking bonus period:', error);
      return { stamps: 1 };
    }
  };

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

  const validateBusinessExists = async (idFromQR: string, useNumericId: boolean = false): Promise<null | { id: string }> => {
    try {
      console.log(`🔍 Validating business ID: ${idFromQR} (numeric: ${useNumericId})`);
      
      if (useNumericId) {
        const { data, error } = await supabase.from('businesses').select('id');
        if (error) {
          console.error("❌ Error fetching businesses for numeric ID validation:", error);
          return null;
        }
        if (!data) {
          console.log("❌ No businesses found in database");
          return null;
        }
        const found = data.find((b: { id: string }) => uuidToNumericId(b.id) === idFromQR);
        console.log(`🔍 Found business with numeric ID: ${found ? 'YES' : 'NO'}`);
        return found ? found : null;
      } else {
        const { data, error } = await supabase
          .from('businesses')
          .select('id')
          .eq('id', idFromQR)
          .single();
        
        if (error) {
          console.error("❌ Error validating business ID:", error);
          return null;
        }
        console.log(`✅ Business found with UUID: ${data ? 'YES' : 'NO'}`);
        return data;
      }
    } catch (error) {
      console.error("❌ Exception during business validation:", error);
      return null;
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

      // Check for bonus period and calculate stamps to award
      const bonusResult = await checkActiveBonusPeriod(businessId);
      const stampsToAward = bonusResult.stamps;
      
      console.log(`💰 Stamps to award: ${stampsToAward}`);
      if (bonusResult.bonusInfo) {
        console.log(`🎉 Bonus active: ${bonusResult.bonusInfo.name}`);
      }

      // Check authentication status
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("❌ Session error:", sessionError);
        handleInvalidQR("Authentication error. Please try logging in again.");
        return;
      }

      const userId = sessionData?.session?.user?.id;
      console.log("👤 User ID:", userId || "Anonymous");

      if (userId) {
        try {
          console.log("🔄 Processing authenticated user scan...");
          
          // First, check existing membership
          const { data: existingMembership, error: fetchError } = await supabase
            .from('business_members')
            .select('id, stamps, total_stamps_collected')
            .eq('business_id', businessId)
            .eq('user_id', userId)
            .maybeSingle();
          
          if (fetchError) {
            console.error("❌ Error fetching membership:", fetchError);
            throw new Error(`Database error: ${fetchError.message}`);
          }

          console.log("📊 Existing membership:", existingMembership);

          let newStampCount = stampsToAward;
          let memberId;
          
          if (existingMembership) {
            // Update existing membership
            const updatedStamps = (existingMembership.stamps || 0) + stampsToAward;
            const updatedTotalStamps = (existingMembership.total_stamps_collected || 0) + stampsToAward;
            console.log(`🔄 Updating stamps from ${existingMembership.stamps} to ${updatedStamps} (+${stampsToAward})`);
            console.log(`🔄 Updating total stamps from ${existingMembership.total_stamps_collected} to ${updatedTotalStamps}`);
            
            const { error: updateError } = await supabase
              .from('business_members')
              .update({ 
                stamps: updatedStamps,
                total_stamps_collected: updatedTotalStamps
              })
              .eq('id', existingMembership.id);
              
            if (updateError) {
              console.error("❌ Error updating stamps:", updateError);
              throw new Error(`Failed to update stamps: ${updateError.message}`);
            }
            
            newStampCount = updatedStamps;
            memberId = existingMembership.id;
            console.log("✅ Successfully updated existing membership");
          } else {
            // Create new membership
            console.log("🆕 Creating new membership...");
            const { data: newMembership, error: insertError } = await supabase
              .from('business_members')
              .insert({
                business_id: businessId,
                user_id: userId,
                stamps: stampsToAward,
                total_stamps_collected: stampsToAward,
                is_anonymous: false,
              })
              .select('id')
              .single();
              
            if (insertError) {
              console.error("❌ Error creating membership:", insertError);
              throw new Error(`Failed to create membership: ${insertError.message}`);
            }
            
            if (newMembership) {
              memberId = newMembership.id;
              console.log("✅ Successfully created new membership:", memberId);
            } else {
              throw new Error("Failed to create membership - no data returned");
            }
          }

          // Verify the operation was successful by checking the database
          const { data: verifyData, error: verifyError } = await supabase
            .from('business_members')
            .select('stamps, total_stamps_collected')
            .eq('id', memberId)
            .single();

          if (verifyError) {
            console.error("❌ Error verifying stamp update:", verifyError);
            throw new Error("Could not verify stamp was recorded");
          }

          console.log("✅ Verification successful. Current stamps:", verifyData);

          onSuccessfulScan(businessId, new Date().getTime(), stampsToAward);
          
          let successMessage = `Successfully scanned! ${stampsToAward} stamp(s) added to your loyalty card. Total: ${verifyData.stamps}`;
          if (bonusResult.bonusInfo) {
            successMessage = `🎉 ${bonusResult.bonusInfo.name} bonus! ${stampsToAward} stamp(s) added to your loyalty card. Total: ${verifyData.stamps}`;
          }
          
          setScanResult({
            success: true,
            message: successMessage,
          });
          
          toast({
            title: bonusResult.bonusInfo ? `🚀 ${bonusResult.bonusInfo.name} Bonus!` : "Stamp Collected!",
            description: `${stampsToAward} stamp(s) have been added to your loyalty card.`,
          });
        } catch (error) {
          console.error("❌ Database operation failed:", error);
          handleInvalidQR(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
        }
      } else {
        // Anonymous user - use localStorage
        console.log("🔄 Processing anonymous user scan...");
        onSuccessfulScan(businessId, new Date().getTime(), stampsToAward);
        
        let successMessage = `Successfully scanned! ${stampsToAward} stamp(s) added to your loyalty card.`;
        if (bonusResult.bonusInfo) {
          successMessage = `🎉 ${bonusResult.bonusInfo.name} bonus! ${stampsToAward} stamp(s) added to your loyalty card.`;
        }
        
        setScanResult({
          success: true,
          message: successMessage,
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
          <Button
            onClick={startScanner}
            className="bg-orange hover:bg-orange-light transition-colors"
          >
            <Camera className="mr-2" size={18} />
            Start Scanner
          </Button>
        )}

        {scanning && (
          <Button
            onClick={stopScanner}
            variant="outline"
            className="border-orange text-orange hover:bg-orange-light hover:text-white"
          >
            <CameraOff className="mr-2" size={18} />
            Stop Scanner
          </Button>
        )}

        {scanning && (
          <div className="flex items-center gap-2 text-coffee-medium">
            <Loader2 className="animate-spin" size={18} />
            <span>Scanning... Point camera at QR code</span>
          </div>
        )}

        {processingQr && (
          <div className="flex items-center gap-2 text-coffee-medium">
            <Loader2 className="animate-spin" size={18} />
            <span>Processing scan...</span>
          </div>
        )}

        {scanResult && (
          <Alert
            className={`${
              scanResult.success ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50"
            } mt-4`}
          >
            {scanResult.success ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <AlertTitle>
              {scanResult.success ? "Success!" : "Failed to scan"}
            </AlertTitle>
            <AlertDescription>{scanResult.message}</AlertDescription>
          </Alert>
        )}

        {scanResult && (
          <Button
            onClick={() => {
              setScanResult(null);
              startScanner();
            }}
            variant="outline"
            className="mt-2"
          >
            Scan Again
          </Button>
        )}
      </div>
    </Card>
  );
};

export default QRScanner;
