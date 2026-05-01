import React from 'react';
import { LogOut, LayoutDashboard, Database, Search, UserCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import client from '../api/client';

const Navbar = ({ user }) => {
  const location = useLocation();
  
  const handleLogout = async () => {
    try {
      await client.post('/auth/logout');
      window.location.href = '/login';
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Account', path: '/account', icon: UserCircle },
  ];

  return (
    <div className="navbar bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-6 h-20">
      <div className="flex-1 gap-2">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg text-white">
            <Database className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">Insighta<span className="text-primary">+</span></span>
        </Link>
        
        <div className="hidden md:flex ml-10 gap-2">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-sm ${
                location.pathname === item.path 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex-none gap-4">
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-xl">
          <img src={user?.avatar_url || `https://github.com/identicons/${user?.username}.png`} alt="avatar" className="w-8 h-8 rounded-lg shadow-sm" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-700 leading-none">{user?.username || 'Analyst'}</span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">{user?.role}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-ghost btn-circle text-slate-500 hover:text-error hover:bg-error/10">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
