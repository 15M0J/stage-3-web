import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, User, MapPin, Calendar, Shield, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import client from '../api/client';
import Navbar from '../components/Navbar';

const ProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      const res = await client.get(`/api/profiles/${id}`);
      return res.data.data;
    }
  });

  const user = { username: "Admin", role: "ADMIN" };

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <main className="max-w-4xl mx-auto p-6 md:p-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary to-blue-600 h-32" />
          <div className="px-8 pb-10 -mt-12">
            <div className="bg-white p-2 rounded-2xl shadow-lg inline-block mb-6">
              <div className="bg-slate-100 w-20 h-20 rounded-xl flex items-center justify-center">
                <User className="w-10 h-10 text-slate-400" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-slate-800 capitalize mb-2">{profile.name}</h1>
            <p className="text-slate-500 mb-8">System ID: {profile.id}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Demographics</h3>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <Calendar className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-sm text-slate-500">Age & Group</p>
                    <p className="font-bold text-slate-800">{profile.age} years ({profile.age_group})</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <Shield className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-sm text-slate-500">Gender & Probability</p>
                    <p className="font-bold text-slate-800 capitalize">{profile.gender} ({(profile.gender_probability * 100).toFixed(1)}%)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Location</h3>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <MapPin className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-sm text-slate-500">Country</p>
                    <p className="font-bold text-slate-800">{profile.country_name} ({profile.country_id})</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <Clock className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-sm text-slate-500">Collected At</p>
                    <p className="font-bold text-slate-800">{new Date(profile.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProfileDetail;
