import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../api/client';

function base64UrlEncode(bytes) {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const exchangeCode = async () => {
      const verifier = sessionStorage.getItem('insighta_pkce_verifier');
      const expectedState = sessionStorage.getItem('insighta_oauth_state');
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');

      if (!code || !verifier || !state || state !== expectedState) {
        setError('OAuth callback validation failed.');
        return;
      }

      try {
        await axios.post(
          `${API_BASE}/auth/token`,
          {
            code,
            code_verifier: verifier,
            state,
            redirect_uri: `${window.location.origin}/auth/callback`
          },
          { withCredentials: true }
        );
        sessionStorage.removeItem('insighta_pkce_verifier');
        sessionStorage.removeItem('insighta_oauth_state');
        navigate('/', { replace: true });
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Authentication failed.');
      }
    };

    exchangeCode();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center">
        <h1 className="text-2xl font-semibold mb-3">Completing sign-in</h1>
        <p className="text-slate-300">
          {error || 'Finalizing your GitHub session and preparing the workspace.'}
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
