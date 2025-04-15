import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, Search as SearchIcon } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button className="md:hidden p-2">
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-indigo-600">FreeLancer</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2">
              <SearchIcon className="h-6 w-6 text-gray-500" />
            </button>
            <button className="p-2">
              <Bell className="h-6 w-6 text-gray-500" />
            </button>
            <Link 
              to="/profile"
              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
            >
              <span className="text-sm font-medium text-gray-600">U</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;