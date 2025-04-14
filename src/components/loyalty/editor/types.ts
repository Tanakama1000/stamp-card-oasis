
import { LoyaltyCardConfig, Reward } from "../types";

export interface LoyaltyCardEditorProps {
  onCardUpdate?: (cardConfig: LoyaltyCardConfig) => void;
}

export interface ColorSelectionProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  presets: string[];
}

export interface IconSelectionProps {
  icons: Array<{ name: string; icon: React.ElementType }>;
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
  label?: string;
  description?: string;
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
