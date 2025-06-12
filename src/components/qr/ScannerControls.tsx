
import { Button } from "@/components/ui/button";
import { Loader2, Camera, CameraOff } from "lucide-react";

interface ScannerControlsProps {
  scanning: boolean;
  processingQr: boolean;
  onStartScanner: () => void;
  onStopScanner: () => void;
}

const ScannerControls = ({ scanning, processingQr, onStartScanner, onStopScanner }: ScannerControlsProps) => {
  return (
    <>
      {!scanning && (
        <Button
          onClick={onStartScanner}
          className="bg-orange hover:bg-orange-light transition-colors"
        >
          <Camera className="mr-2" size={18} />
          Start Scanner
        </Button>
      )}

      {scanning && (
        <Button
          onClick={onStopScanner}
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
    </>
  );
};

export default ScannerControls;
