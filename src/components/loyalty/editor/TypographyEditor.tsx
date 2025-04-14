
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Text } from "lucide-react";
import { FONT_FAMILIES, FONT_SIZES } from "./constants";
import { TypographyEditorProps } from "./types";

const TypographyEditor: React.FC<TypographyEditorProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-coffee-dark flex items-center gap-2">
        <Text size={18} />
        Text Typography
      </h4>
      
      <FormField
        control={form.control}
        name="fontFamily"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Default Font Family</FormLabel>
            <FormControl>
              <Select 
                value={field.value} 
                onValueChange={(val) => field.onChange(val)}
              >
                <SelectTrigger className="border-coffee-light">
                  <SelectValue placeholder="Select font family" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value !== "default" ? font.value : 'inherit' }}>
                        {font.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <p className="text-xs text-coffee-light mt-1">Default font for all text (can be overridden below)</p>
          </FormItem>
        )}
      />
      
      <div className="border p-4 rounded-md space-y-4 bg-slate-50">
        <h4 className="font-medium text-coffee-dark">Individual Text Fonts</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="businessNameFont"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name Font</FormLabel>
                <FormControl>
                  <Select 
                    value={field.value} 
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <SelectTrigger className="border-coffee-light">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_FAMILIES.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <span style={{ fontFamily: font.value !== "default" ? font.value : 'inherit' }}>
                            {font.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cardTitleFont"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card Title Font</FormLabel>
                <FormControl>
                  <Select 
                    value={field.value} 
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <SelectTrigger className="border-coffee-light">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_FAMILIES.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <span style={{ fontFamily: font.value !== "default" ? font.value : 'inherit' }}>
                            {font.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="customerNameFont"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name Font</FormLabel>
                <FormControl>
                  <Select 
                    value={field.value} 
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <SelectTrigger className="border-coffee-light">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_FAMILIES.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <span style={{ fontFamily: font.value !== "default" ? font.value : 'inherit' }}>
                            {font.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="descriptionFont"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description Font</FormLabel>
                <FormControl>
                  <Select 
                    value={field.value} 
                    onValueChange={(val) => field.onChange(val)}
                  >
                    <SelectTrigger className="border-coffee-light">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_FAMILIES.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <span style={{ fontFamily: font.value !== "default" ? font.value : 'inherit' }}>
                            {font.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="progressRewardsFont"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Progress Rewards Font</FormLabel>
              <FormControl>
                <Select 
                  value={field.value} 
                  onValueChange={(val) => field.onChange(val)}
                >
                  <SelectTrigger className="border-coffee-light">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <span style={{ fontFamily: font.value !== "default" ? font.value : 'inherit' }}>
                          {font.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="businessNameFontSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name Size</FormLabel>
              <FormControl>
                <Select 
                  value={field.value} 
                  onValueChange={(val) => field.onChange(val)}
                >
                  <SelectTrigger className="border-coffee-light">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="cardTitleFontSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Title Size</FormLabel>
              <FormControl>
                <Select 
                  value={field.value} 
                  onValueChange={(val) => field.onChange(val)}
                >
                  <SelectTrigger className="border-coffee-light">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="customerNameFontSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name Size</FormLabel>
              <FormControl>
                <Select 
                  value={field.value} 
                  onValueChange={(val) => field.onChange(val)}
                >
                  <SelectTrigger className="border-coffee-light">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="descriptionFontSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description Text Size</FormLabel>
              <FormControl>
                <Select 
                  value={field.value} 
                  onValueChange={(val) => field.onChange(val)}
                >
                  <SelectTrigger className="border-coffee-light">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="progressRewardsFontSize"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Progress Rewards Text Size</FormLabel>
            <FormControl>
              <Select 
                value={field.value} 
                onValueChange={(val) => field.onChange(val)}
              >
                <SelectTrigger className="border-coffee-light">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_SIZES.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                        {size.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default TypographyEditor;
