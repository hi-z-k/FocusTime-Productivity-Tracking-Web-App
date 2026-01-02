// services/youtubeService.js

export const getFocusedVideos = async (query) => {
  // Use your .env variable for security
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY; 
  
  // We keep 'snippet' to get the categoryId and metadata
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=20&type=video&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    // YouTube Educational Categories
    const EDUCATIONAL_CATEGORIES = ["27", "28"]; 
    
    // Keywords for extra safety (Fall-back)
    const KEYWORDS = ["tutorial", "lesson", "coding", "explained", "course", "lecture"];

    const filtered = (data.items || []).filter(video => {
      const title = video.snippet.title.toLowerCase();
      const categoryId = video.snippet.categoryId; // This is a string

      // LOGIC: Keep if it's in an Edu category OR has an Edu keyword
      const isEduCategory = EDUCATIONAL_CATEGORIES.includes(categoryId);
      const hasEduKeyword = KEYWORDS.some(key => title.includes(key));

      return isEduCategory || hasEduKeyword;
    });

    return {
      success: true,
      data: filtered,
      totalFound: data.items?.length || 0
    };
  } catch (error) {
    console.error("YouTube Service Error:", error);
    return { success: false, data: [], error: error.message };
  }
};