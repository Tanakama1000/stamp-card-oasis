
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LoyaltyCardConfig } from "../types/LoyaltyCardConfig";
import { ColorPresets } from "./ColorPresets";

interface ColorSettingsProps {
  config: LoyaltyCardConfig;
  onChange: (field: keyof LoyaltyCardConfig, value: any) => void;
}

export const ColorSettings = ({ config, onChange }: ColorSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cardBgColor">Card Background</Label>
          <div className="flex gap-2 items-center">
            <Input 
              id="cardBgColor"
              type="color"
              className="w-12 h-8 p-1"
              value={config.cardBgColor}
              onChange={(e) => onChange('cardBgColor', e.target.value)}
            />
            <Input 
              value={config.cardBgColor}
              onChange={(e) => onChange('cardBgColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="textColor">Default Text Color</Label>
          <div className="flex gap-2 items-center">
            <Input 
              id="textColor"
              type="color"
              className="w-12 h-8 p-1"
              value={config.textColor}
              onChange={(e) => onChange('textColor', e.target.value)}
            />
            <Input 
              value={config.textColor}
              onChange={(e) => onChange('textColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="businessNameColor">Business Name Color</Label>
          <div className="flex gap-2 items-center">
            <Input 
              id="businessNameColor"
              type="color"
              className="w-12 h-8 p-1"
              value={config.businessNameColor}
              onChange={(e) => onChange('businessNameColor', e.target.value)}
            />
            <Input 
              value={config.businessNameColor}
              onChange={(e) => onChange('businessNameColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="cardTitleColor">Card Title Color</Label>
          <div className="flex gap-2 items-center">
            <Input 
              id="cardTitleColor"
              type="color"
              className="w-12 h-8 p-1"
              value={config.cardTitleColor}
              onChange={(e) => onChange('cardTitleColor', e.target.value)}
            />
            <Input 
              value={config.cardTitleColor}
              onChange={(e) => onChange('cardTitleColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="stampBgColor">Stamp Background</Label>
          <div className="flex gap-2 items-center">
            <Input 
              id="stampBgColor"
              type="color"
              className="w-12 h-8 p-1"
              value={config.stampBgColor}
              onChange={(e) => onChange('stampBgColor', e.target.value)}
            />
            <Input 
              value={config.stampBgColor}
              onChange={(e) => onChange('stampBgColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="stampActiveColor">Active Stamp Color</Label>
          <div className="flex gap-2 items-center">
            <Input 
              id="stampActiveColor"
              type="color"
              className="w-12 h-8 p-1"
              value={config.stampActiveColor}
              onChange={(e) => onChange('stampActiveColor', e.target.value)}
            />
            <Input 
              value={config.stampActiveColor}
              onChange={(e) => onChange('stampActiveColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="rewardTextColor">Reward Text Color</Label>
          <div className="flex gap-2 items-center">
            <Input 
              id="rewardTextColor"
              type="color"
              className="w-12 h-8 p-1"
              value={config.rewardTextColor}
              onChange={(e) => onChange('rewardTextColor', e.target.value)}
            />
            <Input 
              value={config.rewardTextColor}
              onChange={(e) => onChange('rewardTextColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>
      
      <ColorPresets 
        onPresetSelect={(colors) => {
          Object.entries(colors).forEach(([key, value]) => {
            onChange(key as keyof LoyaltyCardConfig, value);
          });
        }}
      />
    </div>
  );
};
