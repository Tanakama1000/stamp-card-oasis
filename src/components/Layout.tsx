
import { Link } from "react-router-dom";
import { Image } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense } from "react";

interface LayoutProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex justify-center items-center py-12">
    <div className="flex items-center space-x-2">
      <div className="w-3 h-3 bg-coffee-medium rounded-full animate-bounce" />
      <div className="w-3 h-3 bg-coffee-medium rounded-full animate-bounce [animation-delay:0.2s]" />
      <div className="w-3 h-3 bg-coffee-medium rounded-full animate-bounce [animation-delay:0.4s]" />
    </div>
  </div>
);

const Layout: React.FC<LayoutProps> = ({
  children,
  isLoading = false
}) => {
  return (
    <div className="min-h-screen bg-cream-light">
      <header className="bg-coffee-dark text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold flex items-center gap-2">
            <img 
              src="/lovable-uploads/04523b06-63b5-485f-ac7d-8624e600ad0d.png" 
              alt="InStamp Logo" 
              className="h-8 w-8"
            />
            <span>InStamp</span>
          </Link>
          <div className="flex items-center gap-2">InStamp</div>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4 bg-slate-50">
        <TooltipProvider>
          <Suspense fallback={<LoadingFallback />}>
            {isLoading ? <LoadingFallback /> : children}
          </Suspense>
        </TooltipProvider>
      </main>
      <footer className="bg-coffee-dark text-white p-4 mt-auto">
        <div className="container mx-auto text-center text-sm">
          &copy; {new Date().getFullYear()} Stamp Card Oasis. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
