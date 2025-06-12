
import { Card } from "@/components/ui/card";
import { Sparkles, Gift } from "lucide-react";

interface RewardsOverviewProps {
  maxStamps: number;
  stamps: number;
  sortedRewards: Array<{ stampNumber: number; description: string }>;
}

const RewardsOverview = ({ maxStamps, stamps, sortedRewards }: RewardsOverviewProps) => {
  return (
    <Card className="bg-gradient-to-r from-coffee-light to-orange p-6 mb-8 text-white">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles size={24} className="text-cream" />
        <h2 className="text-xl font-semibold">Your Loyalty Rewards</h2>
      </div>
      <p className="mb-4">Collect {maxStamps} stamps to earn a free item of your choice!</p>
      
      {sortedRewards.length > 0 && (
        <div className="mb-4 p-3 bg-white/10 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Progress Rewards:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sortedRewards.map((reward, idx) => (
              <div key={idx} className="flex items-center gap-1 text-sm">
                <Gift size={14} className={stamps >= reward.stampNumber ? "text-yellow-300" : ""} />
                <span>
                  Stamp {reward.stampNumber}: {reward.description}
                  {stamps >= reward.stampNumber && " (Unlocked!)"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
          {maxStamps - stamps} stamps to go!
        </div>
        {stamps >= maxStamps && (
          <div className="text-sm bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
            <Gift size={14} />
            Reward Ready!
          </div>
        )}
      </div>
    </Card>
  );
};

export default RewardsOverview;
