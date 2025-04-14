
import { useState } from "react";
import QRCode from "react-qr-code";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, Download, Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRCodeGeneratorProps {
  onGenerate?: (code: string) => void;
  businessId?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ onGenerate, businessId = "coffee-oasis-123" }) => {
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState<string>("");
  const [stampValue, setStampValue] = useState<string>("1");
  const [qrValue, setQrValue] = useState<string>("");
  const [qrKey, setQrKey] = useState<number>(0);

  const generateQRCode = () => {
    // We no longer require customer name for business QR generation
    const qrData = JSON.stringify({
      businessId: businessId,
      timestamp: new Date().getTime(),
      stamps: parseInt(stampValue),
      // We still include customer if provided, but it's optional now
      ...(customerName && { customer: customerName }),
    });

    setQrValue(qrData);
    if (onGenerate) {
      onGenerate(qrData);
    }
    
    toast({
      title: "QR Code Generated",
      description: "Let customers scan this code to collect stamps.",
    });
  };

  const regenerateQRCode = () => {
    setQrKey(prev => prev + 1);
    generateQRCode();
  };

  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      
      const downloadLink = document.createElement("a");
      downloadLink.download = `business-qrcode.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      
      toast({
        title: "QR Code Downloaded",
        description: "You can print this image or display it on a screen."
      });
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const copyQRData = () => {
    if (qrValue) {
      navigator.clipboard.writeText(qrValue);
      toast({
        title: "QR Data Copied",
        description: "QR code data copied to clipboard"
      });
    }
  };

  return (
    <Card className="p-6 bg-white card-shadow">
      <h3 className="text-xl font-semibold text-coffee-dark mb-4 flex items-center gap-2">
        <QrCode size={24} className="text-orange" />
        Business QR Code Generator
      </h3>

      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="businessId" className="block text-sm font-medium text-coffee-light mb-1">
            Business ID
          </label>
          <Input
            id="businessId"
            value={businessId}
            disabled
            className="border-coffee-light bg-cream-light"
          />
          <p className="text-xs text-coffee-light mt-1">This is your unique business identifier</p>
        </div>

        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-coffee-light mb-1">
            Customer Name (Optional)
          </label>
          <Input
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name (optional)"
            className="border-coffee-light focus:border-orange"
          />
        </div>

        <div>
          <label htmlFor="stampValue" className="block text-sm font-medium text-coffee-light mb-1">
            Number of Stamps
          </label>
          <Select value={stampValue} onValueChange={setStampValue}>
            <SelectTrigger className="border-coffee-light focus:border-orange">
              <SelectValue placeholder="Select stamps" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Stamp</SelectItem>
              <SelectItem value="2">2 Stamps</SelectItem>
              <SelectItem value="3">3 Stamps</SelectItem>
              <SelectItem value="5">5 Stamps</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={generateQRCode} 
          className="bg-orange hover:bg-orange-light transition-colors"
        >
          Generate Business QR Code
        </Button>

        {qrValue && (
          <div className="mt-4 flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <QRCode
                id="qr-code"
                key={qrKey}
                value={qrValue}
                size={200}
                bgColor="#FFFFFF"
                fgColor="#6F4E37"
                level="H"
              />
            </div>
            <p className="text-xs text-coffee-light mt-2 text-center">
              This QR code expires in 5 minutes for security
            </p>
            <div className="mt-4 flex gap-2">
              <Button onClick={downloadQRCode} variant="outline" className="flex items-center gap-1">
                <Download size={16} />
                Download
              </Button>
              <Button onClick={copyQRData} variant="outline" className="flex items-center gap-1">
                <Copy size={16} />
                Copy Data
              </Button>
              <Button onClick={regenerateQRCode} variant="outline" className="flex items-center gap-1">
                <RefreshCw size={16} />
                Refresh
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default QRCodeGenerator;
