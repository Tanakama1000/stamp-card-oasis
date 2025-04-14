
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Download } from "lucide-react";
import QRCode from "react-qr-code";
import { useToast } from "@/hooks/use-toast";

interface QRCodeGeneratorProps {
  onGenerate?: (codeData: string) => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ onGenerate }) => {
  const { toast } = useToast();
  const [qrValue, setQrValue] = useState<string>("");

  useEffect(() => {
    // Generate default QR code on component mount
    const defaultQRData = {
      customer: "Business QR",
      stamps: 0,
      businessId: "your-business-id",
      timestamp: Date.now(),
    };

    const qrValue = JSON.stringify(defaultQRData);
    setQrValue(qrValue);

    if (onGenerate) {
      onGenerate(qrValue);
    }
  }, []);
  
  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code-canvas');
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      toast({
        title: "Download Failed",
        description: "Could not download the QR code. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `business-qrcode-${Date.now()}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast({
      title: "QR Code Downloaded",
      description: "The QR code has been downloaded to your device.",
    });
  };

  return (
    <Card className="p-6 bg-white card-shadow">
      <h3 className="text-xl font-semibold text-coffee-dark mb-4 flex items-center gap-2">
        <QrCode size={24} className="text-orange" />
        Business QR Code
      </h3>

      <div className="flex flex-col items-center mt-6 space-y-4">
        <div className="p-4 bg-white rounded-lg">
          <QRCode id="qr-code-canvas" value={qrValue} size={200} />
        </div>
        
        <Button
          onClick={downloadQRCode}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <Download size={18} />
          Download QR Code
        </Button>
      </div>
    </Card>
  );
};

export default QRCodeGenerator;
