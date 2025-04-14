
import { UseFormReturn } from "react-hook-form";
import { Reward } from "@/components/loyalty/types";

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
}

export interface ImageUploadProps {
  onFileSelected: (dataUrl: string) => void;
  currentImage?: string;
  label: string;
  icon: React.FC<{ size?: number; className?: string }>;
  hint?: string;
}

export interface IconSelectionProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icons: Record<string, React.FC<{ size?: number; className?: string }>>;
}

export interface RewardItemProps {
  reward: Reward;
  onChange: (updatedReward: Reward) => void;
  onDelete: () => void;
  maxStamps: number;
  icons: Record<string, React.FC<{ size?: number; className?: string }>>;
}

export interface RewardsEditorProps {
  rewards: Reward[];
  onChange: (rewards: Reward[]) => void;
  maxStamps: number;
}

export interface TypographyEditorProps {
  form: UseFormReturn<LoyaltyCardConfig, any>;
}
