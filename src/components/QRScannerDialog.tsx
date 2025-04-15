
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import QRScanner from "@/components/QRScanner";

interface QRScannerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessfulScan: (businessId: string, timestamp: number, stamps?: number) => void;
}

const QRScannerDialog = ({ isOpen, onClose, onSuccessfulScan }: QRScannerDialogProps) => {
  const [showScanner, setShowScanner] = useState<boolean>(false);
  
  const handleScan = (businessId: string, timestamp: number, stamps?: number) => {
    onSuccessfulScan(businessId, timestamp, stamps);
    // After successful scanning, close dialog after a brief delay
    setTimeout(() => {
      setShowScanner(false);
      onClose();
    }, 2000);
  };
  
  const handleClose = () => {
    setShowScanner(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-coffee-dark font-bold">
            Scan Business QR Code
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-4">
          {!showScanner ? (
            <div className="text-center">
              <div className="w-48 h-48 mx-auto bg-cream-light rounded-lg flex items-center justify-center mb-6">
                <img 
                  src="/lovable-uploads/7520843f-cdff-4e16-9a69-f1da892db604.png" 
                  alt="InStamp Logo" 
                  className="h-24 w-24"
                />
              </div>
              <p className="text-coffee-medium mb-6">
                Scan a business QR code to collect a stamp
              </p>
              <Button 
                onClick={() => setShowScanner(true)} 
                className="bg-orange hover:bg-orange-light text-white"
              >
                <Camera className="mr-2" size={18} />
                Start Camera
              </Button>
            </div>
          ) : (
            <div className="w-full">
              <QRScanner onSuccessfulScan={handleScan} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRScannerDialog;
