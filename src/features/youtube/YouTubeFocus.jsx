import React, { useState, useEffect } from "react";
import { getFocusedVideos } from "../../services/youtubeService";
import "../../styles/youtube.css";

export default function YouTubeFocus() {
  const [videos, setVideos] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isDistraction, setIsDistraction] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleSearch = async (query) => {
    if (!query) return;
    setLoading(true);
    setIsDistraction(false);
    
    const result = await getFocusedVideos(query);
    setHasSearched(true);
    setLoading(false);
    
    if (result.success) {
      setVideos(result.data);
      setIsDistraction(result.totalFound > 0 && result.data.length === 0);
    }
  };

  // Main Return Statement
  return (
    <div className="yt-container">
      {/* 1. Conditional Rendering for Player View */}
      {selectedVideo ? (
        <div className="yt-player-view">
          <button className="back-btn" onClick={() => setSelectedVideo(null)}>
            ← Back to Results
          </button>
          <div className="video-responsive">
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.id.videoId}?rel=0&modestbranding=1&autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
          <h2 className="video-title">{selectedVideo.snippet.title}</h2>
          <p className="video-channel">{selectedVideo.snippet.channelTitle}</p>
        </div>
      ) : (
        /* 2. Search and Gallery View */
        <>
          <div className="yt-header">
            <input 
              type="text" 
              placeholder="Search educational topics...🔎" 
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(e.target.value)}
            />
          </div>

          <div className="yt-content">
            {loading && <p className="loading-text">Filtering distractions...</p>}

            {isDistraction && !loading && (
              <div className="distraction-warning">
                <span className="warning-icon">🚫</span>
                <h3>Distraction Detected</h3>
                <p>Try a more specific educational topic like "React Tutorial".</p>
              </div>
            )}

            {hasSearched && !isDistraction && !loading && videos.length === 0 && (
              <p className="no-results">No videos found. Try different keywords.</p>
            )}

            <div className="yt-grid">
              {!loading && videos.map(v => (
                <div key={v.id.videoId} className="yt-card" onClick={() => setSelectedVideo(v)}>
                  <img src={v.snippet.thumbnails.medium.url} alt="thumbnail" />
                  <div className="yt-card-body">
                    <h3>{v.snippet.title}</h3>
                    <span>{v.snippet.channelTitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}