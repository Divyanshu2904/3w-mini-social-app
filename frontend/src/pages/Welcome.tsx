import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Globe } from 'lucide-react';

export const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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

  // Auto-swipe slides every 2.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 2500);

    return () => clearInterval(timer);
  }, [activeSlide]);

  // Handle mobile touch swipe gestures
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe Left -> Next Slide
      setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    } else if (isRightSwipe) {
      // Swipe Right -> Previous Slide
      setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }
  };

  return (
    <div className="welcome-page">
      <div 
        className="welcome-slider"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: 'pan-y', cursor: 'grab' }}
      >
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

        <div className="welcome-dots" style={{ position: 'relative', height: '8px', width: '48px', margin: '0 auto 24px auto' }}>
          {/* Static background placeholder dots */}
          {slides.map((_, index) => (
            <div
              key={index}
              className="dot"
              onClick={() => setActiveSlide(index)}
              style={{
                position: 'absolute',
                top: 0,
                left: `${index * 16 + 4}px`,
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                backgroundColor: activeSlide === index ? 'transparent' : '#cbd5e1',
              }}
            />
          ))}
          {/* Sliding active pill indicator with premium spring-bounce easing motion */}
          <div
            className="active-indicator"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '16px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: 'var(--primary-color)',
              transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: `translateX(${activeSlide * 16}px)`,
              pointerEvents: 'none',
            }}
          />
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
