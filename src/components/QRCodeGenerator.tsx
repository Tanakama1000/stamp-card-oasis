
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import QRCode from "react-qr-code";
import { Download, QrCode } from "lucide-react";

interface QRCodeGeneratorProps {
  onGenerate?: (codeData: string) => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ onGenerate }) => {
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState<string>("");
  const [stampCount, setStampCount] = useState<number>(1);
  const [qrValue, setQrValue] = useState<string>("");
  const [qrGenerated, setQrGenerated] = useState<boolean>(true);

  useEffect(() => {
    // Generate default QR code on component mount
    const defaultName = "New Customer";
    const defaultStamps = 1;
    generateQRCode(defaultName, defaultStamps);
  }, []);

  const generateQRCode = (name: string, stamps: number) => {
    const qrData = {
      customer: name.trim() || "New Customer",
      stamps: stamps,
      businessId: "your-business-id", // This would normally come from auth or context
      timestamp: Date.now(),
    };

    const qrValue = JSON.stringify(qrData);
    setQrValue(qrValue);
    setQrGenerated(true);

    if (onGenerate) {
      onGenerate(qrValue);
    }
  };

  const handleGenerate = () => {
    if (!customerName.trim()) {
      toast({
        title: "Customer Name Required",
        description: "Please enter a customer name to generate a QR code.",
        variant: "destructive",
      });
      return;
    }

    generateQRCode(customerName, stampCount);
    
    toast({
      title: "QR Code Generated",
      description: `QR code for ${customerName} created. Scan with the customer app to add ${stampCount} stamp${stampCount > 1 ? 's' : ''}.`,
    });
  };
  
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
    downloadLink.download = `qrcode-${customerName.replace(/\s+/g, '-') || 'customer'}-${Date.now()}.png`;
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
        Generate QR Code
      </h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="customer-name" className="block text-sm font-medium text-coffee-dark mb-1">
            Customer Name
          </label>
          <Input
            id="customer-name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
            className="border-coffee-light"
          />
        </div>

        <div>
          <label htmlFor="stamp-count" className="block text-sm font-medium text-coffee-dark mb-1">
            Number of Stamps
          </label>
          <Select
            value={String(stampCount)}
            onValueChange={(value) => setStampCount(parseInt(value))}
          >
            <SelectTrigger id="stamp-count" className="border-coffee-light">
              <SelectValue placeholder="Select stamp count" />
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
          onClick={handleGenerate}
          className="w-full bg-coffee-medium hover:bg-coffee-dark"
        >
          Generate QR Code
        </Button>

        {qrGenerated && (
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
        )}
      </div>
    </Card>
  );
};

export default QRCodeGenerator;
