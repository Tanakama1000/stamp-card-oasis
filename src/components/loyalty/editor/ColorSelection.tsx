
import React, { useRef, useEffect } from "react";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paintbrush } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ColorSelectionProps } from "./types";

const ColorSelection: React.FC<ColorSelectionProps> = ({
  label,
  value,
  onChange,
  className = "",
  presets = []
}) => {
  const colorInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (colorInputRef.current) {
      colorInputRef.current.value = value;
    }
  }, [value]);

  return (
    <FormItem className={className}>
      <FormLabel>{label}</FormLabel>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          ref={colorInputRef}
          defaultValue={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
        <div 
          className="w-10 h-10 rounded border border-gray-300 flex-shrink-0"
          style={{ backgroundColor: value }}
        />
        <Input 
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-0 h-0 p-0 border-0 overflow-hidden absolute"
          id={`color-picker-${label.replace(/\s+/g, '-').toLowerCase()}`}
        />
        <label
          htmlFor={`color-picker-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className="cursor-pointer p-2 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
        >
          <Paintbrush size={16} />
        </label>
      </div>
      
      {presets && presets.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="mt-1 text-xs w-full flex justify-between"
            >
              <span>Color Presets</span>
              <Paintbrush size={12} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <div className="grid grid-cols-4 gap-2">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full aspect-square rounded border border-gray-300 hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: preset }}
                  onClick={() => onChange(preset)}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </FormItem>
  );
};

export default ColorSelection;
