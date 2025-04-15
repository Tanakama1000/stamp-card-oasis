
import { Link } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  return <div className="min-h-screen bg-white">
    <header className="bg-coffee-dark text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <img 
            src="/lovable-uploads/e8c4240d-e1dd-4f5c-87ce-d22d3b9e8422.png" 
            alt="InStamp Logo" 
            className="h-8 w-8"
          />
          <span>InStamp</span>
        </Link>
        <div className="flex items-center gap-2">
          
        </div>
      </div>
    </header>
    <main className="container mx-auto py-8 px-4 bg-slate-50">
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </main>
    <footer className="bg-coffee-dark text-white p-4 mt-auto">
      <div className="container mx-auto text-center text-sm">
        &copy; {new Date().getFullYear()} InStamp. All rights reserved.
      </div>
    </footer>
  </div>;
};

export default Layout;
