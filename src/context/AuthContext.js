'use client';

// src/context/AuthContext.js
import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user_id: null,
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
        const user_id = localStorage.getItem('user_id');
        const access_token = localStorage.getItem('access_token');
        
        if (user_id && access_token) {
          // Set default authorization header for all requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
          
          setAuthState({
            user_id,
            access_token,
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      }
    };

    initializeAuth();
  }, []);

  // Handle route protection
  useEffect(() => {
    // Wait until auth is checked
    if (authState.isLoading) return;
    
    // If user is authenticated and trying to access login/register pages
    if (authState.isAuthenticated && 
        (pathname === '/login' || pathname === '/register')) {
      router.replace('/home');
    }
    
    // If user is not authenticated and trying to access protected routes
    if (!authState.isAuthenticated && 
        pathname !== '/' && 
        pathname !== '/login' && 
        pathname !== '/register' && 
        pathname !== '/home' && 
        !pathname.startsWith('/owner/') &&
        !pathname.startsWith('/blogs') &&
        !pathname.startsWith('/blogs/')) {
      router.replace('/login');
    }
  }, [authState.isAuthenticated, authState.isLoading, pathname, router]);

  // Login function
  const login = (userData) => {
    const { user_id, access_token } = userData;
    
    // Store in localStorage for persistence
    localStorage.setItem('user_id', user_id);
    localStorage.setItem('access_token', access_token);
    
    // Set default authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    
    setAuthState({
      user_id,
      access_token,
      isAuthenticated: true,
      isLoading: false
    });
  };

  // Logout function
  const logout = () => {
    // Remove from localStorage
    localStorage.removeItem('user_id');
    localStorage.removeItem('access_token');
    localStorage.removeItem('')
    // Remove default header
    delete axios.defaults.headers.common['Authorization'];
    
    setAuthState({
      user_id: null,
      access_token: null,
      isAuthenticated: false,
      isLoading: false
    });
    
    // Redirect to login
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy context usage
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};