import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  Bell, 
  Search as SearchIcon, 
  LayoutDashboard, 
  UserCircle, 
  MessageSquare, 
  Edit, 
  Briefcase,
  X 
} from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              className="md:hidden p-2"
              onClick={toggleSidebar}
            >
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

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/profile', icon: UserCircle, label: 'Profile' },
    { to: '/search', icon: SearchIcon, label: 'Search' },
    { to: '/employer/create-job', icon: Edit, label: 'Create Job' },
    { to: '/employer/view-jobs', icon: Briefcase, label: "View Jobs" }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed md:relative md:translate-x-0 inset-y-0 left-0 transform transition-transform duration-300 ease-in-out w-64 bg-white border-r border-gray-200 p-4 z-30 mt-16 md:mt-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <button
          className="md:hidden absolute top-2 right-2 p-1"
          onClick={onClose}
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <nav className="space-y-1 mt-4 md:mt-0">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={onClose}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex pt-16 md:pt-0">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 p-6 md:ml-64 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;