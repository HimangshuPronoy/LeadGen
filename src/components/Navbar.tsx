
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Brain } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  if (isDashboard) return null;

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center h-20">
          <Link 
            to="/" 
            className="flex items-center space-x-3 text-2xl font-light text-gray-900 transition-all duration-300 hover:opacity-70 group"
          >
            <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
              <div className="relative z-10">
                <Brain className="h-5 w-5 text-white" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
                </div>
              </div>
              <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
            </div>
            <span>LeadGenAI</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-12">
            <Link 
              to="/" 
              className="nav-link"
            >
              Home
            </Link>
            <Link 
              to="/pricing" 
              className="nav-link"
            >
              Pricing
            </Link>
            <Link 
              to="/dashboard" 
              className="nav-link"
            >
              Dashboard
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900 font-medium">
                Sign in
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="btn-primary px-6 py-2 rounded-xl">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
