
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

interface ScanResultProps {
  result: { success: boolean; message: string };
  onScanAgain: () => void;
}

const ScanResult = ({ result, onScanAgain }: ScanResultProps) => {
  return (
    <>
      <Alert
        className={`${
          result.success ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50"
        } mt-4`}
      >
        {result.success ? (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        ) : (
          <XCircle className="h-4 w-4 text-red-500" />
        )}
        <AlertTitle>
          {result.success ? "Success!" : "Failed to scan"}
        </AlertTitle>
        <AlertDescription>{result.message}</AlertDescription>
      </Alert>

      <Button
        onClick={onScanAgain}
        variant="outline"
        className="mt-2"
      >
        Scan Again
      </Button>
    </>
  );
};

export default ScanResult;
