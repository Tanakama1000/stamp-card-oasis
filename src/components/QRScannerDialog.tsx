
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
          <DialogTitle className="text-center text-2xl text-blue-500 font-bold">
            Scan Business QR Code
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-4">
          {!showScanner ? (
            <div className="text-center">
              <div className="w-48 h-48 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="4" width="6" height="6" rx="1" stroke="#3B82F6" strokeWidth="2"/>
                  <rect x="14" y="4" width="6" height="6" rx="1" stroke="#3B82F6" strokeWidth="2"/>
                  <rect x="4" y="14" width="6" height="6" rx="1" stroke="#3B82F6" strokeWidth="2"/>
                  <path d="M14 14H16V16H14V14Z" fill="#3B82F6"/>
                  <path d="M16 16H18V18H16V16Z" fill="#3B82F6"/>
                  <path d="M18 14H20V16H18V14Z" fill="#3B82F6"/>
                  <path d="M16 18H18V20H16V18Z" fill="#3B82F6"/>
                  <path d="M14 16H16V18H14V16Z" fill="#3B82F6"/>
                  <path d="M18 16H20V18H18V16Z" fill="#3B82F6"/>
                  <path d="M18 18H20V20H18V18Z" fill="#3B82F6"/>
                </svg>
              </div>
              <p className="text-blue-600 mb-6">
                Scan a business QR code to collect a stamp
              </p>
              <Button 
                onClick={() => setShowScanner(true)} 
                className="bg-blue-500 hover:bg-blue-600 text-white"
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
