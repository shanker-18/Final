/**
 * Utility functions for video optimization
 */
import { getCachedThumbnail, cacheThumbnail, getCachedVideoMetadata, cacheVideoMetadata } from '../services/videoCacheService';

// Preload queue for managing concurrent thumbnail loading
const preloadQueue = [];
let isProcessingQueue = false;
const MAX_CONCURRENT_LOADS = 3;
const activeLoads = new Set();

/**
 * Generates a thumbnail URL for a video
 * @param {string} videoId - The ID of the video
 * @param {string} baseUrl - The base URL for the API
 * @returns {string} - The thumbnail URL
 */
export const getVideoThumbnailUrl = (videoUrl) => {
  if (!videoUrl) return null;
  
  // If it's a Cloudinary URL, generate a thumbnail
  if (videoUrl.includes('cloudinary.com')) {
    return videoUrl.replace('/upload/', '/upload/w_640,h_360,c_fill,g_center,q_auto,f_auto/');
  }
  
  // For other video URLs, you might want to generate a thumbnail using your backend
  // For now, return the video URL itself
  return videoUrl;
};

/**
 * Generates an optimized video URL for streaming
 * @param {string} videoId - The ID of the video
 * @param {string} baseUrl - The base URL for the API
 * @returns {string} - The video URL
 */
export const getOptimizedVideoUrl = (url) => {
  if (!url) return null;
  
  // If it's already a full URL, return it
  if (url.startsWith('http')) {
    // If it's a Cloudinary URL, optimize it
    if (url.includes('cloudinary.com')) {
      return url.replace('/upload/', '/upload/q_auto,f_auto,c_limit/');
    }
    return url;
  }
  
  // If it's a relative URL, make it absolute
  if (url.startsWith('/')) {
    return `${window.location.origin}${url}`;
  }
  
  return url;
};

/**
 * Process the preload queue
 * @private
 */
const processPreloadQueue = async () => {
  if (isProcessingQueue || preloadQueue.length === 0 || activeLoads.size >= MAX_CONCURRENT_LOADS) {
    return;
  }
  
  isProcessingQueue = true;
  
  while (preloadQueue.length > 0 && activeLoads.size < MAX_CONCURRENT_LOADS) {
    const { videoUrl, baseUrl, resolve, reject } = preloadQueue.shift();
    
    if (!videoUrl) {
      reject(new Error('No video URL provided'));
      continue;
    }
    
    // Extract video ID from URL if needed
    let videoId = videoUrl;
    if (videoUrl.includes('/')) {
      const urlParts = videoUrl.split('/');
      videoId = urlParts[urlParts.length - 1].split('?')[0];
    }
    
    // Check cache first
    const cachedThumbnail = getCachedThumbnail(videoId);
    if (cachedThumbnail) {
      resolve(cachedThumbnail);
      continue;
    }
    
    // Add to active loads
    activeLoads.add(videoId);
    
    // Use a placeholder image for development/testing
    const placeholderUrl = "https://picsum.photos/640/360";
    
    try {
      // In a real environment, you would fetch the actual thumbnail
      // For now, we'll use the placeholder and cache it
      cacheThumbnail(videoId, placeholderUrl);
      
      // Simulate network delay for development
      await new Promise(r => setTimeout(r, 100));
      
      resolve(placeholderUrl);
    } catch (error) {
      console.error('Error preloading thumbnail:', error);
      reject(error);
    } finally {
      activeLoads.delete(videoId);
    }
    
    // Uncomment this code when your API is ready to serve thumbnails
    /*
    try {
      const thumbnailUrl = `${baseUrl}/thumbnails/${videoId}`;
      const img = new Image();
      
      const imageLoaded = new Promise((imgResolve, imgReject) => {
        img.onload = () => imgResolve();
        img.onerror = () => imgReject(new Error('Failed to load thumbnail'));
      });
      
      img.src = thumbnailUrl;
      
      await imageLoaded;
      
      // Cache the thumbnail URL
      cacheThumbnail(videoId, thumbnailUrl);
      resolve(thumbnailUrl);
    } catch (error) {
      console.error('Error loading thumbnail:', error);
      const fallbackUrl = "https://via.placeholder.com/640x360?text=Video+Preview";
      cacheThumbnail(videoId, fallbackUrl);
      resolve(fallbackUrl);
    } finally {
      activeLoads.delete(videoId);
    }
    */
  }
  
  isProcessingQueue = false;
  
  // If there are more items in the queue and we have capacity, process them
  if (preloadQueue.length > 0 && activeLoads.size < MAX_CONCURRENT_LOADS) {
    setTimeout(processPreloadQueue, 0);
  }
};

/**
 * Preloads a video thumbnail
 * @param {string} videoUrl - The URL or ID of the video
 * @param {string} baseUrl - The base URL for the API
 * @returns {Promise} - A promise that resolves when the thumbnail is loaded
 */
export const preloadVideoThumbnail = (thumbnailUrl) => {
  if (!thumbnailUrl) return Promise.resolve();
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      console.log('Thumbnail loaded:', thumbnailUrl);
      resolve();
    };
    img.onerror = (error) => {
      console.error('Error loading thumbnail:', error);
      reject(error);
    };
    img.src = thumbnailUrl;
  });
};

/**
 * Preload multiple thumbnails at once
 * @param {Array<string>} videoIds - Array of video IDs
 * @returns {Promise<Object>} - A promise that resolves when all thumbnails are loaded
 */
export const preloadMultipleThumbnails = async (thumbnailUrls) => {
  if (!thumbnailUrls || !thumbnailUrls.length) return;
  
  console.log('Preloading thumbnails:', thumbnailUrls);
  
  const preloadPromises = thumbnailUrls
    .filter(url => url)
    .map(url => preloadVideoThumbnail(url));
  
  try {
    await Promise.all(preloadPromises);
    console.log('All thumbnails preloaded successfully');
  } catch (error) {
    console.error('Error preloading thumbnails:', error);
  }
};

/**
 * Checks if a video can be played in the browser
 * @returns {boolean} - Whether the browser supports video playback
 */
export const canPlayVideo = () => {
  const video = document.createElement('video');
  return !!video.canPlayType;
};

/**
 * Checks if the browser supports a specific video format
 * @param {string} format - The video format to check (e.g., 'video/mp4')
 * @returns {boolean} - Whether the browser supports the format
 */
export const supportsVideoFormat = (format) => {
  const video = document.createElement('video');
  return !!video.canPlayType(format);
}; 