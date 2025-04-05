
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
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
          <Button variant="outline" asChild>
            <Link to="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
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
            <hr className="my-2" />
            <Link
              to="/login"
              className="text-gray-600 hover:text-primary py-2"
              onClick={toggleMenu}
            >
              Log In
            </Link>
            <Button className="mt-2" onClick={toggleMenu} asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
