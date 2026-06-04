import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Globe } from 'lucide-react';

export const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: 'Best And Trusted Platform',
      subtitle: 'Task Planet Is An Online Money Earning Website For The Individuals Looking For Small Tasks And Getting Paid For It',
      image: 'https://img.freepik.com/free-vector/social-media-concept-illustration_114360-128.jpg',
    },
    {
      title: 'A Platform For Online Earners',
      subtitle: 'Login to earn points using various amazing and easy tools provided in the app and then use earned points for reward!!',
      image: 'https://img.freepik.com/free-vector/work-from-home-concept-illustration_114360-1418.jpg',
    },
    {
      title: 'Earn Commissions From Team',
      subtitle: 'Earn every time your team completes any task. Make posts and grow your network!',
      image: 'https://img.freepik.com/free-vector/team-work-concept-illustration_114360-1011.jpg',
    },
  ];

  return (
    <div className="welcome-page">
      <div className="welcome-slider">
        <img
          src={slides[activeSlide].image}
          alt="Illustration"
          className="welcome-image"
          onError={(e) => {
            // Fallback image if network error
            e.currentTarget.src = 'https://placehold.co/280x200/ffffff/334155?text=Social+App';
          }}
        />
        <h2 className="welcome-title">{slides[activeSlide].title}</h2>
        <p className="welcome-subtitle">{slides[activeSlide].subtitle}</p>

        <div className="welcome-dots">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`dot ${activeSlide === index ? 'active' : ''}`}
              onClick={() => setActiveSlide(index)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>
      </div>

      <div className="welcome-card">
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#0f172a', textAlign: 'center' }}>
          Login with MiniSocial
        </h3>
        <p style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', marginBottom: '24px' }}>
          Join the feed, share your thoughts, and interact with posts instantly!
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            className="btn-primary"
            onClick={() => navigate('/login')}
            style={{ width: '100%', backgroundColor: '#0f172a' }}
          >
            <LogIn size={18} />
            Continue with Email
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate('/feed')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#0f172a', borderColor: '#cbd5e1' }}
          >
            <Globe size={18} />
            Explore Public Feed
          </button>
        </div>
      </div>
    </div>
  );
};
