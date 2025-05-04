import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X, Link as LinkIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
interface SlugCheckerProps {
  className?: string;
}
const SlugChecker: React.FC<SlugCheckerProps> = ({
  className
}) => {
  const [slug, setSlug] = useState<string>("");
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [wasChecked, setWasChecked] = useState<boolean>(false);
  const navigate = useNavigate();

  // Debounce slug checking
  useEffect(() => {
    if (!slug) {
      setIsAvailable(null);
      setWasChecked(false);
      return;
    }
    const slugToCheck = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const timer = setTimeout(async () => {
      setIsChecking(true);
      setWasChecked(false);
      try {
        // Check if slug exists in businesses table
        const {
          data,
          error
        } = await supabase.from('businesses').select('id').eq('slug', slugToCheck).maybeSingle();
        if (error) {
          console.error("Error checking slug availability:", error);
          setIsAvailable(false);
        } else {
          // If data is null, the slug is available
          setIsAvailable(data === null);
        }
      } catch (err) {
        console.error("Error checking slug:", err);
        setIsAvailable(false);
      } finally {
        setIsChecking(false);
        setWasChecked(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [slug]);
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow alphanumeric characters, hyphens, and spaces
    const value = e.target.value.replace(/[^a-zA-Z0-9\s-]/g, '');
    setSlug(value);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAvailable && slug) {
      // Store the slug in localStorage to use it when signing up
      localStorage.setItem('businessSlug', slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'));
      navigate("/admin");
    }
  };
  return <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      <div className="flex-1 relative">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex items-center pr-3 shadow-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50 transition-all">
          <div className="bg-slate-50 p-3 border-r border-gray-200">
            <LinkIcon size={20} className="text-blue-500" />
          </div>
          <div className="p-3 flex-grow">
            <span className="text-slate-500 text-sm">instamp.digital/</span>
            <Input value={slug} onChange={handleSlugChange} className="inline-block border-none p-0 h-auto w-auto focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent" placeholder="your-business" aria-label="Business slug" />
          </div>
          {wasChecked && <div className={`flex items-center justify-center h-6 w-6 rounded-full ${isAvailable ? 'bg-green-100' : 'bg-red-100'}`}>
              {isAvailable ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
            </div>}
        </div>
        {wasChecked && <div className={`text-sm mt-2 ${isAvailable ? 'text-green-600' : 'text-red-600'} flex items-center`}>
            {isAvailable ? <>
                <Check className="h-4 w-4 mr-1" />
                This link is available!
              </> : <>
                <X className="h-4 w-4 mr-1" />
                This link is already taken.
              </>}
          </div>}
      </div>
      <Button type="submit" size="lg" variant="heroGradient" className="px-6 sm:whitespace-nowrap" disabled={!isAvailable || isChecking || !slug}>
        {isChecking ? "Checking..." : isAvailable && wasChecked ? "Claim Your Link" : "Claim Your Link"}
      </Button>
    </form>;
};
export default SlugChecker;