
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Download, AlertTriangle } from "lucide-react";
import QRCode from "react-qr-code";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Helper to generate a numeric unique ID (10 digits) from a UUID
function uuidToNumericId(uuid: string): string {
  // Use a hash of the UUID, mod to fit 10 digits.
  let num = 0;
  for (let i = 0; i < uuid.length; i++) {
    num = ((num << 5) - num) + uuid.charCodeAt(i);
    num = num & num; // Convert to 32bit integer
  }
  // Ensure positive and pad to 10 digits
  num = Math.abs(num) % 1_000_000_0000;
  return num.toString().padStart(10, "0");
}

interface QRCodeGeneratorProps {
  onGenerate?: (codeData: string) => void;
  businessId: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ onGenerate, businessId }) => {
  const { toast } = useToast();
  const [qrValue, setQrValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [businessNumericId, setBusinessNumericId] = useState<string>("");

  useEffect(() => {
    if (!businessId || businessId.trim() === "") {
      setError("Business ID is required to generate a QR code");
      return;
    }

    // Compute numeric unique business ID
    const numericId = uuidToNumericId(businessId);
    setBusinessNumericId(numericId);

    // Business QR code embeds both UUID and numeric id
    const qrData = {
      type: "business_stamp",
      businessId: businessId,
      businessNumericId: numericId
    };
    try {
      const qrValue = JSON.stringify(qrData);
      setQrValue(qrValue);
      setError(null);

      if (onGenerate) {
        onGenerate(qrValue);
      }
    } catch (error) {
      setError("Could not generate QR code. Please try again.");
      toast({
        title: "QR Code Error",
        description: "Could not generate QR code. Please try again.",
        variant: "destructive",
      });
    }
    // eslint-disable-next-line
  }, [businessId, onGenerate, toast]);

  const downloadQRCode = () => {
    if (error) {
      toast({
        title: "Cannot Download QR Code",
        description: "Please fix the errors before downloading.",
        variant: "destructive",
      });
      return;
    }

    if (!qrCodeRef.current) {
      toast({
        title: "Download Failed",
        description: "Could not download the QR code. Please try again.",
        variant: "destructive",
      });
      return;
    }
    try {
      const svg = qrCodeRef.current.querySelector('svg');
      if (!svg) {
        toast({
          title: "Download Failed",
          description: "Could not find the QR code. Please try again.",
          variant: "destructive",
        });
        return;
      }
      const canvas = document.createElement("canvas");
      const box = svg.getBoundingClientRect();
      canvas.width = box.width;
      canvas.height = box.height;
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const blobUrl = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        const context = canvas.getContext("2d");
        if (!context) {
          toast({
            title: "Download Failed",
            description: "Could not process the QR code. Please try again.",
            variant: "destructive",
          });
          URL.revokeObjectURL(blobUrl);
          return;
        }
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `business-qrcode-${businessNumericId}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(blobUrl);
        toast({
          title: "QR Code Downloaded",
          description: "The QR code has been downloaded to your device.",
        });
      };
      img.src = blobUrl;
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download the QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 bg-white card-shadow">
      <h3 className="text-xl font-semibold text-coffee-dark mb-4 flex items-center gap-2">
        <QrCode size={24} className="text-orange" />
        Business QR Code
      </h3>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col items-center mt-6 space-y-4">
        {!error && (
          <div className="p-4 bg-white rounded-lg" ref={qrCodeRef}>
            <QRCode 
              id="qr-code"
              value={qrValue}
              size={200}
            />
            {/* Numeric Business ID visible under the QR */}
            <div className="flex justify-center mt-3">
              <span
                className="inline-block bg-gray-700 text-white px-4 py-1 rounded-full text-xs tracking-widest font-semibold shadow"
                style={{ letterSpacing: "0.2em" }}
              >
                ID : {businessNumericId}
              </span>
            </div>
          </div>
        )}
        <Button
          onClick={downloadQRCode}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          disabled={!!error}
        >
          <Download size={18} />
          Download QR Code
        </Button>
      </div>
    </Card>
  );
};

export default QRCodeGenerator;
