
import { useState, useEffect, useRef } from "react";
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
  const qrCodeRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // Generate a static QR code with fixed data
    const staticQRData = {
      customer: "Business QR",
      stamps: 1,
      businessId: "cafe-loyalty-app-123",
      timestamp: 1680000000000, // Fixed timestamp (April 2023)
    };

    const qrValue = JSON.stringify(staticQRData);
    setQrValue(qrValue);

    if (onGenerate) {
      onGenerate(qrValue);
    }
  }, []); // Only run once on initial mount
  
  const downloadQRCode = () => {
    // Check if the SVG element is available
    if (!qrCodeRef.current) {
      toast({
        title: "Download Failed",
        description: "Could not download the QR code. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      const svg = qrCodeRef.current;
      const box = svg.getBoundingClientRect();
      
      // Set canvas dimensions
      canvas.width = box.width;
      canvas.height = box.height;
      
      // Convert SVG to string
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      
      const URL = window.URL || window.webkitURL || window;
      const blobUrl = URL.createObjectURL(svgBlob);
      
      // Create image from SVG blob
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
        
        // Draw image to canvas
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
        
        // Convert canvas to PNG
        const pngUrl = canvas.toDataURL("image/png");
        
        // Create download link
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `business-qrcode-static.png`;
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
      console.error("Error downloading QR code:", error);
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

      <div className="flex flex-col items-center mt-6 space-y-4">
        <div className="p-4 bg-white rounded-lg">
          <QRCode 
            ref={qrCodeRef}
            id="qr-code" 
            value={qrValue} 
            size={200} 
          />
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
