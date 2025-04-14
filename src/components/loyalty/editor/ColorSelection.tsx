
import React from "react";
import { Input } from "@/components/ui/input";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { ColorSelectionProps } from "./types";

const ColorSelection: React.FC<ColorSelectionProps> = ({ value, onChange, label, presets }) => {
  return (
    <FormItem>
      <FormLabel className="flex items-center justify-between">
        {label}
        <span 
          className="w-5 h-5 rounded-full" 
          style={{ backgroundColor: value }} 
        />
      </FormLabel>
      <FormControl>
        <div>
          <div className="flex gap-2 mb-2">
            {presets.map(color => (
              <div
                key={color}
                className={`w-6 h-6 rounded-full cursor-pointer transition-all ${
                  value === color ? 'ring-2 ring-offset-1 ring-orange' : ''
                }`}
                style={{ backgroundColor: color }}
                onClick={() => onChange(color)}
              />
            ))}
          </div>
          <Input 
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 w-full"
          />
        </div>
      </FormControl>
    </FormItem>
  );
};

export default ColorSelection;
