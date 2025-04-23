
import { Button } from "@/components/ui/button";
import { LoyaltyCardConfig } from "../types/LoyaltyCardConfig";

interface ColorPresetsProps {
  onPresetSelect: (colors: Partial<LoyaltyCardConfig>) => void;
}

export const ColorPresets = ({ onPresetSelect }: ColorPresetsProps) => {
  // When a color preset is selected, also update the lastStampTextColor to match the rewardTextColor for better harmony,
  // default to #FFFFFF if not set for "Dark" theme, or set to rewardTextColor for other themes.

  const handlePresetSelect = (preset: Partial<LoyaltyCardConfig>) => {
    // If present, rewardTextColor will be used for lastStampTextColor.
    // If a dark theme, set lastStampTextColor to #FFFFFF unless preset says otherwise.
    let lastStampTextColor = preset.rewardTextColor || "#FFFFFF";
    // For very dark card backgrounds, force white last stamp text
    if (
      preset.cardBgColor &&
      (
        preset.cardBgColor === "#1F2937" || // Dark
        preset.cardBgColor === "#403E43"    // Charcoal
      )
    ) {
      lastStampTextColor = "#FFFFFF";
    }
    onPresetSelect({
      ...preset,
      lastStampTextColor,
    });
  };

  return (
    <div className="mt-4 pt-4 border-t">
      <h3 className="text-sm font-medium mb-2">Color Presets</h3>
      <div className="flex flex-wrap gap-2">

        {/* Classic */}
        <Button
          variant="outline" size="sm"
          className="flex items-center gap-1 bg-white text-coffee-dark border-coffee-light"
          onClick={() => handlePresetSelect({
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
        {/* Blue */}
        <Button
          variant="outline" size="sm"
          className="flex items-center gap-1 bg-blue-50 text-blue-800 border-blue-200"
          onClick={() => handlePresetSelect({
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
        {/* Green */}
        <Button
          variant="outline" size="sm"
          className="flex items-center gap-1 bg-green-50 text-green-800 border-green-200"
          onClick={() => handlePresetSelect({
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
        {/* Purple */}
        <Button
          variant="outline" size="sm"
          className="flex items-center gap-1 bg-purple-50 text-purple-800 border-purple-200"
          onClick={() => handlePresetSelect({
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
        {/* Orange */}
        <Button
          variant="outline" size="sm"
          className="flex items-center gap-1 bg-orange-50 text-orange-800 border-orange-200"
          onClick={() => handlePresetSelect({
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
        {/* Dark */}
        <Button
          variant="outline" size="sm"
          className="flex items-center gap-1 bg-gray-900 text-gray-200 border-gray-700"
          onClick={() => handlePresetSelect({
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
        {/* Red */}
        <Button
          variant="outline" size="sm"
          className="flex items-center gap-1 bg-red-50 text-red-800 border-red-200"
          onClick={() => handlePresetSelect({
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
        {/* Pink */}
        <Button
          variant="outline" size="sm"
          className="flex items-center gap-1 bg-pink-50 text-pink-800 border-pink-200"
          onClick={() => handlePresetSelect({
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
        {/* Sky Blue */}
        <Button
          variant="outline" size="sm"
          className="flex items-center gap-1 bg-[#D3E4FD] text-[#1EAEDB] border-[#33C3F0]"
          onClick={() => handlePresetSelect({
            cardBgColor: '#D3E4FD',
            textColor: '#1EAEDB',
            businessNameColor: '#0FA0CE',
            cardTitleColor: '#33C3F0',
            stampBgColor: '#F1F0FB',
            stampActiveColor: '#33C3F0',
            rewardTextColor: '#0FA0CE',
            lastStampBorderColor: '#33C3F0',
          })}
        >
          <div className="w-3 h-3 rounded-full bg-[#33C3F0]"></div>
          Sky Blue
        </Button>
        {/* Soft Peach */}
        <Button
          variant="outline" size="sm"
          className="flex items-center gap-1 bg-[#FDE1D3] text-[#AA735D] border-[#FEC6A1]"
          onClick={() => handlePresetSelect({
            cardBgColor: '#FDE1D3',
            textColor: '#AA735D',
            businessNameColor: '#AA735D',
            cardTitleColor: '#F97316',
            stampBgColor: '#FEC6A1',
            stampActiveColor: '#F97316',
            rewardTextColor: '#AA735D',
            lastStampBorderColor: '#F97316',
          })}
        >
          <div className="w-3 h-3 rounded-full bg-[#F97316]"></div>
          Soft Peach
        </Button>
        {/* Magenta */}
        <Button
          variant="outline" size="sm"
          className="flex items-center gap-1 bg-[#FFDEE2] text-[#D946EF] border-[#D946EF]"
          onClick={() => handlePresetSelect({
            cardBgColor: '#FFDEE2',
            textColor: '#D946EF',
            businessNameColor: '#D946EF',
            cardTitleColor: '#D946EF',
            stampBgColor: '#F1F0FB',
            stampActiveColor: '#D946EF',
            rewardTextColor: '#D946EF',
            lastStampBorderColor: '#D946EF',
          })}
        >
          <div className="w-3 h-3 rounded-full bg-[#D946EF]"></div>
          Magenta
        </Button>
        {/* Charcoal */}
        <Button
          variant="outline" size="sm"
          className="flex items-center gap-1 bg-[#403E43] text-[#F3F4F6] border-[#221F26]"
          onClick={() => handlePresetSelect({
            cardBgColor: '#403E43',
            textColor: '#F3F4F6',
            businessNameColor: '#F3F4F6',
            cardTitleColor: '#8B5CF6',
            stampBgColor: '#1A1F2C',
            stampActiveColor: '#8B5CF6',
            rewardTextColor: '#F3F4F6',
            lastStampBorderColor: '#8B5CF6',
          })}
        >
          <div className="w-3 h-3 rounded-full bg-[#8B5CF6]"></div>
          Charcoal
        </Button>
        {/* Soft Green */}
        <Button
          variant="outline" size="sm"
          className="flex items-center gap-1 bg-[#F2FCE2] text-[#555F41] border-[#BEDB8B]"
          onClick={() => handlePresetSelect({
            cardBgColor: '#F2FCE2',
            textColor: '#555F41',
            businessNameColor: '#555F41',
            cardTitleColor: '#82C91E',
            stampBgColor: '#BEDB8B',
            stampActiveColor: '#82C91E',
            rewardTextColor: '#555F41',
            lastStampBorderColor: '#82C91E',
          })}
        >
          <div className="w-3 h-3 rounded-full bg-[#82C91E]"></div>
          Soft Green
        </Button>
        {/* Yellow */}
        <Button
          variant="outline" size="sm"
          className="flex items-center gap-1 bg-[#FEF7CD] text-[#A37B00] border-[#FFC300]"
          onClick={() => handlePresetSelect({
            cardBgColor: '#FEF7CD',
            textColor: '#A37B00',
            businessNameColor: '#A37B00',
            cardTitleColor: '#FFC300',
            stampBgColor: '#FDE1D3',
            stampActiveColor: '#FFC300',
            rewardTextColor: '#A37B00',
            lastStampBorderColor: '#FFC300',
          })}
        >
          <div className="w-3 h-3 rounded-full bg-[#FFC300]"></div>
          Yellow
        </Button>
        {/* Ocean Blue */}
        <Button
          variant="outline" size="sm"
          className="flex items-center gap-1 bg-[#CFFAFE] text-[#0EA5E9] border-[#0EA5E9]"
          onClick={() => handlePresetSelect({
            cardBgColor: '#CFFAFE',
            textColor: '#0EA5E9',
            businessNameColor: '#0EA5E9',
            cardTitleColor: '#0EA5E9',
            stampBgColor: '#F0FDFA',
            stampActiveColor: '#0EA5E9',
            rewardTextColor: '#0EA5E9',
            lastStampBorderColor: '#0EA5E9',
          })}
        >
          <div className="w-3 h-3 rounded-full bg-[#0EA5E9]"></div>
          Ocean Blue
        </Button>
        {/* Soft Purple */}
        <Button
          variant="outline" size="sm"
          className="flex items-center gap-1 bg-[#E5DEFF] text-[#6E59A5] border-[#9b87f5]"
          onClick={() => handlePresetSelect({
            cardBgColor: '#E5DEFF',
            textColor: '#6E59A5',
            businessNameColor: '#7E69AB',
            cardTitleColor: '#9b87f5',
            stampBgColor: '#F1F0FB',
            stampActiveColor: '#9b87f5',
            rewardTextColor: '#6E59A5',
            lastStampBorderColor: '#9b87f5',
          })}
        >
          <div className="w-3 h-3 rounded-full bg-[#9b87f5]"></div>
          Soft Purple
        </Button>
      </div>
    </div>
  );
};

