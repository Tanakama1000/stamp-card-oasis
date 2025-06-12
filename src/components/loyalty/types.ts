
import {
  Coffee, Star, Heart, Award, Battery, Zap, Gift, Trophy, Sparkles, Cake, Pizza, IceCream, Flower, Diamond, Bell, Medal, ThumbsUp,
  Scissors, Utensils, Beer, GlassWater, ShoppingCart, Dumbbell, Target, Brush, Palette, Hammer, Wrench, BookOpen, Car, Dog,
  Luggage, BrickWall, Flame, Gem, BanknoteIcon, Coins, UtensilsCrossed, Package, Scale
} from "lucide-react";
import NailPolishIcon from "./icons/NailPolishIcon";
import NailPolishBottleIcon from "./icons/NailPolishBottleIcon";
import ManicureIcon from "./icons/ManicureIcon";
import CarWashIcon from "./icons/CarWashIcon";
import CoffeeBeanIcon from "./icons/CoffeeBeanIcon";
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
  CoffeeBean: CoffeeBeanIcon,
  Zap,
  Battery,
  Scissors,
  NailPolish: NailPolishIcon,
  NailPolishBottle: NailPolishBottleIcon,
  Manicure: ManicureIcon,
  CarWash: CarWashIcon,
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
