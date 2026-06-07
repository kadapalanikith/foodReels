import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/landing.css';

/* ── Animated counter hook ── */
function useCounter(target, duration = 2000, startOnVisible = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnVisible) { setStarted(true); return; }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return [count, ref];
}

/* ── Floating particle ── */
function Particle({ emoji, style }) {
  return <div className="landing-particle" style={style} aria-hidden="true">{emoji}</div>;
}

/* ── Stat card ── */
function StatCard({ value, suffix, label }) {
  const [count, ref] = useCounter(value);
  return (
    <div className="stat-card" ref={ref}>
      <span className="stat-card__value">{count.toLocaleString()}{suffix}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  );
}

/* ── Feature card ── */
function FeatureCard({ icon, title, description, color }) {
  return (
    <div className="feature-card" style={{ '--feature-color': color }}>
      <div className="feature-card__icon" aria-hidden="true">{icon}</div>
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__desc">{description}</p>
    </div>
  );
}

/* ── Testimonial ── */
function TestimonialCard({ quote, name, role, avatar }) {
  return (
    <div className="testimonial-card">
      <div className="testimonial-card__stars" aria-label="5 stars">★★★★★</div>
      <p className="testimonial-card__quote">"{quote}"</p>
      <div className="testimonial-card__author">
        <img src={avatar} alt="" aria-hidden="true" className="testimonial-card__avatar" />
        <div>
          <strong className="testimonial-card__name">{name}</strong>
          <span className="testimonial-card__role">{role}</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   LANDING PAGE
═══════════════════════════════════════ */
const LandingPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const particles = [
    { emoji: '🍕', style: { top: '12%', left: '8%', animationDelay: '0s', animationDuration: '6s' } },
    { emoji: '🍜', style: { top: '25%', right: '10%', animationDelay: '1s', animationDuration: '7s' } },
    { emoji: '🍣', style: { top: '55%', left: '5%', animationDelay: '2s', animationDuration: '8s' } },
    { emoji: '🌮', style: { top: '70%', right: '8%', animationDelay: '0.5s', animationDuration: '6.5s' } },
    { emoji: '🍔', style: { top: '40%', left: '92%', animationDelay: '3s', animationDuration: '9s' } },
    { emoji: '🥗', style: { top: '80%', left: '15%', animationDelay: '1.5s', animationDuration: '7.5s' } },
  ];

  const features = [
    {
      icon: '🎬',
      title: 'Vertical Reel Feed',
      description: 'Scroll through an infinite feed of mouth-watering food videos, curated just for you.',
      color: '#f97316',
    },
    {
      icon: '🍽️',
      title: 'Restaurant Discovery',
      description: 'Find hidden gems and top-rated restaurants near you through authentic food content.',
      color: '#8b5cf6',
    },
    {
      icon: '🔖',
      title: 'Save Favourites',
      description: 'Bookmark any dish you love and come back whenever you\'re ready to order.',
      color: '#ec4899',
    },
    {
      icon: '📍',
      title: 'Visit Stores',
      description: 'One tap to visit the restaurant\'s full profile and explore their entire menu.',
      color: '#06b6d4',
    },
    {
      icon: '🤳',
      title: 'Partner Dashboard',
      description: 'Restaurant owners get a full analytics dashboard to track views, likes, and reach.',
      color: '#22c55e',
    },
    {
      icon: '⚡',
      title: 'Real-time Updates',
      description: 'See likes, saves, and views update instantly as your audience engages with your content.',
      color: '#eab308',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Create an Account',
      description: 'Sign up as a foodie or register your restaurant in under 60 seconds.',
      icon: '👤',
    },
    {
      number: '02',
      title: 'Explore or Upload',
      description: 'Browse the feed to discover dishes, or upload your first food reel instantly.',
      icon: '🎥',
    },
    {
      number: '03',
      title: 'Connect & Grow',
      description: 'Like, save, share, and visit restaurants — or watch your restaurant\'s audience grow.',
      icon: '🚀',
    },
  ];

  const testimonials = [
    {
      quote: 'Our restaurant got 3x more walk-ins the week we joined FoodReels. The reach is unbelievable!',
      name: 'Ravi Kumar',
      role: 'Owner, Spice Garden',
      avatar: 'https://ui-avatars.com/api/?name=Ravi+Kumar&background=f97316&color=fff&size=48',
    },
    {
      quote: 'I found my new favourite sushi spot through FoodReels. The videos made me want to go immediately.',
      name: 'Priya Sharma',
      role: 'Food lover, Bengaluru',
      avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=8b5cf6&color=fff&size=48',
    },
    {
      quote: 'As a chef, this platform lets me showcase my cooking to thousands of people who actually care about food.',
      name: 'Chef Marco',
      role: 'Head Chef, La Dolce Vita',
      avatar: 'https://ui-avatars.com/api/?name=Chef+Marco&background=ec4899&color=fff&size=48',
    },
  ];

  return (
    <div className="landing-page">

      {/* ═══ NAVBAR ═══ */}
      <nav className="landing-nav" role="navigation" aria-label="Main navigation">
        <div className="landing-nav__inner">
          <Link to="/" className="landing-nav__brand">
            <span className="landing-nav__brand-icon" aria-hidden="true">🎬</span>
            <span>Food<strong>Reels</strong></span>
          </Link>

          <div id="nav-links" className={`landing-nav__links${menuOpen ? ' open' : ''}`}>
            <a href="#features" className="landing-nav__link" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="landing-nav__link" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#testimonials" className="landing-nav__link" onClick={() => setMenuOpen(false)}>Testimonials</a>
            <Link to="/user/login" className="landing-nav__link" onClick={() => setMenuOpen(false)}>Sign in</Link>
            <Link to="/register" className="landing-nav__cta" onClick={() => setMenuOpen(false)}>
              Get Started Free
            </Link>
          </div>

          <div className="landing-nav__actions-mobile">
            <Link to="/register" className="landing-nav__cta-mobile">
              Get Started
            </Link>
            <button
              className={`landing-nav__menu-btn${menuOpen ? ' open' : ''}`}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="nav-links"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="landing-hero" aria-label="Hero section">
        {/* Floating food particles */}
        {particles.map((p, i) => (
          <Particle key={i} emoji={p.emoji} style={p.style} />
        ))}

        {/* Background orbs */}
        <div className="landing-hero__orb landing-hero__orb--1" aria-hidden="true" />
        <div className="landing-hero__orb landing-hero__orb--2" aria-hidden="true" />

        <div className="landing-hero__content">
          <div className="landing-hero__badge">
            <span>🔥</span> Discover · Save · Order
          </div>

          <h1 className="landing-hero__headline">
            Discover Food That Makes You
            <span className="landing-hero__headline--gradient"> Stop Scrolling</span>
          </h1>

          <p className="landing-hero__sub">
            Short-form food videos from the best restaurants around you.
            Like, save, and visit your next favourite spot — all in one scroll.
          </p>

          <div className="landing-hero__actions">
            <Link to="/register" className="landing-btn landing-btn--primary" id="hero-cta-user">
              <i className="fa-solid fa-play" aria-hidden="true" />
              Start Watching Free
            </Link>
            <Link to="/food-partner/register" className="landing-btn landing-btn--secondary" id="hero-cta-partner">
              List Your Restaurant
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
          </div>

          <p className="landing-hero__social-proof">
            <i className="fa-solid fa-check" style={{ color: '#22c55e' }} aria-hidden="true" /> No credit card required &nbsp;·&nbsp;
            <i className="fa-solid fa-check" style={{ color: '#22c55e' }} aria-hidden="true" /> Free for food lovers &nbsp;·&nbsp;
            <i className="fa-solid fa-check" style={{ color: '#22c55e' }} aria-hidden="true" /> 10K+ restaurants
          </p>
        </div>

        <div className="landing-hero__visual" aria-hidden="true">
          <div className="landing-phone-frame">
            <div className="landing-phone-frame__screen">
              <img
                src="/hero-mockup.png"
                alt="FoodReels app showing a food reel"
                className="landing-phone-frame__img"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              {/* Fallback UI if image not loaded */}
              <div className="landing-phone-frame__fallback">
                <div className="landing-mock-reel">
                  <div className="landing-mock-reel__bg" />
                  <div className="landing-mock-chip">🍽️ Spice Garden</div>
                  <div className="landing-mock-actions">
                    <div className="landing-mock-btn">❤️</div>
                    <div className="landing-mock-btn">🔖</div>
                    <div className="landing-mock-btn">↗️</div>
                  </div>
                  <div className="landing-mock-bottom">
                    <div className="landing-mock-desc">Legendary Butter Chicken 🌶️</div>
                    <div className="landing-mock-cta">🛒 Visit Store</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="landing-phone-frame__glow" />
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="landing-stats" aria-label="Platform statistics">
        <div className="landing-container">
          <div className="landing-stats__grid">
            <StatCard value={10000} suffix="+" label="Restaurants" />
            <StatCard value={500000} suffix="+" label="Food Reels" />
            <StatCard value={2000000} suffix="+" label="Food Lovers" />
            <StatCard value={98} suffix="%" label="Satisfaction Rate" />
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="landing-features" aria-label="Features">
        <div className="landing-container">
          <div className="landing-section-header">
            <span className="landing-section-tag">Everything you need</span>
            <h2 className="landing-section-title">The only food discovery platform you'll ever need</h2>
            <p className="landing-section-sub">
              Built for foodies and restaurateurs alike. One app to discover, share, and grow.
            </p>
          </div>

          <div className="landing-features__grid">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="landing-steps" aria-label="How it works">
        <div className="landing-container">
          <div className="landing-section-header">
            <span className="landing-section-tag">Simple as 1-2-3</span>
            <h2 className="landing-section-title">Get started in minutes</h2>
          </div>

          <div className="landing-steps__grid">
            {steps.map((step, i) => (
              <div key={i} className="landing-step">
                <div className="landing-step__number" aria-hidden="true">{step.number}</div>
                <div className="landing-step__icon" aria-hidden="true">{step.icon}</div>
                <h3 className="landing-step__title">{step.title}</h3>
                <p className="landing-step__desc">{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="landing-step__connector" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>

          <div className="landing-steps__cta">
            <Link to="/register" className="landing-btn landing-btn--primary landing-btn--large" id="steps-cta">
              Join FoodReels Now
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section id="testimonials" className="landing-testimonials" aria-label="Testimonials">
        <div className="landing-container">
          <div className="landing-section-header">
            <span className="landing-section-tag">Loved by thousands</span>
            <h2 className="landing-section-title">Don't take our word for it</h2>
          </div>

          <div className="landing-testimonials__grid">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="landing-final-cta" aria-label="Call to action">
        <div className="landing-container">
          <div className="landing-final-cta__card">
            <div className="landing-final-cta__orb" aria-hidden="true" />
            <span className="landing-final-cta__emoji" aria-hidden="true">🍴</span>
            <h2 className="landing-final-cta__title">
              Ready to discover your next <br />favourite restaurant?
            </h2>
            <p className="landing-final-cta__sub">
              Join over 2 million food lovers already on FoodReels.
            </p>
            <div className="landing-hero__actions">
              <Link to="/register" className="landing-btn landing-btn--primary landing-btn--large" id="final-cta-user">
                Start for Free
              </Link>
              <Link to="/food-partner/register" className="landing-btn landing-btn--glass landing-btn--large" id="final-cta-partner">
                List Your Restaurant
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="landing-footer" role="contentinfo">
        <div className="landing-container">
          <div className="landing-footer__grid">
            <div className="landing-footer__brand">
              <div className="landing-nav__brand">
                <span className="landing-nav__brand-icon" aria-hidden="true">🎬</span>
                <span>Food<strong>Reels</strong></span>
              </div>
              <p className="landing-footer__tagline">
                The world's best food discovery platform.
              </p>
              <div className="landing-footer__social">
                <a href="#" aria-label="Instagram" className="landing-footer__social-link">📸</a>
                <a href="#" aria-label="Twitter" className="landing-footer__social-link">🐦</a>
                <a href="#" aria-label="TikTok" className="landing-footer__social-link">🎵</a>
              </div>
            </div>

            <div className="landing-footer__col">
              <h4>Product</h4>
              <ul>
                <li><Link to="/register">Sign Up</Link></li>
                <li><Link to="/user/login">Sign In</Link></li>
                <li><Link to="/food-partner/register">Partner with Us</Link></li>
                <li><a href="#features">Features</a></li>
              </ul>
            </div>

            <div className="landing-footer__col">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
              </ul>
            </div>

            <div className="landing-footer__col">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="landing-footer__bottom">
            <p>© {new Date().getFullYear()} FoodReels. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
