
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, X } from "lucide-react";

interface WelcomeStampsMessageProps {
  stampsAwarded: number;
  onDismiss: () => void;
}

const WelcomeStampsMessage: React.FC<WelcomeStampsMessageProps> = ({ 
  stampsAwarded, 
  onDismiss 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss after 10 seconds
    const timer = setTimeout(() => {
      handleDismiss();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Allow animation to complete
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
      <Card className="p-6 bg-green-50 border-green-200 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Gift className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">
                Welcome to our loyalty program! 🎉
              </h3>
              <p className="text-green-700">
                You've earned {stampsAwarded} welcome stamp{stampsAwarded !== 1 ? 's' : ''}!
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-green-600 hover:text-green-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default WelcomeStampsMessage;
