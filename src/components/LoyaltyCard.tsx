
import { useState, useEffect } from "react";
import { Coffee } from "lucide-react";
import { Card } from "@/components/ui/card";

interface LoyaltyCardProps {
  customerName: string;
  maxStamps: number;
  currentStamps: number;
  onStampCollected?: () => void;
}

const LoyaltyCard: React.FC<LoyaltyCardProps> = ({
  customerName,
  maxStamps = 10,
  currentStamps = 0,
  onStampCollected,
}) => {
  const [stamps, setStamps] = useState<number>(currentStamps);
  const [animatingStamp, setAnimatingStamp] = useState<number | null>(null);

  useEffect(() => {
    setStamps(currentStamps);
  }, [currentStamps]);

  const handleStampClick = (index: number) => {
    if (index === stamps && stamps < maxStamps) {
      setAnimatingStamp(index);
      setTimeout(() => {
        setAnimatingStamp(null);
        setStamps(stamps + 1);
        if (onStampCollected) {
          onStampCollected();
        }
      }, 500);
    }
  };

  const renderStamps = () => {
    const rows = [];
    const stampsPerRow = 5;
    const rowCount = Math.ceil(maxStamps / stampsPerRow);

    for (let i = 0; i < rowCount; i++) {
      const stampRow = [];
      for (let j = 0; j < stampsPerRow; j++) {
        const stampIndex = i * stampsPerRow + j;
        if (stampIndex < maxStamps) {
          stampRow.push(
            <div
              key={stampIndex}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center cursor-pointer transition-all stamp-shadow
                ${
                  stampIndex < stamps
                    ? "bg-coffee-medium text-white"
                    : "bg-cream border border-coffee-light text-coffee-light"
                }
                ${
                  stampIndex === animatingStamp
                    ? "stamp-animation"
                    : ""
                }
                ${
                  stampIndex === stamps && stamps < maxStamps
                    ? "hover:bg-orange-light hover:text-white pulse"
                    : ""
                }
              `}
              onClick={() => handleStampClick(stampIndex)}
              title={stampIndex < stamps ? "Collected" : stampIndex === stamps ? "Collect stamp" : "Future stamp"}
            >
              <Coffee size={24} />
            </div>
          );
        }
      }
      rows.push(
        <div key={i} className="flex justify-center gap-3">
          {stampRow}
        </div>
      );
    }
    return rows;
  };

  const rewardProgress = Math.min((stamps / maxStamps) * 100, 100);

  return (
    <Card className="bg-white p-6 card-shadow overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-medium text-coffee-dark">{customerName}'s Card</h3>
          <p className="text-sm text-coffee-light">
            Collect {maxStamps} stamps for a free item
          </p>
        </div>
        <div className="h-12 w-12 rounded-full bg-orange flex items-center justify-center text-white font-bold">
          {stamps}/{maxStamps}
        </div>
      </div>

      <div className="relative h-2 bg-cream rounded-full mb-6">
        <div
          className="absolute top-0 left-0 h-2 bg-orange rounded-full transition-all duration-500"
          style={{ width: `${rewardProgress}%` }}
        />
      </div>

      <div className="flex flex-col gap-3">{renderStamps()}</div>

      {stamps >= maxStamps && (
        <div className="mt-6 p-3 bg-orange-light text-white text-center rounded-lg animate-pulse">
          <p className="font-bold">Congratulations! You've earned a reward!</p>
          <p className="text-sm">Show this to a staff member to claim.</p>
        </div>
      )}
    </Card>
  );
};

export default LoyaltyCard;
