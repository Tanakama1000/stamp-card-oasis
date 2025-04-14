
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { STAMP_ICONS } from "./constants";
import { RewardItemProps } from "./types";

const RewardItem: React.FC<RewardItemProps> = ({ 
  reward, 
  index, 
  maxStamps, 
  rewards, 
  onChange,
  onRemove 
}) => {
  const updateReward = (field: keyof typeof reward, value: any) => {
    const newRewards = [...rewards];
    newRewards[index] = {
      ...newRewards[index],
      [field]: value
    };
    onChange(newRewards);
  };

  return (
    <div className="flex gap-2 items-end border border-cream rounded-md p-3">
      <div className="flex-1 space-y-2">
        <div>
          <label className="text-sm font-medium">Stamp Number</label>
          <Select
            value={reward.stampNumber.toString()}
            onValueChange={(val) => updateReward('stampNumber', parseInt(val))}
          >
            <SelectTrigger className="border-coffee-light">
              <SelectValue placeholder="Select stamp" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(maxStamps)].map((_, i) => (
                <SelectItem 
                  key={i} 
                  value={(i + 1).toString()}
                  disabled={rewards.some((r, idx) => 
                    idx !== index && r.stampNumber === i + 1
                  )}
                >
                  Stamp {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium">Reward Description</label>
          <Input
            placeholder="e.g., Free Cookie"
            value={reward.description}
            onChange={(e) => updateReward('description', e.target.value)}
            className="border-coffee-light"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Reward Icon</label>
          <div className="grid grid-cols-4 gap-2">
            {STAMP_ICONS.map((stampIcon) => {
              const Icon = stampIcon.icon;
              return (
                <div 
                  key={stampIcon.name}
                  onClick={() => updateReward('icon', stampIcon.name)}
                  className={`p-2 rounded-md cursor-pointer flex flex-col items-center justify-center gap-1 text-xs transition-all ${
                    reward.icon === stampIcon.name 
                      ? 'bg-orange text-white' 
                      : 'bg-cream hover:bg-cream-light'
                  }`}
                >
                  <Icon size={16} />
                  <span>{stampIcon.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onRemove(index)}
        className="text-red-500 hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 size={18} />
      </Button>
    </div>
  );
};

export default RewardItem;
