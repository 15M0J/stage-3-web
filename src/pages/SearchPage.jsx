import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Users, MapPin, Calendar, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import client from '../api/client';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const SearchPage = () => {
  const [q, setQ] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['search', q],
    queryFn: async () => {
      if (!q) return { data: [] };
      const res = await client.get('/api/profiles/search', { params: { q } });
      return res.data;
    },
    enabled: q.length > 2
  });

  const user = { username: "Admin", role: "ADMIN" };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Natural Language Search</h1>
          <p className="text-slate-500 max-w-2xl text-lg">Query our demographic engine using everyday language. Try "males from Lagos" or "elderly people from UK".</p>
        </div>

        <div className="relative mb-12">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <input 
            type="text" 
            autoFocus
            placeholder="What are you looking for today?"
            className="input w-full h-20 pl-16 text-xl bg-white border-slate-200 rounded-3xl shadow-xl focus:shadow-primary/10 transition-all"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-40 bg-white animate-pulse rounded-3xl" />
              ))
            ) : data?.data.map((profile) => (
              <Link to={`/profiles/${profile.id}`} key={profile.id}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-slate-100 p-3 rounded-2xl group-hover:bg-primary/10 transition-colors">
                      <Users className="w-6 h-6 text-slate-500 group-hover:text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 capitalize">{profile.name}</h3>
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-tight">{profile.age_group}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {profile.country_id}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {profile.age}y</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </AnimatePresence>
          {q && !isLoading && data?.data.length === 0 && (
             <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">No matches found for "{q}"</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
