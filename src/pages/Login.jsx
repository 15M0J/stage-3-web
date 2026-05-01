import React from 'react';
import { motion } from 'framer-motion';
import { Github, ShieldCheck } from 'lucide-react';
import { API_BASE } from '../api/client';

function base64UrlEncode(bytes) {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const Login = () => {
  const handleLogin = async () => {
    const verifierBytes = new Uint8Array(32);
    window.crypto.getRandomValues(verifierBytes);
    const verifier = base64UrlEncode(verifierBytes);
    const challengeBuffer = await window.crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(verifier)
    );
    const challenge = base64UrlEncode(new Uint8Array(challengeBuffer));
    const state = crypto.randomUUID();
    const redirectUri = `${window.location.origin}/auth/callback`;

    sessionStorage.setItem('insighta_pkce_verifier', verifier);
    sessionStorage.setItem('insighta_oauth_state', state);

    window.location.href =
      `${API_BASE}/auth/github?code_challenge=${encodeURIComponent(challenge)}` +
      `&state=${encodeURIComponent(state)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-primary/20 rounded-2xl mb-4">
            <ShieldCheck className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Insighta Labs+</h1>
          <p className="text-slate-400">Secure Profile Intelligence System</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleLogin}
            className="btn btn-primary btn-lg w-full normal-case text-lg gap-3 rounded-2xl shadow-lg shadow-primary/20"
          >
            <Github className="w-6 h-6" />
            Sign in with GitHub
          </button>
          
          <div className="pt-6 text-center border-t border-white/10">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
              Stage 3 Backend Track
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
