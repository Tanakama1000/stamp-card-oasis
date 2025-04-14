
import { Coffee, Star, Heart, Award, Battery, Zap, Gift, Trophy } from "lucide-react";
import { LucideIcon } from "lucide-react";

export const STAMP_ICONS: { name: string; icon: LucideIcon }[] = [
  { name: "Coffee", icon: Coffee },
  { name: "Star", icon: Star },
  { name: "Heart", icon: Heart },
  { name: "Award", icon: Award },
  { name: "Battery", icon: Battery },
  { name: "Zap", icon: Zap },
  { name: "Gift", icon: Gift },
  { name: "Trophy", icon: Trophy },
];

export const REWARD_ICONS: { name: string; icon: LucideIcon }[] = [
  { name: "Gift", icon: Gift },
  { name: "Award", icon: Award },
  { name: "Star", icon: Star },
];

export const FONT_FAMILIES = [
  { name: "Default", value: "default" },
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Verdana", value: "Verdana, sans-serif" },
  { name: "Tahoma", value: "Tahoma, sans-serif" },
  { name: "Trebuchet MS", value: "Trebuchet MS, sans-serif" },
  { name: "Times New Roman", value: "Times New Roman, serif" },
  { name: "Courier New", value: "Courier New, monospace" },
  { name: "Playfair Display", value: "Playfair Display, serif" },
  { name: "Roboto", value: "Roboto, sans-serif" },
  { name: "Open Sans", value: "Open Sans, sans-serif" },
  { name: "Lato", value: "Lato, sans-serif" },
];

export const FONT_SIZES = [
  { name: "Default", value: "default" },
  { name: "Extra Small", value: "text-xs" },
  { name: "Small", value: "text-sm" },
  { name: "Medium", value: "text-base" },
  { name: "Large", value: "text-lg" },
  { name: "Extra Large", value: "text-xl" },
  { name: "2X Large", value: "text-2xl" },
  { name: "3X Large", value: "text-3xl" },
];

export const COLOR_PRESETS = {
  cardBg: ["#FFFFFF", "#F5F5DC", "#FEF9D7", "#E7F0FD", "#FFDEE2", "#E5DEFF"],
  stampBg: ["#F5F5DC", "#FFFDD0", "#FFFFFF", "#F6F6F7", "#F1F0FB", "#C8C8C9"],
  stampActive: ["#8B4513", "#D2691E", "#FF8C00", "#A67B5B", "#9b87f5", "#F97316"],
  text: ["#6F4E37", "#222222", "#000000", "#403E43", "#1A1F2C", "#8B5CF6"],
  miniReward: ["#D3D3D3", "#C0C0C0", "#A9A9A9", "#E5E4E2", "#CCCCCC", "#D8D8D8"],
};
