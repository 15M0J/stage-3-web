import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Download, Trash2, Users, MapPin, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import client from '../api/client';
import Navbar from '../components/Navbar';

const Dashboard = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['profiles', searchQuery],
    queryFn: async () => {
      const endpoint = searchQuery ? '/api/v1/profiles/search' : '/api/v1/profiles';
      const params = searchQuery ? { q: searchQuery } : { page: 1, limit: 20 };
      const res = await client.get(endpoint, { params });
      return res.data;
    }
  });

  const handleExport = async () => {
    const response = await client.get('/api/v1/profiles/export', { responseType: 'blob' });
    const href = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = href;
    link.download = `profiles_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(href);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      await client.delete(`/profiles/${id}`);
      refetch();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {/* Hero / Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">Profile Intelligence</h2>
            <p className="text-slate-500">Monitor and analyze demographic profiles globally.</p>
          </div>
          
          <div className="flex gap-3">
            {user.role === 'ADMIN' && (
              <button onClick={handleExport} className="btn btn-outline gap-2 rounded-xl border-slate-200 hover:bg-slate-100 hover:border-slate-300">
                <Download className="w-4 h-4 text-slate-600" />
                Export CSV
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-10 group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="Search naturally (e.g., 'young females from Nigeria')..."
            className="input w-full h-16 pl-14 bg-white border-slate-200 rounded-2xl shadow-sm focus:shadow-xl focus:shadow-primary/5 transition-all text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-white/50 animate-pulse rounded-2xl border border-slate-100" />
              ))
            ) : data?.data.map((profile) => (
              <Link to={`/profiles/${profile.id}`} key={profile.id}>
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden h-full"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-slate-100 p-3 rounded-xl group-hover:bg-primary/10 transition-colors">
                      <Users className="w-6 h-6 text-slate-500 group-hover:text-primary" />
                    </div>
                    {user.role === 'ADMIN' && (
                      <button 
                        onClick={(e) => {
                          e.preventDefault(); // Prevent navigation
                          handleDelete(profile.id);
                        }} 
                        className="btn btn-ghost btn-sm btn-circle text-slate-300 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-1 capitalize">{profile.name}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {profile.country_name}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {profile.age} years
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-50 flex gap-2">
                    <span className="badge badge-ghost font-bold text-[10px] uppercase">{profile.gender}</span>
                    <span className="badge badge-ghost font-bold text-[10px] uppercase">{profile.age_group}</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
