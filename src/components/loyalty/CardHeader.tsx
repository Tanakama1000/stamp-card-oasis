
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
}

const CardHeader: React.FC<CardHeaderProps> = ({
  businessLogo,
  businessName,
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
  progressBarColor
}) => {
  return (
    <div className="flex items-center justify-between mb-6 relative z-10">
      <div className="flex items-center gap-3">
        {businessLogo && (
          <Avatar className="h-12 w-12 border-2 border-white shadow-md">
            <AvatarImage src={businessLogo} alt="Business logo" />
            <AvatarFallback className="bg-orange text-white">{businessName?.charAt(0) || "B"}</AvatarFallback>
          </Avatar>
        )}
        <div>
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
            className={`font-bold ${cardTitleFontSize}`} 
            style={{ 
              color: cardTitleColor,
              fontFamily: cardTitleFont !== "default" ? cardTitleFont : 'inherit'
            }}
          >
            {cardTitle}
          </h2>
          <p 
            className={descriptionFontSize} 
            style={{ 
              color: textColor,
              fontFamily: descriptionFont !== "default" ? descriptionFont : 'inherit'
            }}
          >
            Collect {maxStamps} stamps for a free item
          </p>
        </div>
      </div>
      <div 
        className="h-14 w-14 rounded-full flex items-center justify-center text-white font-bold shadow-md transform transition-transform hover:scale-105"
        style={{ backgroundColor: progressBarColor }}
      >
        <span className="text-lg">{stamps}/{maxStamps}</span>
      </div>
    </div>
  );
};

export default CardHeader;
