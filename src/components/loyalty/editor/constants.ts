
import { Coffee, Star, Heart, Award, Battery, Zap, Gift, Trophy, Sparkles, LucideIcon } from "lucide-react";

export const FONT_FAMILIES = [
  { name: "Default (System Font)", value: "default" },
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Times New Roman", value: "Times New Roman, Times, serif" },
  { name: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { name: "Courier New", value: "Courier New, monospace" },
  { name: "Playfair Display", value: "Playfair Display, serif" },
  { name: "Roboto", value: "Roboto, sans-serif" },
  { name: "Open Sans", value: "Open Sans, sans-serif" },
  { name: "Lato", value: "Lato, sans-serif" },
];

export const FONT_SIZES = [
  { name: "Extra Small", value: "text-xs" },
  { name: "Small", value: "text-sm" },
  { name: "Base", value: "text-base" },
  { name: "Large", value: "text-lg" },
  { name: "Extra Large", value: "text-xl" },
  { name: "2XL", value: "text-2xl" },
];

export const STAMP_ICONS = [
  { name: "Coffee", icon: Coffee },
  { name: "Star", icon: Star },
  { name: "Heart", icon: Heart },
  { name: "Award", icon: Award },
  { name: "Battery", icon: Battery },
  { name: "Zap", icon: Zap },
  { name: "Gift", icon: Gift },
  { name: "Trophy", icon: Trophy },
  { name: "Sparkles", icon: Sparkles },
];

export const REWARD_ICONS = STAMP_ICONS;

export const COLOR_PRESETS = {
  cardBg: ["#FFFFFF", "#F5F5DC", "#FDF4E3", "#F0F8FF", "#FFFAFA", "#FFF0F5", "#F8F8FF", "#F5FFFA"],
  stampBg: ["#F5F5DC", "#EAEAEA", "#E6E6FA", "#FFE4C4", "#FAFAD2", "#E0FFFF", "#F0FFF0", "#F5F5F5"],
  stampActive: ["#8B4513", "#A52A2A", "#6F4E37", "#F97316", "#D97706", "#B45309", "#A16207", "#4B5563"],
  text: ["#000000", "#333333", "#6F4E37", "#4B5563", "#1F2937", "#374151", "#6B7280", "#9CA3AF"],
};
