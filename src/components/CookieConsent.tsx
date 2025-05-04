
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem("cookieConsent");
    if (!hasAccepted) {
      // Wait a moment before showing the banner
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowConsent(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "false");
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg animate-fade-in">
      <div className="container mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1 pr-4">
          <h3 className="text-lg font-semibold mb-1">We value your privacy</h3>
          <p className="text-gray-600 text-sm md:text-base">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Visit our{" "}
            <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> to learn more.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={declineCookies}
          >
            Decline
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={acceptCookies}
          >
            Accept All
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-1 absolute top-2 right-2 md:relative md:top-auto md:right-auto"
          onClick={declineCookies}
        >
          <X size={18} />
        </Button>
      </div>
    </div>
  );
};

export default CookieConsent;
