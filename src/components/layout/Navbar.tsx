
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, User, LogIn, LogOut, PlusCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would come from auth context in a real app
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // This would call your auth service's logout method in a real app
    toast.success("Logged out successfully");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleLogin = () => {
    // For demo purposes only - in a real app we would not do this
    setIsLoggedIn(true);
    toast.success("Logged in as demo user");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-primary font-bold text-2xl">SkillSwap</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/listings" className="text-gray-600 hover:text-primary">
            Browse
          </Link>
          <Link to="/categories" className="text-gray-600 hover:text-primary">
            Categories
          </Link>
          <Link to="/how-it-works" className="text-gray-600 hover:text-primary">
            How It Works
          </Link>
        </nav>
        
        {/* Search Bar */}
        <div className="hidden md:flex relative w-1/3">
          <input
            type="text"
            placeholder="Search skills, courses, or tutors..."
            className="bg-gray-100 rounded-full py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          <button className="absolute right-3 top-2 text-gray-500">
            <Search size={20} />
          </button>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Button variant="outline" asChild>
                <Link to="/create-listing">
                  <PlusCircle size={16} className="mr-2" /> Create Listing
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/dashboard">
                  <User size={16} className="mr-2" /> Dashboard
                </Link>
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut size={16} className="mr-2" /> Log Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">
                  <LogIn size={16} className="mr-2" /> Log In
                </Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
              {/* Demo button - would be removed in a real app */}
              <Button variant="link" onClick={handleLogin} className="text-xs">
                Demo Login
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex mb-4 relative">
            <input
              type="text"
              placeholder="Search skills, courses, or tutors..."
              className="bg-gray-100 rounded-full py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <button className="absolute right-3 top-2 text-gray-500">
              <Search size={20} />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              to="/listings"
              className="text-gray-600 hover:text-primary py-2"
              onClick={toggleMenu}
            >
              Browse
            </Link>
            <Link
              to="/categories"
              className="text-gray-600 hover:text-primary py-2"
              onClick={toggleMenu}
            >
              Categories
            </Link>
            <Link
              to="/how-it-works"
              className="text-gray-600 hover:text-primary py-2"
              onClick={toggleMenu}
            >
              How It Works
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  to="/create-listing"
                  className="text-gray-600 hover:text-primary py-2"
                  onClick={toggleMenu}
                >
                  <PlusCircle size={16} className="inline mr-2" /> Create Listing
                </Link>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-primary py-2"
                  onClick={toggleMenu}
                >
                  <User size={16} className="inline mr-2" /> Dashboard
                </Link>
                <hr className="my-2" />
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="text-gray-600 hover:text-primary py-2 text-left"
                >
                  <LogOut size={16} className="inline mr-2" /> Log Out
                </button>
              </>
            ) : (
              <>
                <hr className="my-2" />
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary py-2"
                  onClick={toggleMenu}
                >
                  <LogIn size={16} className="inline mr-2" /> Log In
                </Link>
                <Button className="mt-2" onClick={toggleMenu} asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
                {/* Demo button - would be removed in a real app */}
                <Button 
                  variant="link" 
                  onClick={() => {
                    handleLogin();
                    toggleMenu();
                  }} 
                  className="text-xs"
                >
                  Demo Login
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
