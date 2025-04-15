
export interface LoyaltyCardConfig {
  businessName: string;
  cardTitle?: string;
  maxStamps: number;
  cardBgColor?: string;
  stampBgColor?: string;
  stampActiveColor?: string;
  textColor?: string;
  businessNameColor?: string;
  cardTitleColor?: string;
  rewardTextColor?: string;
  businessLogo?: string;
  backgroundImage?: string;
  useBackgroundImage?: boolean;
  stampIcon?: string;
  rewardIcon?: string;
  rewardText?: string;
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
  rewards?: {
    stampNumber: number;
    description: string;
    icon: string;
  }[];
}
