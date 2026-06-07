import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/profile.css';
import { getMyProfile } from '../../api/partner.api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';

function fmt(n) {
  if (typeof n === 'string') return n;
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace('.0', '') + 'K';
  return String(n || 0);
}

const Profile = () => {
  const navigate = useNavigate();
  const { partner: authPartner, logout } = useAuth();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();
        setProfileData(res.data.data);
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to load profile.';
        setError(msg);
        toast({ message: msg, type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [toast]);

  const handleLogout = async () => {
    await logout();
    toast({ message: 'Logged out successfully.', type: 'info' });
    navigate('/food-partner/login');
  };

  if (loading) {
    return (
      <div className="profile-page profile-page--loading" aria-label="Loading profile…">
        <div className="profile-skeleton">
          <div className="skeleton-block skeleton-avatar" />
          <div className="skeleton-block skeleton-name" />
          <div className="skeleton-block skeleton-stat" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page profile-page--error">
        <div className="profile-error">
          <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '2rem', color: '#f97316' }} aria-hidden="true" />
          <p>{error}</p>
          <button className="profile-edit-btn" onClick={() => window.location.reload()}>
            <i className="fa-solid fa-rotate-right" aria-hidden="true" /> Retry
          </button>
        </div>
      </div>
    );
  }

  const { partner, reels = [], stats = {} } = profileData || {};

  return (
    <div className="profile-page">

      {/* ════ HEADER ════ */}
      <header className="profile-header">
        <div className="profile-header__top">

          {/* Avatar */}
          <div className="profile-avatar">
            {partner?.avatarUrl ? (
              <img src={partner.avatarUrl} alt={partner.name} />
            ) : (
              <div className="profile-avatar__placeholder" aria-hidden="true">
                <i className="fa-solid fa-store" style={{ fontSize: 28, color: 'rgba(255,255,255,0.5)' }} />
              </div>
            )}
            <div className="profile-avatar__edit" role="button" aria-label="Change avatar" tabIndex={0}>
              <i className="fa-solid fa-pen" style={{ fontSize: 10, color: '#fff' }} aria-hidden="true" />
            </div>
          </div>

          {/* Business info */}
          <div className="profile-info">
            <h1 className="profile-info__name">{partner?.name || authPartner?.name}</h1>

            <div className="profile-info__address" aria-label="Restaurant address">
              <i className="fa-solid fa-location-dot" aria-hidden="true" />
              <span>{partner?.address || 'No address provided'}</span>
            </div>

            <div className="profile-info__actions">
              <button id="edit-profile-btn" className="profile-edit-btn">
                <i className="fa-solid fa-pen-to-square" aria-hidden="true" /> Edit Profile
              </button>
              <button className="profile-logout-btn" onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket" aria-hidden="true" /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="profile-stats" role="list">
          <div className="profile-stat" role="listitem">
            <span className="profile-stat__value">{fmt(stats.totalReels || reels.length)}</span>
            <span className="profile-stat__label">Reels</span>
          </div>
          <div className="profile-stat" role="listitem">
            <span className="profile-stat__value">{fmt(stats.totalLikes)}</span>
            <span className="profile-stat__label">
              <i className="fa-solid fa-heart" style={{ color: '#ef4444', marginRight: 4 }} aria-hidden="true" />
              Likes
            </span>
          </div>
          <div className="profile-stat" role="listitem">
            <span className="profile-stat__value">{fmt(stats.totalViews)}</span>
            <span className="profile-stat__label">
              <i className="fa-solid fa-eye" style={{ color: '#64748b', marginRight: 4 }} aria-hidden="true" />
              Views
            </span>
          </div>
        </div>
      </header>

      {/* ════ VIDEO GRID ════ */}
      <section aria-label="My reels">
        <div className="profile-grid-header">
          <span className="profile-grid-header__title">
            <i className="fa-solid fa-clapperboard" style={{ marginRight: 8, color: '#f97316' }} aria-hidden="true" />
            My Reels
          </span>
          <div className="profile-grid-header__actions">
            <span className="profile-grid-header__count">{reels.length} videos</span>
            <Link to="/create-food" className="profile-add-reel-btn" aria-label="Add new reel">
              <i className="fa-solid fa-plus" aria-hidden="true" /> Add Reel
            </Link>
          </div>
        </div>

        <div className="profile-grid" role="list">
          {reels.length === 0 ? (
            <div className="profile-grid-empty" role="listitem">
              <i className="fa-solid fa-film" style={{ fontSize: '3rem', opacity: 0.4 }} aria-hidden="true" />
              <p>No reels yet. Share your first food video!</p>
              <Link to="/create-food" id="add-first-reel-btn" className="profile-add-btn">
                <i className="fa-solid fa-plus" aria-hidden="true" /> Add Reel
              </Link>
            </div>
          ) : (
            reels.map((reel) => <GridCell key={reel._id} reel={reel} />)
          )}
        </div>
      </section>
    </div>
  );
};

/* ─── Grid Cell ─── */
function GridCell({ reel }) {
  const videoRef = React.useRef(null);

  const handleMouseEnter = () => videoRef.current?.play().catch(() => {});
  const handleMouseLeave = () => {
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
  };

  return (
    <div
      id={`reel-cell-${reel._id}`}
      className="profile-grid-cell"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="listitem"
      tabIndex={0}
      aria-label={`Reel: ${reel.name}, ${fmt(reel.likeCount)} likes`}
      onKeyDown={(e) => e.key === 'Enter' && videoRef.current?.play().catch(() => {})}
    >
      <video ref={videoRef} src={reel.video} muted loop playsInline preload="metadata" aria-label={reel.name} />

      <div className="profile-grid-cell__play" aria-hidden="true">
        <i className="fa-solid fa-play" style={{ fontSize: 28, color: 'rgba(255,255,255,0.9)' }} />
      </div>

      <div className="profile-grid-cell__overlay" aria-hidden="true">
        <div className="profile-grid-cell__stat">
          <i className="fa-solid fa-heart" style={{ color: '#ef4444' }} />
          <span>{fmt(reel.likeCount)}</span>
        </div>
        <div className="profile-grid-cell__stat">
          <i className="fa-solid fa-eye" />
          <span>{fmt(reel.viewCount)}</span>
        </div>
      </div>
    </div>
  );
}

export default Profile;
