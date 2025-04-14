
import React from "react";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { IconSelectionProps } from "./types";

const IconSelection: React.FC<IconSelectionProps> = ({ 
  icons, 
  value, 
  onChange, 
  label,
  description 
}) => {
  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <div className="grid grid-cols-4 gap-2">
          {icons.map((iconItem) => {
            const Icon = iconItem.icon;
            return (
              <div 
                key={iconItem.name}
                onClick={() => onChange(iconItem.name)}
                className={`p-3 rounded-md cursor-pointer flex flex-col items-center justify-center gap-1 text-xs transition-all ${
                  value === iconItem.name ? 'ring-2 ring-offset-1 ring-orange' : ''
                }`}
              >
                <Icon size={18} />
                <span>{iconItem.name}</span>
              </div>
            );
          })}
        </div>
      </FormControl>
      {description && <p className="text-xs text-coffee-light mt-1">{description}</p>}
    </FormItem>
  );
};

export default IconSelection;
