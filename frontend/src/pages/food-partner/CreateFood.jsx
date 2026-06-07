import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createFoodReel } from '../../api/food.api';
import { useToast } from '../../components/ui/Toast';
import '../../styles/create-food.css';

const CreateFood = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  
  // UI states
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Refs
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  // Constants
  const MAX_NAME_CHARS = 60;
  const MAX_DESC_CHARS = 300;
  const MAX_FILE_SIZE_MB = 50;

  // Handle Drag Events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Process selected file
  const processFile = (file) => {
    if (!file) return;

    // Validate type (must be video)
    if (!file.type.startsWith('video/')) {
      setError('Please upload a valid video file (e.g. MP4, WebM).');
      return;
    }

    // Validate size (e.g. 50MB limit)
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      setError(`Video file is too large (${fileSizeMB.toFixed(1)}MB). Max size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setError(null);
    setVideoFile(file);
    
    // Revoke previous URL to prevent memory leaks
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    
    // Generate object URL for preview
    const previewUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(previewUrl);
  };

  // Handle Drop Event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Handle Input File Select
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Trigger file selection click
  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  // Remove current video preview
  const handleRemoveVideo = () => {
    setVideoFile(null);
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
      setVideoPreviewUrl(null);
    }
    setError(null);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final Validations
    if (!videoFile) {
      setError('Please upload a video reel of your dish.');
      return;
    }
    if (!name.trim()) {
      setError('Please enter a name for your dish.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a short description or recipe details.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      // FIX: was 'image' — backend multer field name is 'video'
      formData.append('video', videoFile);
      formData.append('name', name.trim());
      formData.append('description', description.trim());

      // FIX: was hardcoded 'http://localhost:3000/api/food' — now uses centralized API module
      await createFoodReel(formData);

      toast({ message: 'Your food reel is live! 🎉', type: 'success' });
      setSuccess(true);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to create food reel. Please try again.';
      setError(errMsg);
      toast({ message: errMsg, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    handleRemoveVideo();
    setSuccess(false);
  };

  return (
    <div className="create-food-page">
      
      {/* ── Top Sticky Navigation ── */}
      <header className="create-food-header">
        <Link to="/food-partner/profile" className="create-food-header__back-btn" aria-label="Go back to profile">
          <svg viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </Link>
        <h2 className="create-food-header__title">Create Reel</h2>
      </header>

      {/* ── Main Layout Content ── */}
      <main className="create-food-content">
        
        {/* Intro Banner */}
        <div className="create-food-intro">
          <h1>Share Your Signature Dish</h1>
          <p>Create a beautiful food reel to capture customers' attention. Keep it short, sweet, and visually mouth-watering!</p>
        </div>

        {/* Dynamic Card Container */}
        <div className="create-food-card">
          
          {success ? (
            /* Success Screen overlay */
            <div className="success-screen">
              <div className="success-screen__icon-container">
                🎉
              </div>
              <h2>Mouth-Watering Reel Published!</h2>
              <p>Your food reel is now live and will show up in customer feeds. Great job!</p>
              
              <div className="success-screen__buttons">
                <button 
                  onClick={() => navigate('/food-partner/profile')} 
                  className="btn-submit"
                >
                  Go to Profile
                </button>
                <button 
                  onClick={resetForm} 
                  className="btn-cancel"
                >
                  Create Another Reel
                </button>
              </div>
            </div>
          ) : (
            /* Form Grid Layout */
            <div className="create-food-grid">
              
              {/* Media Section: Left on Desktop, Top on Mobile */}
              <div className="create-food-media-section">
                
                {!videoPreviewUrl ? (
                  /* Upload Zone */
                  <div 
                    className={`video-dropzone ${dragActive ? 'video-dropzone--active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileSelect}
                    role="button"
                    tabIndex={0}
                    aria-label="Upload food reel video"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="video-dropzone__input"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={handleFileChange}
                    />
                    <div className="video-dropzone__icon-container">
                      {/* Video/Cloud Icon */}
                      <svg viewBox="0 0 24 24">
                        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/>
                      </svg>
                    </div>
                    <h3 className="video-dropzone__title">Select Food Reel</h3>
                    <p className="video-dropzone__desc">Drag & drop your video here, or tap to browse your files.</p>
                    <span className="video-dropzone__badge">Choose Video</span>
                  </div>
                ) : (
                  /* Video Preview Component */
                  <div className="video-preview-box">
                    <video
                      ref={videoRef}
                      src={videoPreviewUrl}
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                    
                    {/* Floating remove button */}
                    <div className="video-preview-actions">
                      <button 
                        type="button" 
                        className="video-preview-btn" 
                        onClick={handleRemoveVideo}
                        aria-label="Remove video"
                        title="Remove video"
                      >
                        <svg viewBox="0 0 24 24">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                      </button>
                    </div>

                    {/* Quick feedback footer inside video preview */}
                    <div className="video-preview-footer">
                      <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      <span>Ready to upload ({videoFile ? `${(videoFile.size / (1024 * 1024)).toFixed(1)} MB` : ''})</span>
                    </div>
                  </div>
                )}
                
              </div>

              {/* Form Input Section: Right on Desktop, Bottom on Mobile */}
              <div className="create-food-form-section">
                <form className="create-food-form" onSubmit={handleSubmit} noValidate>
                  
                  {/* Name Input field */}
                  <div className="form-field">
                    <div className="form-field__label-row">
                      <label className="form-field__label" htmlFor="food-name">
                        <span className="form-field__label-icon">
                          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2zm4 8h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                        </span>
                        Dish Name
                      </label>
                      <span className={`form-field__counter ${name.length > MAX_NAME_CHARS ? 'form-field__counter--warn' : ''}`}>
                        {name.length}/{MAX_NAME_CHARS}
                      </span>
                    </div>
                    
                    <div className="form-field__input-wrapper">
                      <span className="form-field__input-icon">
                        {/* Food Dome / Cloche / Restaurant Icon */}
                        <svg viewBox="0 0 24 24">
                          <path d="M1 21.99h22v-2H1v2zM12 2c-4.97 0-9 4.03-9 9h18c0-4.97-4.03-9-9-9z"/>
                        </svg>
                      </span>
                      <input
                        id="food-name"
                        type="text"
                        className="form-field__input"
                        placeholder="e.g. Crispy Garlic Butter Naan"
                        value={name}
                        onChange={(e) => setName(e.target.value.slice(0, MAX_NAME_CHARS))}
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                    <span className="form-field__help">Keep it short, memorable, and descriptive.</span>
                  </div>

                  {/* Description Textarea field */}
                  <div className="form-field">
                    <div className="form-field__label-row">
                      <label className="form-field__label" htmlFor="food-description">
                        <span className="form-field__label-icon">
                          <svg viewBox="0 0 24 24"><path d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z"/></svg>
                        </span>
                        Recipe Description
                      </label>
                      <span className={`form-field__counter ${description.length > MAX_DESC_CHARS ? 'form-field__counter--warn' : ''}`}>
                        {description.length}/{MAX_DESC_CHARS}
                      </span>
                    </div>
                    
                    <div className="form-field__input-wrapper">
                      <span className="form-field__input-icon" style={{ top: '15px', transform: 'none' }}>
                        {/* Sparkles / Recipe Description Icon */}
                        <svg viewBox="0 0 24 24">
                          <path d="M9 16.57L4.83 12.4l-1.42 1.41L9 19.39l12-12-1.41-1.41L9 16.57z"/>
                        </svg>
                      </span>
                      <textarea
                        id="food-description"
                        className="form-field__input"
                        placeholder="Tell the story of this dish! What ingredients make it unique? Briefly write instructions or caption..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESC_CHARS))}
                        disabled={isSubmitting}
                        rows={4}
                        required
                      />
                    </div>
                    <span className="form-field__help">Mention key highlights (e.g. gluten-free, spicy, chefs-choice).</span>
                  </div>

                  {/* Dynamic Alert Messages */}
                  {error && (
                    <div className="form-alert form-alert--error" role="alert">
                      <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Actions (Buttons) */}
                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="btn-submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="spinner" viewBox="0 0 50 50">
                            <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                          </svg>
                          <span>Uploading Dish...</span>
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                          <span>Publish Food Reel</span>
                        </>
                      )}
                    </button>
                    
                    <button 
                      type="button" 
                      className="btn-cancel"
                      onClick={() => navigate('/food-partner/profile')}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                  </div>

                </form>
              </div>

            </div>
          )}

        </div>

      </main>

    </div>
  );
};

export default CreateFood;
