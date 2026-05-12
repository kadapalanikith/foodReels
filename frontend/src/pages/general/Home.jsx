import React, { useRef, useState, useEffect, useCallback } from 'react';
import '../../styles/home.css';

/* ─────────────────────────────────────────────
   Mock reel data — replace with API response
───────────────────────────────────────────── */
const REELS = [
  {
    id: 1,
    videoUrl: '/videos/testMeal.mp4',
    storeName: 'Spice Garden',
    storeAvatar: 'https://ui-avatars.com/api/?name=Spice+Garden&background=f97316&color=fff&size=64',
    storeUrl: '/store/spice-garden',
    description:
      '🌶️ Our legendary Butter Chicken — slow-cooked in a rich tomato cream sauce with hand-ground spices, served with fluffy garlic naan straight out of the tandoor.',
    likes: 2341,
    comments: 148,
    shares: 89,
  },
  {
    id: 2,
    videoUrl: '/videos/testMeal.mp4',
    storeName: 'The Dumpling House',
    storeAvatar: 'https://ui-avatars.com/api/?name=Dumpling+House&background=ef4444&color=fff&size=64',
    storeUrl: '/store/dumpling-house',
    description:
      '🥟 Hand-folded XO pork & prawn dumplings, pan-seared to a golden crisp and finished with a drizzle of our secret chilli-sesame oil. A street-food favourite reimagined.',
    likes: 5892,
    comments: 321,
    shares: 204,
  },
  {
    id: 3,
    videoUrl: '/videos/testMeal.mp4',
    storeName: 'La Dolce Vita',
    storeAvatar: 'https://ui-avatars.com/api/?name=La+Dolce+Vita&background=8b5cf6&color=fff&size=64',
    storeUrl: '/store/la-dolce-vita',
    description:
      '🍕 Wood-fired Margherita with San Marzano tomatoes, buffalo mozzarella & fresh basil — simple perfection baked at 450 °C for 90 seconds.',
    likes: 3760,
    comments: 212,
    shares: 130,
  },
  {
    id: 4,
    videoUrl: '/videos/testMeal.mp4',
    storeName: 'Sakura Bites',
    storeAvatar: 'https://ui-avatars.com/api/?name=Sakura+Bites&background=ec4899&color=fff&size=64',
    storeUrl: '/store/sakura-bites',
    description:
      '🍱 Premium omakase bento box — otoro nigiri, wagyu sukiyaki, crispy tempura shrimp and a miso-glazed black cod. Limited to 30 boxes daily.',
    likes: 8120,
    comments: 540,
    shares: 390,
  },
];

/* ── Format numbers like 1.2k ── */
function fmt(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
  return String(n);
}

/* ───────────────────────────────────────────
   Single Reel Slide component
─────────────────────────────────────────── */
function ReelSlide({ reel, isActive, index }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(reel.likes);
  const [showMuteBadge, setShowMuteBadge] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const muteBadgeTimer = useRef(null);

  /* Play / pause based on visibility */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive]);

  /* Progress bar update */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isActive) return;

    const update = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };
    video.addEventListener('timeupdate', update);
    return () => video.removeEventListener('timeupdate', update);
  }, [isActive]);

  /* Toggle mute with flash badge */
  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !muted;
    video.muted = nextMuted;
    setMuted(nextMuted);

    clearTimeout(muteBadgeTimer.current);
    setShowMuteBadge(true);
    muteBadgeTimer.current = setTimeout(() => setShowMuteBadge(false), 800);
  }, [muted]);

  /* Like toggle */
  const toggleLike = () => {
    if (liked) {
      setLikeCount((c) => c - 1);
    } else {
      setLikeCount((c) => c + 1);
    }
    setLiked((l) => !l);
  };

  return (
    <div className="reel-slide" data-index={index}>
      {/* Progress bar */}
      <div className="reel-progress" style={{ width: `${progress}%` }} />

      {/* Video */}
      <video
        ref={videoRef}
        className="reel-video"
        src={reel.videoUrl}
        loop
        muted={muted}
        playsInline
        preload="auto"
        onClick={toggleMute}
      />

      {/* Gradient scrim */}
      <div className="reel-scrim" />

      {/* Mute badge flash */}
      <div className={`reel-mute-badge${showMuteBadge ? ' show' : ''}`}>
        {muted ? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
            <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 19l2 2L21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z"/>
          </svg>
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
        )}
      </div>

      {/* Store branding chip — top left */}
      <div className="reel-store-chip" onClick={() => window.location.href = reel.storeUrl}>
        <img className="reel-store-chip__avatar" src={reel.storeAvatar} alt={reel.storeName} />
        <span className="reel-store-chip__name">{reel.storeName}</span>
      </div>

      {/* Right action buttons */}
      <div className="reel-actions">
        {/* Like */}
        <button
          className={`reel-action-btn${liked ? ' liked' : ''}`}
          onClick={toggleLike}
          aria-label="Like"
        >
          <div className="reel-action-btn__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill={liked ? '#ef4444' : 'white'}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <span className="reel-action-btn__label">{fmt(likeCount)}</span>
        </button>

        {/* Comment */}
        <button className="reel-action-btn" aria-label="Comment">
          <div className="reel-action-btn__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="reel-action-btn__label">{fmt(reel.comments)}</span>
        </button>

        {/* Share */}
        <button className="reel-action-btn" aria-label="Share">
          <div className="reel-action-btn__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
            </svg>
          </div>
          <span className="reel-action-btn__label">{fmt(reel.shares)}</span>
        </button>
      </div>

      {/* Bottom overlay: description + visit store button */}
      <div className="reel-bottom">
        {/* Description — max 2 lines, tap to expand */}
        <p
          className={`reel-description${descExpanded ? ' expanded' : ''}`}
          onClick={() => setDescExpanded((e) => !e)}
          title={reel.description}
        >
          <span className="reel-description__store-name">{reel.storeName} · </span>
          {reel.description}
        </p>

        {/* Visit Store CTA */}
        <button
          id={`visit-store-${reel.id}`}
          className="reel-visit-btn"
          onClick={() => window.location.href = reel.storeUrl}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7.35 17H19v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H15.55c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
          Visit Store
        </button>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────
   Home Page — Reels Feed
─────────────────────────────────────────── */
const Home = () => {
  const feedRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);

  /* Intersection Observer — track which slide is on screen */
  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;

    const slides = feed.querySelectorAll('.reel-slide');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index);
            setActiveIndex(idx);
            if (idx > 0) setShowHint(false);
          }
        });
      },
      { root: feed, threshold: 0.6 }
    );

    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="reels-feed" ref={feedRef}>
      {REELS.map((reel, i) => (
        <ReelSlide key={reel.id} reel={reel} isActive={i === activeIndex} index={i} />
      ))}

      {/* Scroll hint — only on first slide */}
      {showHint && (
        <div
          className="scroll-hint"
          style={{ position: 'fixed', bottom: 110, left: '50%', transform: 'translateX(-50%)' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
          </svg>
          <span>Swipe up</span>
        </div>
      )}
    </div>
  );
};

export default Home;