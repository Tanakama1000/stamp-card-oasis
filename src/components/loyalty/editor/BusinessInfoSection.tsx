
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import ImageUpload from "./ImageUpload";
import { BusinessInfoSectionProps } from "./types";

const BusinessInfoSection: React.FC<BusinessInfoSectionProps> = ({ form }) => {
  const handleLogoUpload = (dataUrl: string) => {
    form.setValue("businessLogo", dataUrl);
  };

  return (
    <>
      <FormField
        control={form.control}
        name="businessName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Name</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter business name" 
                {...field} 
                className="border-coffee-light"
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="cardTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Card Title</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter card title" 
                {...field} 
                className="border-coffee-light"
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="customerName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Default Customer Name</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter default customer name" 
                {...field} 
                className="border-coffee-light"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <ImageUpload
        onFileSelected={handleLogoUpload}
        currentImage={form.getValues("businessLogo")}
        label="Business Logo"
        icon={Upload}
      />
    </>
  );
};

export default BusinessInfoSection;
