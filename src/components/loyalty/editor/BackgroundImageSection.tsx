
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Image } from "lucide-react";
import { BackgroundImageSectionProps } from "./types";

const BackgroundImageSection: React.FC<BackgroundImageSectionProps> = ({ 
  form, 
  cardConfig, 
  handleBackgroundImageUpload 
}) => {
  return (
    <FormField
      control={form.control}
      name="backgroundImage"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>Card Background Image</FormLabel>
          <FormControl>
            <div className="flex flex-col gap-2">
              <div className="relative flex-1">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleBackgroundImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="border border-dashed border-coffee-light rounded-md p-4 text-center flex items-center justify-center">
                  <Image size={18} className="mr-2" />
                  <span>Upload Background Image</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.watch("useBackgroundImage")}
                  onCheckedChange={(checked) => {
                    form.setValue("useBackgroundImage", checked);
                  }}
                  id="use-bg-image"
                />
                <label htmlFor="use-bg-image" className="text-sm cursor-pointer">
                  Use background image
                </label>
              </div>
              
              {cardConfig.backgroundImage && (
                <div className="h-16 bg-cream rounded-md flex items-center justify-center overflow-hidden">
                  <img 
                    src={cardConfig.backgroundImage} 
                    alt="Card background" 
                    className="max-h-full w-full object-cover" 
                  />
                </div>
              )}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default BackgroundImageSection;
