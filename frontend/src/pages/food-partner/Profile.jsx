import React, { useState } from 'react';
import '../../styles/profile.css';

/* ─────────────────────────────────────────────
   Mock data — replace with API response
───────────────────────────────────────────── */
const PARTNER_DATA = {
  businessName: 'Spice Garden',
  address: '12, MG Road, Bengaluru, Karnataka',
  avatarUrl: null,                    // set to URL string when available
  totalMeals: 43,
  customersServed: '15K',
  reels: [
    { id: 1, thumbnailUrl: null, videoUrl: '/videos/testMeal.mp4', likes: 2341, views: '18K' },
    { id: 2, thumbnailUrl: null, videoUrl: '/videos/testMeal.mp4', likes: 1892, views: '12K' },
    { id: 3, thumbnailUrl: null, videoUrl: '/videos/testMeal.mp4', likes: 3210, views: '25K' },
    { id: 4, thumbnailUrl: null, videoUrl: '/videos/testMeal.mp4', likes: 890,  views: '6K'  },
    { id: 5, thumbnailUrl: null, videoUrl: '/videos/testMeal.mp4', likes: 4520, views: '31K' },
    { id: 6, thumbnailUrl: null, videoUrl: '/videos/testMeal.mp4', likes: 1130, views: '9K'  },
    { id: 7, thumbnailUrl: null, videoUrl: '/videos/testMeal.mp4', likes: 2780, views: '20K' },
    { id: 8, thumbnailUrl: null, videoUrl: '/videos/testMeal.mp4', likes: 660,  views: '5K'  },
    { id: 9, thumbnailUrl: null, videoUrl: '/videos/testMeal.mp4', likes: 5100, views: '40K' },
  ],
};

/* ── Utility: format numbers ── */
function fmt(n) {
  if (typeof n === 'string') return n;
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1).replace('.0', '') + 'K';
  return String(n);
}

/* ─────────────────────────────────────────────
   Profile Page Component
───────────────────────────────────────────── */
const Profile = () => {
  const [partner] = useState(PARTNER_DATA);

  return (
    <div className="profile-page">

      {/* ════ HEADER CARD ════ */}
      <div className="profile-header">

        {/* Top row: avatar + info */}
        <div className="profile-header__top">

          {/* Avatar */}
          <div className="profile-avatar">
            {partner.avatarUrl ? (
              <img src={partner.avatarUrl} alt={partner.businessName} />
            ) : (
              <div className="profile-avatar__placeholder">
                {/* store / shop icon */}
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4v2l8 5 8-5V4zm0 4.236-8 5-8-5V20h16V8.236z"/>
                </svg>
              </div>
            )}
            {/* edit overlay */}
            <div className="profile-avatar__edit" role="button" aria-label="Change avatar">
              <svg viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>

          {/* Business name + address + edit button */}
          <div className="profile-info">
            <h1 className="profile-info__name">{partner.businessName}</h1>

            <div className="profile-info__address" role="button" aria-label="View address">
              {/* pin icon */}
              <svg viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span>{partner.address}</span>
            </div>

            <button id="edit-profile-btn" className="profile-edit-btn">
              {/* pencil icon */}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.46a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              Edit Profile
            </button>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat__label">Total Meals</span>
            <span className="profile-stat__value">{fmt(partner.totalMeals)}</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__label">Customers Served</span>
            <span className="profile-stat__value">{fmt(partner.customersServed)}</span>
          </div>
        </div>

      </div>{/* /profile-header */}

      {/* ════ VIDEO GRID ════ */}
      <div className="profile-grid-header">
        <span className="profile-grid-header__title">My Reels</span>
        <span className="profile-grid-header__count">{partner.reels.length} videos</span>
      </div>

      <div className="profile-grid">
        {partner.reels.length === 0 ? (
          <div className="profile-grid-empty">
            {/* video-off icon */}
            <svg viewBox="0 0 24 24"><path d="M18 10.48V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4.48l4 3.98v-11l-4 3.5zm-2-.79V18H4V6h12v3.69z"/></svg>
            <p>No reels yet. Share your first food video!</p>
            <button id="add-first-reel-btn" className="profile-add-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M19 13H13v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Add Reel
            </button>
          </div>
        ) : (
          partner.reels.map((reel) => (
            <GridCell key={reel.id} reel={reel} />
          ))
        )}
      </div>

    </div>
  );
};

/* ─────────────────────────────────────────────
   Grid Cell — individual video thumbnail
───────────────────────────────────────────── */
function GridCell({ reel }) {
  const videoRef = React.useRef(null);

  const handleMouseEnter = () => {
    videoRef.current?.play().catch(() => {});
  };
  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      id={`reel-cell-${reel.id}`}
      className="profile-grid-cell"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      aria-label={`View reel ${reel.id}`}
      tabIndex={0}
    >
      {/* Thumbnail or video */}
      {reel.thumbnailUrl ? (
        <img src={reel.thumbnailUrl} alt={`Reel ${reel.id} thumbnail`} />
      ) : (
        <video
          ref={videoRef}
          src={reel.videoUrl}
          muted
          loop
          playsInline
          preload="metadata"
        />
      )}

      {/* Play badge (top-right) */}
      <div className="profile-grid-cell__play">
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </div>

      {/* Hover overlay — likes + views */}
      <div className="profile-grid-cell__overlay">
        {/* likes */}
        <div className="profile-grid-cell__stat">
          <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          <span>{fmt(reel.likes)}</span>
        </div>
        {/* views */}
        <div className="profile-grid-cell__stat">
          <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
          <span>{reel.views}</span>
        </div>
      </div>

    </div>
  );
}

export default Profile;
