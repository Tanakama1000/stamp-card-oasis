
import { Coffee, Star, Heart, Award, Battery, Zap, Gift, Trophy, Sparkles } from "lucide-react";

export interface Reward {
  stampNumber: number;
  description: string;
  icon: string;
}

export interface LoyaltyCardConfig {
  businessName?: string;
  businessLogo?: string;
  cardTitle?: string;
  maxStamps: number;
  stampIcon?: string;
  rewardIcon?: string;
  cardBgColor?: string;
  textColor?: string;
  businessNameColor?: string;
  cardTitleColor?: string;
  rewardTextColor?: string;
  stampBgColor?: string;
  stampActiveColor?: string;
  miniRewardStampColor?: string;
  fontFamily?: string;
  businessNameFont?: string;
  cardTitleFont?: string;
  customerNameFont?: string;
  descriptionFont?: string;
  progressRewardsFont?: string;
  businessNameFontSize?: string;
  cardTitleFontSize?: string;
  customerNameFontSize?: string;
  descriptionFontSize?: string;
  progressRewardsFontSize?: string;
  useBackgroundImage?: boolean;
  backgroundImage?: string;
  rewards?: Reward[];
}

export interface LoyaltyCardProps {
  customerName?: string;
  maxStamps: number;
  currentStamps: number;
  onStampCollected?: () => void;
  cardStyle?: LoyaltyCardConfig;
  onReset?: () => void;
}

export const STAMP_ICONS = {
  Coffee,
  Star,
  Heart,
  Award,
  Battery,
  Zap,
  Gift,
  Trophy,
  Sparkles
};
