'use client';

// src/context/AuthContext.js
import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';

const OwnerContext = createContext(null);

export const OwnerAuthProvider = ({ children }) => {
  const [ownerAuthState, setOwnerAuthState] = useState({
    owner_id: null,
    access_token: null,
    isAuthenticated: false,
    isLoading: true
  });
  
  const router = useRouter();
  const pathname = usePathname();

  // Initialize auth state from storage on mount
  useEffect(() => {
    const initializeAuth = () => {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined') {
        const owner_id = localStorage.getItem('owner_id');
        const access_token = localStorage.getItem('access_token');
        
        if (owner_id && access_token) {
          // Set default authorization header for all requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
          
          setOwnerAuthState({
            owner_id,
            access_token,
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          setOwnerAuthState(prev => ({ ...prev, isLoading: false }));
        }
      }
    };

    initializeAuth();
  }, []);

  // Handle route protection
  useEffect(() => {
    // Wait until auth is checked
    if (ownerAuthState.isLoading) return;
    
    // If user is authenticated and trying to access login/register pages
    if (ownerAuthState.isAuthenticated && 
        (pathname === '/owner/login' || pathname === '/owner/register')) {
        router.replace('/owner/dashboard');
    }
    
    // If user is not authenticated and trying to access protected routes
    if (!ownerAuthState.isAuthenticated && 
        pathname !== '/' && 
        pathname !== '/login' && 
        pathname !== '/register' && 
        pathname !== '/home' &&
        pathname !== '/about-us' &&
        pathname !== '/contact-us' &&
        pathname !== '/cancelation-policy' &&
        pathname !== '/privacy-policy' &&
        pathname !== '/report-issue' &&
        pathname !== '/terms-and-conditions' &&  
        !pathname.startsWith('/owner/') &&
        !pathname.startsWith('/blogs') &&
        !pathname.startsWith('/blogs/')) {
        router.replace('/login');
    }
  }, [ownerAuthState.isAuthenticated, ownerAuthState.isLoading, pathname, router]);

  // Login function
  const Ownerlogin = (userData) => {
    const { owner_id, access_token } = userData;
    // Store in localStorage for persistence
    localStorage.setItem('owner_id', owner_id);
    localStorage.setItem('access_token', access_token);
    
    // Set default authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    
    setOwnerAuthState({
      owner_id,
      access_token,
      isAuthenticated: true,
      isLoading: false
    });
  };

  const OwnerLogout = () => {
    // Remove from localStorage
    localStorage.removeItem('owner_id');
    localStorage.removeItem('access_token');
    localStorage.removeItem('')
    // Remove default header
    delete axios.defaults.headers.common['Authorization'];
    
    setOwnerAuthState({
      owner_id: null,
      access_token: null,
      isAuthenticated: false,
      isLoading: false
    });
    
    // Redirect to login
    router.replace('/owner/login');
  };

  return (
    <OwnerContext.Provider value={{ ...ownerAuthState, Ownerlogin, OwnerLogout ,OwnerLogout}}>
      {children}
    </OwnerContext.Provider>
  );
};

// Custom hook for easy context usage
export const useOwnerAuth = () => {
  const context = useContext(OwnerContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};