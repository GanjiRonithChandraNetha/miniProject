import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UserCircle, MessageSquare, Search,Edit, Briefcase } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/profile', icon: UserCircle, label: 'Profile' },
    { to: '/chat', icon: MessageSquare, label: 'Messages' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/employer/create-job',icon: Edit,label:'Create Job'},
    { to: '/employer/view-jobs',icon:Briefcase,label:"View Jobs"}
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-4">
      <nav className="space-y-1">
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
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;