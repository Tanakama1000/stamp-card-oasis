
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CooldownInfo, formatCooldownTime } from "@/utils/cooldownUtils";

interface TestStampButtonProps {
  businessData: any;
  cooldownInfo: CooldownInfo;
  onStampCollected: () => void;
}

const TestStampButton = ({ businessData, cooldownInfo, onStampCollected }: TestStampButtonProps) => {
  const getStampButtonText = () => {
    if (cooldownInfo.isInCooldown) {
      return `Wait ${formatCooldownTime(cooldownInfo.remainingSeconds)} to collect again`;
    }
    return "Collect Stamp";
  };

  return (
    <div className="mb-8">
      <Card className="p-4 bg-white card-shadow">
        <h3 className="font-semibold text-coffee-dark mb-3">Test Stamp Collection</h3>
        <p className="text-sm text-gray-600 mb-3">
          Click to manually collect a stamp (with {businessData?.cooldown_minutes || 2} minute cooldown)
        </p>
        <Button
          onClick={onStampCollected}
          disabled={cooldownInfo.isInCooldown}
          className={`w-full ${
            cooldownInfo.isInCooldown ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{ 
            backgroundColor: cooldownInfo.isInCooldown ? '#9CA3AF' : undefined
          }}
        >
          {getStampButtonText()}
        </Button>
      </Card>
    </div>
  );
};

export default TestStampButton;
