
import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, Camera, CameraOff, CheckCircle2, XCircle, Upload, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { detectDevice, getCameraConfigurations, getCameraConstraints, DeviceInfo } from "@/utils/deviceDetection";
import FileUpload from "@/components/loyalty/FileUpload";

interface EnhancedQRScannerProps {
  onSuccessfulScan: (businessId: string, timestamp: number, stamps?: number) => void;
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

const EnhancedQRScanner: React.FC<EnhancedQRScannerProps> = ({ onSuccessfulScan }) => {
  const { toast } = useToast();
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);
  const [processingQr, setProcessingQr] = useState<boolean>(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [fallbackMode, setFallbackMode] = useState<'camera' | 'file' | 'manual'>('camera');
  const [retryCount, setRetryCount] = useState(0);
  const [manualInput, setManualInput] = useState<string>('');
  const scannerInitialized = useRef(false);

  useEffect(() => {
    const device = detectDevice();
    setDeviceInfo(device);
    console.log("🔍 Device detected:", device);
    
    if (!device.supportsCamera) {
      setFallbackMode('file');
      console.log("📱 No camera support detected, switching to file mode");
    }

    const qrCodeScanner = new Html5Qrcode("qr-reader");
    setHtml5QrCode(qrCodeScanner);
    scannerInitialized.current = true;

    return () => {
      if (qrCodeScanner && qrCodeScanner.isScanning) {
        qrCodeScanner.stop().catch(err => console.error("Error stopping scanner:", err));
      }
    };
  }, []);

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

  const processQRData = async (decodedText: string) => {
    if (processingQr) return;
    setProcessingQr(true);
    
    try {
      console.log("🔄 Processing QR code:", decodedText);

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

      const defaultStamps = 1;

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

          let newStampCount = defaultStamps;
          let memberId;
          
          if (existingMembership) {
            const updatedStamps = (existingMembership.stamps || 0) + defaultStamps;
            const updatedTotalStamps = (existingMembership.total_stamps_collected || 0) + defaultStamps;
            console.log(`🔄 Updating stamps from ${existingMembership.stamps} to ${updatedStamps}`);
            
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
            console.log("🆕 Creating new membership...");
            const { data: newMembership, error: insertError } = await supabase
              .from('business_members')
              .insert({
                business_id: businessId,
                user_id: userId,
                stamps: defaultStamps,
                total_stamps_collected: defaultStamps,
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

          onSuccessfulScan(businessId, new Date().getTime(), defaultStamps);
          setScanResult({
            success: true,
            message: `Successfully scanned! ${defaultStamps} stamp(s) added to your loyalty card.`,
          });
          toast({
            title: "Stamp Collected!",
            description: `${defaultStamps} stamp(s) have been added to your loyalty card.`,
          });
        } catch (error) {
          console.error("❌ Database operation failed:", error);
          handleInvalidQR(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
        }
      } else {
        console.log("🔄 Processing anonymous user scan...");
        onSuccessfulScan(businessId, new Date().getTime(), defaultStamps);
        setScanResult({
          success: true,
          message: `Successfully scanned! ${defaultStamps} stamp(s) added to your loyalty card.`,
        });
      }
    } catch (err) {
      console.error("❌ Unexpected error in QR processing:", err);
      handleInvalidQR("Could not process QR code data. Please try again.");
    } finally {
      setProcessingQr(false);
    }
  };

  const startScanner = async () => {
    if (!html5QrCode || !deviceInfo || !scannerInitialized.current) return;

    setScanning(true);
    setScanResult(null);
    setRetryCount(0);

    const configurations = getCameraConfigurations(deviceInfo);
    const constraints = getCameraConstraints(deviceInfo);

    let scannerStarted = false;
    let lastError: any = null;

    console.log(`📱 Attempting to start scanner on ${deviceInfo.browser} ${deviceInfo.version}`);

    for (let configIndex = 0; configIndex < configurations.length; configIndex++) {
      for (let constraintIndex = 0; constraintIndex < constraints.length; constraintIndex++) {
        try {
          console.log(`🔄 Trying config ${configIndex + 1}/${configurations.length}, constraint ${constraintIndex + 1}/${constraints.length}`);
          
          await html5QrCode.start(
            constraints[constraintIndex],
            configurations[configIndex],
            onQRCodeSuccess,
            onQRCodeError
          );
          
          scannerStarted = true;
          console.log("✅ Scanner started successfully");
          break;
        } catch (err) {
          console.error(`❌ Scanner config ${configIndex + 1}/${configurations.length} failed:`, err);
          lastError = err;
          
          if (html5QrCode.isScanning) {
            try {
              await html5QrCode.stop();
            } catch (stopErr) {
              console.error("Error stopping scanner after failed start:", stopErr);
            }
          }
        }
      }
      
      if (scannerStarted) break;
    }

    if (!scannerStarted) {
      console.error("❌ All scanner configurations failed, switching to fallback");
      setScanning(false);
      setFallbackMode('file');
      
      let errorMessage = "Camera access failed. ";
      if (deviceInfo.isIOS && deviceInfo.isSafari) {
        errorMessage += "iOS Safari requires HTTPS and camera permissions. Please check your settings.";
      } else if (deviceInfo.isAndroid) {
        errorMessage += "Please ensure camera permissions are granted and try again.";
      } else {
        errorMessage += "Please try using file upload instead.";
      }
      
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
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
    stopScanner();
    await processQRData(decodedText);
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
    // Silent - this fires constantly during scanning
  };

  const handleFileUpload = async (dataUrl: string) => {
    try {
      setProcessingQr(true);
      console.log("📁 Processing uploaded QR code image");
      
      if (html5QrCode) {
        const result = await html5QrCode.scanFile(dataUrl, true);
        await processQRData(result);
      }
    } catch (err) {
      console.error("❌ Error processing uploaded file:", err);
      handleInvalidQR("Could not read QR code from the uploaded image. Please try again with a clearer image.");
    }
  };

  const handleManualInput = async () => {
    if (!manualInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter the QR code data",
        variant: "destructive"
      });
      return;
    }
    
    await processQRData(manualInput.trim());
  };

  if (!deviceInfo) {
    return (
      <Card className="p-6 bg-white card-shadow">
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin mr-2" size={18} />
          <span>Detecting device capabilities...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white card-shadow">
      <h3 className="text-xl font-semibold text-coffee-dark mb-4 flex items-center gap-2">
        <Camera size={24} className="text-orange" />
        Scan Business QR Code
      </h3>

      {deviceInfo && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Smartphone size={16} />
            <span>{deviceInfo.browser} on {deviceInfo.isMobile ? 'Mobile' : 'Desktop'}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-4">
        {fallbackMode === 'camera' && (
          <>
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
          </>
        )}

        {fallbackMode === 'file' && (
          <div className="w-full max-w-sm">
            <div className="text-center mb-4">
              <Upload size={48} className="mx-auto text-orange mb-2" />
              <p className="text-coffee-medium">Upload QR Code Image</p>
            </div>
            <FileUpload
              onFileUploaded={handleFileUpload}
              accept="image/*"
              label="Choose QR Code Image"
              className="w-full"
            />
          </div>
        )}

        {fallbackMode === 'manual' && (
          <div className="w-full max-w-sm">
            <div className="text-center mb-4">
              <p className="text-coffee-medium">Enter QR Code Data Manually</p>
            </div>
            <div className="space-y-3">
              <textarea
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Paste QR code JSON data here..."
                className="w-full p-3 border rounded-lg resize-none"
                rows={4}
              />
              <Button
                onClick={handleManualInput}
                className="w-full bg-orange hover:bg-orange-light"
                disabled={!manualInput.trim()}
              >
                Process QR Data
              </Button>
            </div>
          </div>
        )}

        <div className="flex gap-2 flex-wrap justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFallbackMode('camera')}
            disabled={!deviceInfo.supportsCamera}
          >
            <Camera size={16} className="mr-1" />
            Camera
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFallbackMode('file')}
          >
            <Upload size={16} className="mr-1" />
            Upload
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFallbackMode('manual')}
          >
            Manual
          </Button>
        </div>

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
              if (fallbackMode === 'camera') {
                startScanner();
              }
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

export default EnhancedQRScanner;
