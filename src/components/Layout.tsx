
import { Link } from "react-router-dom";
import { Coffee } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import SignOutButton from "./SignOutButton";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-cream-light">
      <header className="bg-coffee-dark text-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Coffee size={24} />
              <span className="text-xl font-bold">Stamp Card Oasis</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              {user && (
                <Link to="/admin" className="text-white hover:text-cream transition-colors">
                  Admin
                </Link>
              )}
            </nav>
            
            {user && <SignOutButton />}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-6">
        {children}
      </main>
      
      <footer className="bg-coffee-dark text-white py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Stamp Card Oasis. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
