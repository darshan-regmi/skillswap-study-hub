
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-primary font-bold text-xl mb-4">SkillSwap</h3>
            <p className="text-gray-600 mb-4">
              The marketplace for students to exchange knowledge, skills, and expertise.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">For Students</h4>
            <ul className="space-y-2">
              <li><Link to="/how-it-works" className="text-gray-600 hover:text-primary">How It Works</Link></li>
              <li><Link to="/listings" className="text-gray-600 hover:text-primary">Browse Listings</Link></li>
              <li><Link to="/categories" className="text-gray-600 hover:text-primary">Categories</Link></li>
              <li><Link to="/success-stories" className="text-gray-600 hover:text-primary">Success Stories</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">For Tutors</h4>
            <ul className="space-y-2">
              <li><Link to="/become-tutor" className="text-gray-600 hover:text-primary">Become a Tutor</Link></li>
              <li><Link to="/seller-resources" className="text-gray-600 hover:text-primary">Seller Resources</Link></li>
              <li><Link to="/tips" className="text-gray-600 hover:text-primary">Tips for Success</Link></li>
              <li><Link to="/community" className="text-gray-600 hover:text-primary">Community</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-primary">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-primary">Contact</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-primary">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} SkillSwap. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-4">
                <li><a href="#" className="text-gray-600 hover:text-primary">Twitter</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">Instagram</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
