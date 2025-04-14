
import React from "react";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { ImageUploadProps } from "./types";

const ImageUpload: React.FC<ImageUploadProps> = ({
  onFileSelected,
  currentImage,
  label,
  icon: Icon,
  hint
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onFileSelected(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="border border-dashed border-coffee-light rounded-md p-4 text-center flex items-center justify-center">
              <Icon size={18} className="mr-2" />
              <span>Upload {label}</span>
            </div>
          </div>
          {currentImage && (
            <div className="h-12 w-12 bg-cream rounded-md flex items-center justify-center overflow-hidden">
              <img 
                src={currentImage} 
                alt={label} 
                className="max-h-full max-w-full object-contain" 
              />
            </div>
          )}
        </div>
      </FormControl>
      {hint && <p className="text-xs text-coffee-light mt-1">{hint}</p>}
    </FormItem>
  );
};

export default ImageUpload;
