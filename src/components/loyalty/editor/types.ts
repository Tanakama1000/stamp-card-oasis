
import { UseFormReturn } from "react-hook-form";
import { Reward } from "@/components/loyalty/types";
import { LucideIcon } from "lucide-react";

export interface LoyaltyCardConfig {
  businessName: string;
  customerName: string;
  maxStamps: number;
  currentStamps: number;
  cardBgColor: string;
  stampBgColor: string;
  stampActiveColor: string;
  textColor: string;
  businessLogo?: string;
  businessNameColor: string;
  rewardTextColor: string;
  stampIcon: string;
  rewardIcon: string;
  rewards: Reward[];
  miniRewardStampColor: string;
  backgroundImage?: string;
  useBackgroundImage: boolean;
  cardTitle: string;
  cardTitleColor: string;
  fontFamily: string;
  businessNameFont: string;
  cardTitleFont: string;
  customerNameFont: string;
  descriptionFont: string;
  progressRewardsFont: string;
  businessNameFontSize: string;
  cardTitleFontSize: string;
  customerNameFontSize: string;
  descriptionFontSize: string;
  progressRewardsFontSize: string;
}

export interface BusinessInfoSectionProps {
  form: UseFormReturn<LoyaltyCardConfig, any>;
}

export interface StampConfigSectionProps {
  form: UseFormReturn<LoyaltyCardConfig, any>;
}

export interface BackgroundImageSectionProps {
  form: UseFormReturn<LoyaltyCardConfig, any>;
  cardConfig: LoyaltyCardConfig;
  handleBackgroundImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface CardIconsSectionProps {
  form: UseFormReturn<LoyaltyCardConfig, any>;
}

export interface CardColorsSectionProps {
  form: UseFormReturn<LoyaltyCardConfig, any>;
}

export interface ColorSelectionProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  presets?: string[];
}

export interface ImageUploadProps {
  onFileSelected: (dataUrl: string) => void;
  currentImage?: string;
  label: string;
  icon: LucideIcon;
  hint?: string;
}

export interface IconSelectionProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icons: { name: string; icon: LucideIcon }[];
  description?: string;
  selectedIcon?: string;
  onSelectIcon?: (iconName: string) => void;
}

export interface RewardItemProps {
  reward: Reward;
  onChange: (updatedReward: Reward) => void;
  onDelete: () => void;
  maxStamps: number;
  icons: { name: string; icon: LucideIcon }[];
  index?: number;
  rewards?: Reward[];
  onRemove?: (index: number) => void;
}

export interface RewardsEditorProps {
  rewards: Reward[];
  onChange: (rewards: Reward[]) => void;
  maxStamps: number;
}

export interface TypographyEditorProps {
  form: UseFormReturn<LoyaltyCardConfig, any>;
}
