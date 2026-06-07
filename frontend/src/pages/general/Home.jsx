import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/home.css';
import { getFeedItems, likeFood, saveFood, incrementView } from '../../api/food.api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';

/* ── Format numbers like 1.2k ── */
function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace('.0', '') + 'K';
  return String(n || 0);
}

/* ─── Skeleton Reel ─── */
function SkeletonReel() {
  return (
    <div className="reel-slide reel-skeleton" aria-label="Loading reel…">
      <div className="reel-skeleton__spinner" />
    </div>
  );
}

/* ─── Single Reel Slide ─── */
function ReelSlide({ reel, isActive, index, onLike, onSave, onView }) {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(reel.isLiked || false);
  const [saved, setSaved] = useState(reel.isSaved || false);
  const [likeCount, setLikeCount] = useState(reel.likeCount || 0);
  const [showMuteBadge, setShowMuteBadge] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const muteBadgeTimer = useRef(null);
  const viewRecorded = useRef(false);

  /* Play / pause based on visibility */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.currentTime = 0;
      video.play().catch(() => {});
      // Record view once per activation
      if (!viewRecorded.current) {
        viewRecorded.current = true;
        onView(reel._id);
      }
    } else {
      video.pause();
    }
  }, [isActive, reel._id, onView]);

  /* Progress bar */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isActive) return;
    const update = () => {
      if (video.duration) setProgress((video.currentTime / video.duration) * 100);
    };
    video.addEventListener('timeupdate', update);
    return () => video.removeEventListener('timeupdate', update);
  }, [isActive]);

  /* Toggle mute */
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

  /* Like toggle — optimistic update */
  const toggleLike = async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => wasLiked ? Math.max(0, c - 1) : c + 1);
    try {
      await onLike(reel._id);
    } catch {
      // Revert on failure
      setLiked(wasLiked);
      setLikeCount((c) => wasLiked ? c + 1 : Math.max(0, c - 1));
    }
  };

  /* Save toggle */
  const toggleSave = async () => {
    const wasSaved = saved;
    setSaved(!wasSaved);
    try {
      await onSave(reel._id);
    } catch {
      setSaved(wasSaved);
    }
  };

  const partnerName = reel.foodPartner?.name || 'FoodReels';
  const partnerAvatar = reel.foodPartner?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerName)}&background=f97316&color=fff&size=64`;

  return (
    <div className="reel-slide" data-index={index} role="article" aria-label={`Food reel: ${reel.name}`}>
      {/* Progress bar */}
      <div className="reel-progress" style={{ width: `${progress}%` }} aria-hidden="true" />

      {/* Video */}
      <video
        ref={videoRef}
        className="reel-video"
        src={reel.video}
        loop
        muted={muted}
        playsInline
        preload={isActive ? 'auto' : 'metadata'}
        onClick={toggleMute}
        aria-label={`Video of ${reel.name}`}
      />

      {/* Gradient scrim */}
      <div className="reel-scrim" aria-hidden="true" />

      {/* Mute badge */}
      <div className={`reel-mute-badge${showMuteBadge ? ' show' : ''}`} aria-hidden="true">
        <i className={`fa-solid ${muted ? 'fa-volume-xmark' : 'fa-volume-high'}`} style={{ fontSize: 28, color: '#fff' }} />
      </div>

      {/* Store chip — top left */}
      <button
        className="reel-store-chip"
        onClick={() => navigate(`/food-partner/${reel.foodPartner?._id}`)}
        aria-label={`View ${partnerName}'s profile`}
      >
        <img className="reel-store-chip__avatar" src={partnerAvatar} alt="" aria-hidden="true" />
        <i className="fa-solid fa-store reel-store-chip__icon" aria-hidden="true" />
        <span className="reel-store-chip__name">{partnerName}</span>
      </button>

      {/* Right action buttons */}
      <div className="reel-actions" role="group" aria-label="Reel actions">
        {/* Like */}
        <button
          className={`reel-action-btn${liked ? ' liked' : ''}`}
          onClick={toggleLike}
          aria-label={liked ? 'Unlike this reel' : 'Like this reel'}
          aria-pressed={liked}
        >
          <div className="reel-action-btn__icon">
            <i className={`${liked ? 'fa-solid' : 'fa-regular'} fa-heart`}
               style={{ fontSize: 22, color: liked ? '#ef4444' : '#fff' }} aria-hidden="true" />
          </div>
          <span className="reel-action-btn__label">{fmt(likeCount)}</span>
        </button>

        {/* Save */}
        <button
          className={`reel-action-btn${saved ? ' saved' : ''}`}
          onClick={toggleSave}
          aria-label={saved ? 'Remove from saved' : 'Save this reel'}
          aria-pressed={saved}
        >
          <div className="reel-action-btn__icon">
            <i className={`${saved ? 'fa-solid' : 'fa-regular'} fa-bookmark`}
               style={{ fontSize: 22, color: saved ? '#f97316' : '#fff' }} aria-hidden="true" />
          </div>
          <span className="reel-action-btn__label">Save</span>
        </button>

        {/* Share */}
        <button
          className="reel-action-btn"
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: reel.name, text: reel.description, url: window.location.href });
            }
          }}
          aria-label="Share this reel"
        >
          <div className="reel-action-btn__icon">
            <i className="fa-solid fa-share-nodes" style={{ fontSize: 20, color: '#fff' }} aria-hidden="true" />
          </div>
          <span className="reel-action-btn__label">Share</span>
        </button>
      </div>

      {/* Bottom overlay */}
      <div className="reel-bottom">
        <p
          className={`reel-description${descExpanded ? ' expanded' : ''}`}
          onClick={() => setDescExpanded((e) => !e)}
          title={reel.description}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setDescExpanded((x) => !x)}
        >
          <span className="reel-description__store-name">{partnerName} · </span>
          <strong>{reel.name}</strong>
          {reel.description && ` — ${reel.description}`}
        </p>

        <button
          id={`visit-store-${reel._id}`}
          className="reel-visit-btn"
          onClick={() => navigate(`/food-partner/${reel.foodPartner?._id}`)}
        >
          <i className="fa-solid fa-bag-shopping" aria-hidden="true" />
          Visit Store
        </button>
      </div>
    </div>
  );
}

