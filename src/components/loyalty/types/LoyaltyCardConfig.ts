
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
  lastStampText?: string;
  lastStampTextColor?: string;
  lastStampBorderColor?: string;
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
  miniRewardStampColor?: string;
  rewards?: {
    stampNumber: number;
    description: string;
    icon: string;
  }[];

  // Index signature to make it compatible with Json type
  [key: string]: any;
}
