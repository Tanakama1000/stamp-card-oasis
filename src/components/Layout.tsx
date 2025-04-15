
import { Link } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  return <div className="min-h-screen bg-cream-light">
      <header className="bg-coffee-dark text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold flex items-center gap-2">
            <img 
              src="/lovable-uploads/7520843f-cdff-4e16-9a69-f1da892db604.png" 
              alt="InStamp Logo" 
              className="h-6 w-6"
            />
            <span>InStamp</span>
          </Link>
          <div className="flex items-center gap-2">InStamp</div>
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
