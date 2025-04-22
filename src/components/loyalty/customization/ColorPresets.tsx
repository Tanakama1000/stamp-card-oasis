
import { Button } from "@/components/ui/button";
import { LoyaltyCardConfig } from "../types/LoyaltyCardConfig";

interface ColorPresetsProps {
  onPresetSelect: (colors: Partial<LoyaltyCardConfig>) => void;
}

export const ColorPresets = ({ onPresetSelect }: ColorPresetsProps) => {
  return (
    <div className="mt-4 pt-4 border-t">
      <h3 className="text-sm font-medium mb-2">Color Presets</h3>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 bg-white text-coffee-dark border-coffee-light"
          onClick={() => onPresetSelect({
            cardBgColor: '#FFFFFF',
            textColor: '#6F4E37',
            businessNameColor: '#6F4E37',
            cardTitleColor: '#8B4513',
            stampBgColor: '#F5F5DC',
            stampActiveColor: '#8B4513',
            rewardTextColor: '#6F4E37',
            lastStampBorderColor: '#F97316',
          })}
        >
          <div className="w-3 h-3 rounded-full bg-white border"></div>
          Classic
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 bg-blue-50 text-blue-800 border-blue-200"
          onClick={() => onPresetSelect({
            cardBgColor: '#EFF6FF',
            textColor: '#1E40AF',
            businessNameColor: '#1E3A8A',
            cardTitleColor: '#2563EB',
            stampBgColor: '#BFDBFE',
            stampActiveColor: '#3B82F6',
            rewardTextColor: '#1E40AF',
            lastStampBorderColor: '#2563EB',
          })}
        >
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          Blue
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 bg-green-50 text-green-800 border-green-200"
          onClick={() => onPresetSelect({
            cardBgColor: '#ECFDF5',
            textColor: '#065F46',
            businessNameColor: '#064E3B',
            cardTitleColor: '#10B981',
            stampBgColor: '#A7F3D0',
            stampActiveColor: '#10B981',
            rewardTextColor: '#065F46',
            lastStampBorderColor: '#10B981',
          })}
        >
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          Green
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 bg-purple-50 text-purple-800 border-purple-200"
          onClick={() => onPresetSelect({
            cardBgColor: '#F5F3FF',
            textColor: '#5B21B6',
            businessNameColor: '#4C1D95',
            cardTitleColor: '#8B5CF6',
            stampBgColor: '#DDD6FE',
            stampActiveColor: '#8B5CF6',
            rewardTextColor: '#5B21B6',
            lastStampBorderColor: '#8B5CF6',
          })}
        >
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          Purple
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 bg-orange-50 text-orange-800 border-orange-200"
          onClick={() => onPresetSelect({
            cardBgColor: '#FFF7ED',
            textColor: '#9A3412',
            businessNameColor: '#7C2D12',
            cardTitleColor: '#F97316',
            stampBgColor: '#FFEDD5',
            stampActiveColor: '#F97316',
            rewardTextColor: '#9A3412',
            lastStampBorderColor: '#F97316',
          })}
        >
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          Orange
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 bg-gray-900 text-gray-200 border-gray-700"
          onClick={() => onPresetSelect({
            cardBgColor: '#1F2937',
            textColor: '#F3F4F6',
            businessNameColor: '#F9FAFB',
            cardTitleColor: '#60A5FA',
            stampBgColor: '#374151',
            stampActiveColor: '#60A5FA',
            rewardTextColor: '#F3F4F6',
            lastStampBorderColor: '#60A5FA',
          })}
        >
          <div className="w-3 h-3 rounded-full bg-gray-800"></div>
          Dark
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 bg-red-50 text-red-800 border-red-200"
          onClick={() => onPresetSelect({
            cardBgColor: '#FEF2F2',
            textColor: '#991B1B',
            businessNameColor: '#7F1D1D',
            cardTitleColor: '#EF4444',
            stampBgColor: '#FEE2E2',
            stampActiveColor: '#EF4444',
            rewardTextColor: '#991B1B',
            lastStampBorderColor: '#EF4444',
          })}
        >
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          Red
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 bg-pink-50 text-pink-800 border-pink-200"
          onClick={() => onPresetSelect({
            cardBgColor: '#FDF2F8',
            textColor: '#9D174D',
            businessNameColor: '#831843',
            cardTitleColor: '#EC4899',
            stampBgColor: '#FCE7F3',
            stampActiveColor: '#EC4899',
            rewardTextColor: '#9D174D',
            lastStampBorderColor: '#EC4899',
          })}
        >
          <div className="w-3 h-3 rounded-full bg-pink-500"></div>
          Pink
        </Button>
      </div>
    </div>
  );
};
