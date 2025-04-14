
import { Link } from "react-router-dom";
import { Coffee, QrCode } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-cream-light">
      <header className="bg-coffee-dark text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/admin" className="text-xl font-bold flex items-center gap-2">
            <Coffee size={24} />
            <span>Stamp Card Oasis</span>
          </Link>
          <nav className="flex gap-4">
            <Link to="/admin" className="hover:text-cream flex items-center gap-1">
              <QrCode size={18} />
              <span>Business</span>
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        {children}
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
