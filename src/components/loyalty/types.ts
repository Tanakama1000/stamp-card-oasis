
import { Coffee, Star, Heart, Award, Battery, Zap, Gift, Trophy, Sparkles } from "lucide-react";
import { LoyaltyCardConfig } from "./types/LoyaltyCardConfig";

export interface Reward {
  stampNumber: number;
  description: string;
  icon: string;
}

export interface LoyaltyCardProps {
  customerName?: string;
  maxStamps: number;
  currentStamps: number;
  onStampCollected?: () => void;
  cardStyle?: LoyaltyCardConfig;
  onReset?: () => void;
  isMobile?: boolean;
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
