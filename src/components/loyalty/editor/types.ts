
import { LucideIcon } from "lucide-react";
import { Reward } from "../types";

// Editor section props
export interface IconSelectionProps {
  icons: Array<{ name: string; icon: React.ElementType }>;
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
  label?: string;
  description?: string;
}

export interface ColorSelectionProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  presets: string[];
}

export interface RewardsEditorProps {
  rewards: Reward[];
  maxStamps: number;
  onChange: (rewards: Reward[]) => void;
}

export interface RewardItemProps {
  reward: Reward;
  index: number;
  maxStamps: number;
  rewards: Reward[];
  onChange: (rewards: Reward[]) => void;
  onRemove: (index: number) => void;
}

export interface TypographyEditorProps {
  form: any;
}

export interface ImageUploadProps {
  onFileSelected: (dataUrl: string) => void;
  currentImage?: string;
  label: string;
  icon: React.ElementType;
  hint?: string;
}

export interface BackgroundImageSectionProps {
  form: any;
  cardConfig: LoyaltyCardConfig;
  handleBackgroundImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface BusinessInfoSectionProps {
  form: any;
}

export interface CardIconsSectionProps {
  form: any;
}

export interface CardColorsSectionProps {
  form: any;
}

export interface StampConfigSectionProps {
  form: any;
}

export interface LoyaltyCardConfig {
  businessName: string;
  customerName: string;
  maxStamps: number;
  currentStamps: number;
  cardBgColor: string;
  stampBgColor: string;
  stampActiveColor: string;
  textColor: string;
  businessLogo: string;
  businessNameColor: string;
  rewardTextColor: string;
  stampIcon: string;
  rewardIcon: string;
  rewards: Reward[];
  miniRewardStampColor: string;
  backgroundImage: string;
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

export interface LoyaltyCardEditorProps {
  onCardUpdate?: (cardConfig: LoyaltyCardConfig) => void;
}
