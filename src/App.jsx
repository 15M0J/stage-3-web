import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProfileDetail from './pages/ProfileDetail';
import SearchPage from './pages/SearchPage';
import AccountPage from './pages/AccountPage';
import client from './api/client';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Fetch initial CSRF token
    client.get('/csrf-token').catch(err => console.error("CSRF Init Error:", err));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/profiles/:id" element={<ProfileDetail />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
