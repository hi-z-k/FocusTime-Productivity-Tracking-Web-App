import React, { useState, useCallback, useRef } from "react";
import { getFocusedVideos } from "../../services/youtubeService";
import "../../styles/youtube.css";

// Debounce helper to prevent firing the API on every single keystroke
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

export default function YouTubeFocus() {
  const [videos, setVideos] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isDistraction, setIsDistraction] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Ref to store the AbortController so we can cancel pending requests
  const abortControllerRef = useRef(null);

  // The core search logic wrapped in a debounce
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      // 1. If the input is empty, reset the state and don't call the API
      if (!query.trim()) {
        setVideos([]);
        setHasSearched(false);
        setLoading(false);
        setIsDistraction(false);
        return;
      }

      // 2. Cancel any search request that is still in progress
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // 3. Create a new controller for the current request
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      setIsDistraction(false);

      const result = await getFocusedVideos(query, controller.signal);

      // 4. Only update state if the request wasn't cancelled
      if (result) {
        setHasSearched(true);
        setLoading(false);

        if (result.success) {
          setVideos(result.data);
          setIsDistraction(result.totalFound > 0 && result.data.length === 0);
        }
      }
    }, 500), // 500ms delay is a good balance for API safety
    []
  );

  const handleInputChange = (e) => {
    debouncedSearch(e.target.value);
  };

  return (
    <div className="yt-container">
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
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="yt-player-info">
            <h2>{selectedVideo.snippet.title}</h2>
            <p>{selectedVideo.snippet.channelTitle}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="yt-header">
            <h1>YouTube Focus Mode</h1>
            <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
              Distraction-free learning. Only educational content allowed.
            </p>
            <div className="yt-search-wrapper">
              <input
                type="text"
                placeholder="Search tutorials, lectures, or topics... 🔎"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="yt-content">
            {loading && (
              <div style={{ textAlign: "center", padding: "50px" }}>
                <div className="loader"></div>
                <p>Filtering distractions...</p>
              </div>
            )}

            {isDistraction && !loading && (
              <div className="distraction-warning">
                <span className="warning-icon">🚫</span>
                <h3>Distraction Blocked</h3>
                <p>
                  That topic seems non-educational. Try "Data Structures" or
                  "Chemistry Basics".
                </p>
              </div>
            )}

            {!hasSearched && !loading && (
              <div
                style={{
                  textAlign: "center",
                  opacity: 0.5,
                  marginTop: "100px",
                }}
              >
                <span style={{ fontSize: "4rem" }}>📚</span>
                <h3>Ready to learn?</h3>
                <p>Search for a topic to start your focused study session.</p>
              </div>
            )}

            <div className="yt-grid">
              {!loading &&
                videos.map((v) => (
                  <div
                    key={v.id.videoId}
                    className="yt-card"
                    onClick={() => setSelectedVideo(v)}
                  >
                    <img
                      src={v.snippet.thumbnails.medium.url}
                      alt="thumbnail"
                    />
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
