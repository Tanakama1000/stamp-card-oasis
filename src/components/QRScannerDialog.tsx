
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EnhancedQRScanner from "@/components/EnhancedQRScanner";

interface QRScannerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessfulScan: (businessId: string, timestamp: number, stamps?: number) => void;
}

const QRScannerDialog = ({ isOpen, onClose, onSuccessfulScan }: QRScannerDialogProps) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-ocean-dark font-bold">
            Scan Business QR Code
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-4">
          <div className="w-full">
            <EnhancedQRScanner onSuccessfulScan={onSuccessfulScan} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRScannerDialog;
