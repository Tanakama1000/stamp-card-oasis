
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoyaltyCardConfig } from "../types/LoyaltyCardConfig";
import { STAMP_ICONS } from "../types";
import { useToast } from "@/hooks/use-toast";

interface StampSettingsProps {
  config: LoyaltyCardConfig;
  onChange: (field: keyof LoyaltyCardConfig, value: any) => void;
}

export const StampSettings = ({ config, onChange }: StampSettingsProps) => {
  const { toast } = useToast();

  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Stamp Icon</Label>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mt-2">
          {Object.keys(STAMP_ICONS).map((iconName) => {
            const IconComponent = STAMP_ICONS[iconName as keyof typeof STAMP_ICONS];
            return (
              <Button
                key={iconName}
                type="button"
                variant={config.stampIcon === iconName ? "default" : "outline"}
                className={`flex flex-col items-center justify-center p-2 h-16 w-16 border transition ring-offset-2 ${config.stampIcon === iconName ? 'bg-orange text-white scale-105 ring-2 ring-orange' : ''}`}
                onClick={() => onChange('stampIcon', iconName)}
                style={{ boxShadow: config.stampIcon === iconName ? "0 0 8px #F97316a0" : undefined, minWidth: 0 }}
                aria-label={iconName}
              >
                <IconComponent size={24} />
                <span className="text-xs mt-1 whitespace-nowrap truncate">{iconName.replace(/([A-Z])/g, ' $1').trim()}</span>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <Label htmlFor="lastStampText">Last Stamp Text</Label>
        <Input
          id="lastStampText"
          value={config.lastStampText || ''}
          onChange={(e) => {
            const value = e.target.value;
            if (countWords(value) <= 4 || value === '') {
              onChange('lastStampText', value);
            } else {
              toast({
                title: "Too many words",
                description: "Last stamp text cannot exceed 4 words",
                variant: "destructive"
              });
            }
          }}
          placeholder="FREE"
          className="mb-2"
        />
        <p className="text-sm text-gray-500 mb-4">Text for the last stamp (maximum 4 words)</p>

        <div>
          <Label htmlFor="lastStampTextColor">Last Stamp Text Color</Label>
          <div className="flex gap-2 items-center">
            <Input
              id="lastStampTextColor"
              type="color"
              className="w-12 h-8 p-1"
              value={config.lastStampTextColor || '#FFFFFF'}
              onChange={(e) => onChange('lastStampTextColor', e.target.value)}
            />
            <Input
              value={config.lastStampTextColor || '#FFFFFF'}
              onChange={(e) => onChange('lastStampTextColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="lastStampBorderColor">Last Stamp Border Color</Label>
          <div className="flex gap-2 items-center">
            <Input
              id="lastStampBorderColor"
              type="color"
              className="w-12 h-8 p-1"
              value={config.lastStampBorderColor || '#F97316'}
              onChange={(e) => onChange('lastStampBorderColor', e.target.value)}
            />
            <Input
              value={config.lastStampBorderColor || '#F97316'}
              onChange={(e) => onChange('lastStampBorderColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
