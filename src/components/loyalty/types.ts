import {
  Coffee, Star, Heart, Award, Battery, Zap, Gift, Trophy, Sparkles, Cake, Pizza, IceCream, Flower, Diamond, Bell, Medal, ThumbsUp,
  Scissors, NailPolish as NailPolishIcon, Utensils, Beer, GlassWater, ShoppingCart, Dumbbell, Target, Brush, Palette, Hammer, Wrench, BookOpen, Car, Dog,
  Luggage, BrickWall, Flame, Gem, BanknoteIcon, Coins, UtensilsCrossed, Package, Scale
} from "lucide-react";
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
  businessId?: string;
}

export const STAMP_ICONS = {
  Gift,
  Star,
  Heart,
  Award,
  Trophy,
  Sparkles,
  ThumbsUp,
  Medal,
  Cake,
  Pizza,
  IceCream,
  Flower,
  Diamond,
  Bell,
  Coffee,
  Zap,
  Battery,
  Scissors,
  NailPolish: NailPolishIcon,
  Utensils,
  Beer,
  GlassWater,
  ShoppingCart,
  Dumbbell,
  Target,
  Brush,
  Palette,
  Hammer,
  Wrench,
  BookOpen,
  Car,
  Dog,
  Luggage,
  BrickWall,
  Flame,
  Gem,
  BanknoteIcon,
  Coins,
  UtensilsCrossed,
  Package,
  Scale
};
