import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, LogIn } from 'lucide-react';
import { Avatar } from '@mui/material';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar 
              sx={{ bgcolor: 'var(--primary-color)', width: 34, height: 34, fontSize: '14px', fontWeight: 'bold' }}
            >
              {user.username.substring(0, 1).toUpperCase()}
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
