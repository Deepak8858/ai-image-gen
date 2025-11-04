'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import './ProtectedRoute.css';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user && mounted) {
      router.push('/login');
    }
  }, [user, loading, router, mounted]);

  if (loading || !mounted) {
    return (
      <div className="protected-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2 className="loading-title">AI Image Gen Pro</h2>
          <p className="loading-text">Loading your creative workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="protected-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="protected-route-enter">
      {children}
    </div>
  );
}
