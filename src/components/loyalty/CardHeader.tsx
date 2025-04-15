
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CardHeaderProps {
  businessLogo?: string;
  businessName?: string;
  businessNameColor: string;
  businessNameFont: string;
  businessNameFontSize: string;
  cardTitle: string;
  cardTitleColor: string;
  cardTitleFont: string;
  cardTitleFontSize: string;
  descriptionFont: string;
  descriptionFontSize: string;
  textColor: string;
  maxStamps: number;
  stamps: number;
  progressBarColor: string;
  isMobile?: boolean;
  rewardText?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  businessLogo,
  businessName = "InStamp",  // Default to InStamp if no business name provided
  businessNameColor,
  businessNameFont,
  businessNameFontSize,
  cardTitle,
  cardTitleColor,
  cardTitleFont,
  cardTitleFontSize,
  descriptionFont,
  descriptionFontSize,
  textColor,
  maxStamps,
  stamps,
  progressBarColor,
  isMobile,
  rewardText
}) => {
  const avatarSize = isMobile ? "h-10 w-10" : "h-12 w-12";
  
  return (
    <div className={`flex items-center justify-between mb-4 md:mb-6 relative z-10 ${isMobile ? 'flex-wrap' : ''}`}>
      <div className={`flex flex-col items-center w-full ${isMobile ? 'gap-2 mb-2' : 'gap-3'}`}>
        {businessLogo ? (
          <div className="flex justify-center w-full mb-2">
            <Avatar className={`${avatarSize} border-2 border-white shadow-md`}>
              <AvatarImage src={businessLogo} alt={businessName || "Business logo"} />
              <AvatarFallback className="bg-orange text-white">
                {businessName?.charAt(0) || "I"}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div className="flex justify-center w-full mb-2">
            <Avatar className={`${avatarSize} border-2 border-white shadow-md`}>
              <AvatarImage src="/lovable-uploads/e8c4240d-e1dd-4f5c-87ce-d22d3b9e8422.png" alt="InStamp logo" />
              <AvatarFallback className="bg-orange text-white">
                I
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        <div className="text-center w-full">
          {businessName && (
            <h3 
              className={`font-medium ${businessNameFontSize}`} 
              style={{
                color: businessNameColor,
                fontFamily: businessNameFont !== "default" ? businessNameFont : 'inherit'
              }}
            >
              {businessName}
            </h3>
          )}
          <h2 
            className={`font-bold ${cardTitleFontSize} text-center`} 
            style={{
              color: cardTitleColor,
              fontFamily: cardTitleFont !== "default" ? cardTitleFont : 'inherit'
            }}
          >
            {cardTitle}
          </h2>
          <p 
            className={`${descriptionFontSize} text-center`} 
            style={{
              color: textColor,
              fontFamily: descriptionFont !== "default" ? descriptionFont : 'inherit'
            }}
          >
            {rewardText || `Collect ${maxStamps} stamps for a free item`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardHeader;
