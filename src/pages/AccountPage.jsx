import React from 'react';
import { Shield, LogOut, Key, Terminal } from 'lucide-react';
import Navbar from '../components/Navbar';
import client from '../api/client';

const AccountPage = ({ user }) => {
  const handleLogout = async () => {
    await client.post('/auth/logout');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar user={user} />
      <main className="max-w-4xl mx-auto p-6 md:p-10">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">My Account</h1>
          <p className="text-slate-500">Manage your identity and security settings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
             <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl text-center">
                <div className="relative inline-block mb-4">
                  <img src={user.avatar_url} alt="avatar" className="w-24 h-24 rounded-3xl shadow-lg border-4 border-white" />
                  <div className="absolute -bottom-2 -right-2 bg-primary p-2 rounded-xl text-white shadow-lg">
                    <Shield className="w-4 h-4" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-slate-800">@{user.username}</h2>
                <p className="text-sm text-slate-400 mb-2">{user.role}</p>
                {user.email ? <p className="text-xs text-slate-400 mb-6">{user.email}</p> : null}
                <button onClick={handleLogout} className="btn btn-error btn-outline btn-block rounded-xl gap-2">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
             </div>
          </div>

          <div className="md:col-span-2 space-y-6">
             <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" /> Session Information
                </h3>
                <div className="space-y-4">
                   <div className="flex justify-between p-4 bg-slate-50 rounded-2xl">
                      <span className="text-slate-500">Access Expiry</span>
                      <span className="font-bold text-slate-800">3 minutes</span>
                   </div>
                   <div className="flex justify-between p-4 bg-slate-50 rounded-2xl">
                      <span className="text-slate-500">Refresh Expiry</span>
                      <span className="font-bold text-slate-800">5 minutes</span>
                   </div>
                </div>
             </div>

             <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-primary" /> CLI Access
                </h3>
                <p className="text-sm text-slate-500 mb-4">You can use your account to authenticate via the CLI tool.</p>
                <code className="block p-4 bg-slate-900 text-blue-400 rounded-xl font-mono text-sm">
                  insighta login
                </code>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountPage;
