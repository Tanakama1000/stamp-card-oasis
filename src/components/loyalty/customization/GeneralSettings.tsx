
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { LoyaltyCardConfig } from "../types/LoyaltyCardConfig";
import FileUpload from "../FileUpload";

interface GeneralSettingsProps {
  config: LoyaltyCardConfig;
  onChange: (field: keyof LoyaltyCardConfig, value: any) => void;
  onLogoUpload: (dataUrl: string) => void;
  onBackgroundUpload: (dataUrl: string) => void;
}

export const GeneralSettings = ({ 
  config, 
  onChange, 
  onLogoUpload, 
  onBackgroundUpload 
}: GeneralSettingsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="businessName">Business Name</Label>
        <Input 
          id="businessName"
          value={config.businessName}
          onChange={(e) => onChange('businessName', e.target.value)}
          placeholder="Your Business Name" 
        />
      </div>
      
      <div>
        <Label htmlFor="cardTitle">Card Title</Label>
        <Input 
          id="cardTitle"
          value={config.cardTitle}
          onChange={(e) => onChange('cardTitle', e.target.value)}
          placeholder="Loyalty Card" 
        />
      </div>
      
      <div>
        <Label htmlFor="rewardText">Reward Text</Label>
        <Input 
          id="rewardText"
          value={config.rewardText || `Collect ${config.maxStamps} stamps for a free item`}
          onChange={(e) => onChange('rewardText', e.target.value)}
          placeholder={`Collect ${config.maxStamps} stamps for a free item`} 
        />
      </div>
      
      <div>
        <Label>Business Logo</Label>
        {config.businessLogo && (
          <div className="mb-2 mt-1 p-2 border rounded-md">
            <img 
              src={config.businessLogo} 
              alt="Business Logo" 
              className="h-12 object-contain mx-auto" 
            />
          </div>
        )}
        <FileUpload 
          onFileUploaded={onLogoUpload}
          label="Upload Logo"
          accept="image/*"
        />
      </div>
      
      <div>
        <Label htmlFor="maxStamps">Maximum Stamps</Label>
        <div className="flex items-center gap-4">
          <Slider
            id="maxStamps"
            min={5}
            max={20}
            step={1}
            value={[config.maxStamps]}
            onValueChange={(value) => onChange('maxStamps', value[0])}
            className="flex-1"
          />
          <span className="w-12 text-center font-medium">{config.maxStamps}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Label htmlFor="useBackgroundImage">Use Background Image</Label>
        <Switch
          id="useBackgroundImage"
          checked={config.useBackgroundImage || false}
          onCheckedChange={(checked) => onChange('useBackgroundImage', checked)}
        />
      </div>
      
      {config.useBackgroundImage && (
        <div className="space-y-2">
          <Label>Card Background Image</Label>
          {config.backgroundImage && (
            <div className="mb-2 mt-1 p-2 border rounded-md">
              <img 
                src={config.backgroundImage} 
                alt="Background" 
                className="h-24 w-full object-cover rounded" 
              />
            </div>
          )}
          <FileUpload
            onFileUploaded={onBackgroundUpload}
            label="Upload Background"
            accept="image/*"
          />
        </div>
      )}
    </div>
  );
};
