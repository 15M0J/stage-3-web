import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProfileDetail from './pages/ProfileDetail';
import SearchPage from './pages/SearchPage';
import AccountPage from './pages/AccountPage';
import AuthCallback from './pages/AuthCallback';
import client from './api/client';

const queryClient = new QueryClient();

function ProtectedRoute({ user, isLoading, children }) {
  if (isLoading) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  const location = useLocation();
  const isPublicRoute = location.pathname === '/login' || location.pathname === '/auth/callback';

  useEffect(() => {
    client.get('/csrf-token').catch(() => {});
  }, []);

  const { data: user, isLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const response = await client.get('/api/v1/users/me');
      return response.data.data;
    },
    enabled: !isPublicRoute,
    retry: false
  });

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/"
        element={
          <ProtectedRoute user={user} isLoading={isLoading}>
            <Dashboard user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profiles/:id"
        element={
          <ProtectedRoute user={user} isLoading={isLoading}>
            <ProfileDetail user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute user={user} isLoading={isLoading}>
            <SearchPage user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute user={user} isLoading={isLoading}>
            <AccountPage user={user} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
