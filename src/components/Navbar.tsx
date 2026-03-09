import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { LayoutDashboard, BrainCircuit, FileText, Home, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/';

  if (isAuthPage && location.pathname === '/') {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/50 backdrop-blur-md border-bottom border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold gradient-text">EduPredict</Link>
          <div className="flex gap-8 items-center">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <Link to="/login" className="btn-primary py-2">Get Started</Link>
          </div>
        </div>
      </nav>
    );
  }

  if (isAuthPage) return null;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Prediction', path: '/prediction', icon: BrainCircuit },
    { name: 'Reports', path: '/reports', icon: FileText },
  ];

  return (
    <nav className="fixed left-8 top-8 bottom-8 w-64 glass-card p-8 flex flex-col z-50 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
      <div className="mb-16 px-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-300 to-amber-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            <BrainCircuit className="text-slate-950" size={24} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold tracking-tighter gradient-text">
            EduPredict
          </h1>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500/40 ml-1">Performance Intelligence</p>
      </div>
      
      <div className="flex-1 space-y-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden ${
              location.pathname === item.path
                ? 'bg-amber-500/10 text-amber-400 shadow-[inset_0_0_20px_rgba(251,191,36,0.05)] border border-amber-500/20'
                : 'text-slate-500 hover:text-amber-200 hover:bg-white/5'
            }`}
          >
            {location.pathname === item.path && (
              <motion.div 
                layoutId="activeNav"
                className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
              />
            )}
            <item.icon 
              size={20} 
              strokeWidth={location.pathname === item.path ? 2.5 : 2}
              className={`transition-transform duration-300 group-hover:scale-110 ${
                location.pathname === item.path ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'group-hover:text-amber-300'
              }`} 
            />
            <span className={`text-sm font-bold tracking-tight transition-transform duration-300 ${location.pathname === item.path ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
              {item.name}
            </span>
          </Link>
        ))}
      </div>

      <div className="pt-8 border-t border-white/5 space-y-4">
        <div className="flex items-center gap-4 px-2">
          <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-white/5 flex items-center justify-center text-amber-500 font-bold shadow-inner">
            A
          </div>
          <div>
            <p className="text-sm font-bold text-white">Administrator</p>
            <p className="text-[10px] text-amber-500/60 font-bold uppercase tracking-widest">System Access</p>
          </div>
        </div>
        <Link
          to="/"
          className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold tracking-tight">Sign Out</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