/* ─── Home Page ─── */
const Home = () => {
  const feedRef = useRef(null);
  const { toast } = useToast();
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const [reels, setReels] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const loadedOnce = useRef(false);

  /* Fetch feed */
  const fetchFeed = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      const res = await getFeedItems(pageNum);
      const { foodItems, pagination } = res.data.data;

      setReels((prev) => append ? [...prev, ...foodItems] : foodItems);
      setHasMore(pagination.hasNextPage);
      setPage(pageNum);
    } catch (err) {
      if (err.response?.status !== 401) {
        toast({ message: 'Failed to load feed. Please refresh.', type: 'error' });
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!loadedOnce.current) {
      loadedOnce.current = true;
      fetchFeed(1, false);
    }
  }, [fetchFeed]);

  /* Intersection Observer — active slide tracking + infinite scroll */
  useEffect(() => {
    const feed = feedRef.current;
    if (!feed || reels.length === 0) return;

    const slides = feed.querySelectorAll('.reel-slide:not(.reel-skeleton)');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index);
            setActiveIndex(idx);
            if (idx > 0) setShowHint(false);

            // Load more when near the end
            if (idx >= reels.length - 2 && hasMore && !loadingMore) {
              fetchFeed(page + 1, true);
            }
          }
        });
      },
      { root: feed, threshold: 0.6 }
    );

    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [reels, hasMore, loadingMore, page, fetchFeed]);

  const handleLike = useCallback(async (foodId) => {
    if (!isAuthenticated) {
      toast({ message: 'Sign in to like reels!', type: 'info' });
      navigate('/user/login');
      return;
    }
    await likeFood(foodId);
  }, [isAuthenticated, toast, navigate]);

  const handleSave = useCallback(async (foodId) => {
    if (!isAuthenticated) {
      toast({ message: 'Sign in to save reels!', type: 'info' });
      navigate('/user/login');
      return;
    }
    await saveFood(foodId);
    toast({ message: 'Saved! 🔖', type: 'success' });
  }, [isAuthenticated, toast, navigate]);

  const handleView = useCallback((foodId) => {
    incrementView(foodId).catch(() => {}); // Fire-and-forget
  }, []);

  if (loading) {
    return (
      <div className="reels-feed" aria-label="Loading feed">
        <SkeletonReel />
        <SkeletonReel />
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="reels-empty">
        <div className="reels-empty__icon">🎬</div>
        <h2>No reels yet!</h2>
        <p>Be the first to share a food reel.</p>
        {role === 'food-partner' && (
          <button className="reel-visit-btn" onClick={() => navigate('/create-food')}>
            Create a Reel
          </button>
        )}
      </div>
    );
  }

  return (
    <main className="reels-feed" ref={feedRef} aria-label="Food reels feed">
      {reels.map((reel, i) => (
        <ReelSlide
          key={reel._id}
          reel={reel}
          isActive={i === activeIndex}
          index={i}
          onLike={handleLike}
          onSave={handleSave}
          onView={handleView}
        />
      ))}

      {/* Loading more indicator */}
      {loadingMore && <SkeletonReel />}

      {/* Scroll hint */}
      {showHint && (
        <div className="scroll-hint" aria-hidden="true">
        <i className="fa-solid fa-chevron-down" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 20 }} />
        <span>Swipe up</span>
      </div>
      )}
    </main>
  );
};

export default Home;