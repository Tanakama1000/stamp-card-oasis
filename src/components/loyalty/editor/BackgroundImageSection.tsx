
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Image, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundImageSectionProps } from "./types";

const BackgroundImageSection: React.FC<BackgroundImageSectionProps> = ({ 
  form, 
  cardConfig, 
  handleBackgroundImageUpload 
}) => {
  const handleRemoveBackground = () => {
    form.setValue("backgroundImage", "");
    form.setValue("useBackgroundImage", false);
  };

  return (
    <div className="space-y-4 border-t border-cream pt-4">
      <h4 className="font-medium text-coffee-dark">Card Background</h4>
      
      <FormField
        control={form.control}
        name="backgroundImage"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>Background Image</FormLabel>
            <FormControl>
              <div className="flex flex-col gap-3">
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
                
                <div className="flex items-center justify-between">
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleRemoveBackground}
                      className="flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      <span>Remove</span>
                    </Button>
                  )}
                </div>
                
                {cardConfig.backgroundImage && (
                  <div className="space-y-3">
                    <div className="h-20 bg-cream rounded-md flex items-center justify-center overflow-hidden">
                      <img 
                        src={cardConfig.backgroundImage} 
                        alt="Card background" 
                        className="max-h-full w-full object-cover" 
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="backgroundOpacity"
                      render={({ field }) => (
                        <FormItem className="space-y-0">
                          <div className="flex items-center justify-between">
                            <FormLabel className="mb-0">Overlay Opacity</FormLabel>
                            <span className="text-sm">{field.value || 30}%</span>
                          </div>
                          <FormControl>
                            <Slider
                              defaultValue={[field.value || 30]}
                              min={0}
                              max={100}
                              step={5}
                              onValueChange={(vals) => field.onChange(vals[0])}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default BackgroundImageSection;
