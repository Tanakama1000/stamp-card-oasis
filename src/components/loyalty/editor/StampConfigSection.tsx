
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StampConfigSectionProps } from "./types";

const StampConfigSection: React.FC<StampConfigSectionProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="maxStamps"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stamps Required</FormLabel>
            <FormControl>
              <Select 
                value={field.value.toString()} 
                onValueChange={(val) => field.onChange(parseInt(val))}
              >
                <SelectTrigger className="border-coffee-light">
                  <SelectValue placeholder="Select stamps required" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Stamps</SelectItem>
                  <SelectItem value="8">8 Stamps</SelectItem>
                  <SelectItem value="10">10 Stamps</SelectItem>
                  <SelectItem value="12">12 Stamps</SelectItem>
                  <SelectItem value="15">15 Stamps</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="currentStamps"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Demo Stamps</FormLabel>
            <FormControl>
              <Select 
                value={field.value.toString()} 
                onValueChange={(val) => field.onChange(parseInt(val))}
              >
                <SelectTrigger className="border-coffee-light">
                  <SelectValue placeholder="Select demo stamps" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 Stamps</SelectItem>
                  <SelectItem value="3">3 Stamps</SelectItem>
                  <SelectItem value="5">5 Stamps</SelectItem>
                  <SelectItem value="8">8 Stamps</SelectItem>
                  <SelectItem value="10">10 Stamps</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default StampConfigSection;
