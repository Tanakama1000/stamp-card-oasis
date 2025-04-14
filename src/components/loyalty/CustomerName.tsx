
import React from "react";

interface CustomerNameProps {
  customerName?: string;
  textColor: string;
  customerNameFont?: string;
  customerNameFontSize?: string;
}

const CustomerName: React.FC<CustomerNameProps> = ({
  customerName,
  textColor,
  customerNameFont,
  customerNameFontSize
}) => {
  if (!customerName) return null;
  
  return (
    <div className="mt-5 text-center relative z-10">
      <h4 
        className={`font-medium ${customerNameFontSize}`} 
        style={{ 
          color: textColor,
          fontFamily: customerNameFont !== "default" ? customerNameFont : 'inherit'
        }}
      >
        {customerName}'s Card
      </h4>
    </div>
  );
};

export default CustomerName;
