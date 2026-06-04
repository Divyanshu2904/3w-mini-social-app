import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, LogOut, LogIn, Award, Wallet, Bell } from 'lucide-react';
import { Avatar } from '@mui/material';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('mini_social_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mini_social_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '70px',
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 90,
      boxShadow: 'var(--shadow)',
    }}>
      {/* Brand logo */}
      <div 
        onClick={() => navigate(user ? '/feed' : '/')} 
        style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <span style={{ color: 'var(--primary-color)' }}>Mini</span>Social
      </div>

      {/* TaskPlanet Inspired Mock Earning Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: 'rgba(234, 179, 8, 0.1)',
          padding: '6px 10px',
          borderRadius: '20px',
          border: '1px solid rgba(234, 179, 8, 0.2)',
          fontSize: '13px',
          fontWeight: '700',
          color: '#eab308'
        }}>
          <Award size={16} />
          225
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          padding: '6px 10px',
          borderRadius: '20px',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          fontSize: '13px',
          fontWeight: '700',
          color: '#22c55e'
        }}>
          <Wallet size={16} />
          ₹0.00
        </div>

        <div style={{ position: 'relative', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <Bell size={20} />
          <span style={{ position: 'absolute', top: -3, right: -3, width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--danger-color)' }} />
        </div>
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Theme Switcher */}
        <button 
          onClick={toggleTheme} 
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar 
              sx={{ bgcolor: 'var(--primary-color)', width: 34, height: 34, fontSize: '14px', fontWeight: 'bold' }}
            >
              {user.username.substring(0, 2).toUpperCase()}
            </Avatar>
            
            <div style={{ display: 'none', flexDirection: 'column' /* Hidden on small screens */ }}>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>{user.username}</span>
            </div>

            <button 
              onClick={() => { logout(); navigate('/'); }} 
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              <LogOut size={16} />
              <span style={{ display: 'inline' }}>Logout</span>
            </button>
          </div>
        ) : (
          <button 
            onClick={() => navigate('/login')} 
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            <LogIn size={18} />
            Login
          </button>
        )}
      </div>
    </nav>
  );
};
