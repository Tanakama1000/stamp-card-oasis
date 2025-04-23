
import {
  Coffee, Star, Heart, Award, Battery, Zap, Gift, Trophy, Sparkles, Cake, Pizza, IceCream, Flower, Diamond, Bell, Medal, ThumbsUp,
  Scissors, Nail, Utensils, Beer, GlassWater, ShoppingCart, Dumbbell, Boxing, Brush, Palette, Hammer, Wrench, BookOpen, Car, Paw,
  Luggage, BrickWall, Target, Flame, Gem, BanknoteIcon, Coins, UtensilsCrossed, Package, Scale
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

// Expanded icon library
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
  // NEW ICONS BELOW
  Scissors,
  Nail,           // Renamed from NailPolish to Nail
  Utensils,       // Instead of Burger (using a more general food icon)
  Beer,
  GlassWater,     // Renamed from Drink to GlassWater
  ShoppingCart,
  Dumbbell,
  Boxing,         // Renamed from BoxingGlove to Boxing
  Brush,          // Renamed from Broom to Brush
  Palette,        // Renamed from PaintPalette to Palette
  Hammer,
  Wrench,
  BookOpen,       // Renamed from StackOfBooks to BookOpen
  Car,
  Paw,            // Renamed from PawPrint to Paw
  Luggage,        // Renamed from Suitcase to Luggage
  BrickWall,      // Renamed from Brick to BrickWall
  Target,         // Renamed from Dartboard to Target
  Flame,          // Renamed from Fire to Flame
  Gem,            // Renamed from Gemstone to Gem
  BanknoteIcon,   // Renamed from Cash to BanknoteIcon
  Coins,          // Fixed spelling from Coin to Coins
  UtensilsCrossed, // Renamed from PlateUtensils to UtensilsCrossed
  Package,
  Scale           // Renamed from Scales to Scale
};
