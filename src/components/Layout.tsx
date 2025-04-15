
import { Link } from "react-router-dom";
import { Coffee, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import SignOutButton from "./SignOutButton";
import { useState } from "react";
import { Button } from "./ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream-light flex flex-col">
      <header className="bg-coffee-dark text-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Coffee size={24} />
              <span className="text-xl font-bold">Stamp Card Oasis</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-white hover:text-cream transition-colors">
                Home
              </Link>
              {user && (
                <Link to="/admin" className="text-white hover:text-cream transition-colors">
                  Dashboard
                </Link>
              )}
              {!user && (
                <Link to="/auth" className="text-white hover:text-cream transition-colors">
                  Sign In
                </Link>
              )}
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
            
            {/* Sign out button (desktop) */}
            <div className="hidden md:block">
              {user && <SignOutButton />}
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-2 pb-4 space-y-2">
              <Link 
                to="/" 
                className="block py-2 text-white hover:text-cream transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              {user && (
                <Link 
                  to="/admin" 
                  className="block py-2 text-white hover:text-cream transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {!user && (
                <Link 
                  to="/auth" 
                  className="block py-2 text-white hover:text-cream transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
              {user && (
                <div className="pt-2">
                  <SignOutButton />
                </div>
              )}
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-coffee-dark text-white py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Stamp Card Oasis. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
