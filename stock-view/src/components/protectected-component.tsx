'use client';
import { auth } from '@/firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import Spinner from './spinner';

const ProtectedComponent: React.FC<PropsWithChildren> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);

      if (!user) {
        window.location.href = '/auth/login';
        localStorage.removeItem('user');
      } else {
        localStorage.setItem('user', JSON.stringify(user));
      }
    });

    return () => unsubscribe();
  }, []);

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <div className='flex h-screen w-full items-center justify-center'>
      <Spinner />
    </div>
  );
};

export default ProtectedComponent;
