/**
 * Video Cache Service
 * 
 * This service provides caching functionality for video thumbnails and metadata
 * to improve loading performance.
 */

import { API_BASE_URL } from './api';

// In-memory cache for thumbnails
const thumbnailCache = new Map();

// In-memory cache for video metadata
const metadataCache = new Map();

// Cache expiration time (24 hours in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

// LRU cache size limits
const MAX_MEMORY_CACHE_SIZE = 100;
const MAX_STORAGE_CACHE_SIZE = 200;

// Flag to track if we've initialized from localStorage
let isInitialized = false;

// Flag to track if we're processing a preload queue
let isProcessingQueue = false;

// Queue for preloading thumbnails
const preloadQueue = [];

// Set to track active loads
const activeLoads = new Set();

// Maximum concurrent loads
const MAX_CONCURRENT_LOADS = 5;

// Fallback placeholder image URL
const PLACEHOLDER_IMAGE_URL = "https://picsum.photos/640/360";

class VideoCacheService {
  constructor() {
    this.cache = new Map();
    this.metadataCache = new Map();
    this.initialized = false;
    this.initializationError = null;
  }

  async initialize() {
    try {
      // Clear existing cache
      this.cache.clear();
      this.metadataCache.clear();
      
      // Initialize with empty state
      this.initialized = true;
      this.initializationError = null;
      
      // Log successful initialization
      console.log('Video cache initialized successfully');
      
      return true;
    } catch (error) {
      console.error('Error initializing video cache:', error);
      this.initializationError = error;
      this.initialized = false;
      return false;
    }
  }

  async getVideo(filename) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      if (this.initializationError) {
        throw new Error('Video cache not properly initialized');
      }

      if (this.cache.has(filename)) {
        return this.cache.get(filename);
      }

      // Fetch video from API
      const response = await fetch(`${API_BASE_URL}/api/videos/stream/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.statusText}`);
      }

      const videoBlob = await response.blob();
      this.cache.set(filename, videoBlob);
      return videoBlob;
    } catch (error) {
      console.error('Error getting video from cache:', error);
      throw error;
    }
  }

  async getThumbnail(filename) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      if (this.initializationError) {
        throw new Error('Video cache not properly initialized');
      }

      if (this.cache.has(`thumb_${filename}`)) {
        return this.cache.get(`thumb_${filename}`);
      }

      // Fetch thumbnail from API
      const response = await fetch(`${API_BASE_URL}/api/videos/thumbnail/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch thumbnail: ${response.statusText}`);
      }

      const thumbnailBlob = await response.blob();
      this.cache.set(`thumb_${filename}`, thumbnailBlob);
      return thumbnailBlob;
    } catch (error) {
      console.error('Error getting thumbnail from cache:', error);
      throw error;
    }
  }

  async getMetadata(filename) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      if (this.initializationError) {
        throw new Error('Video cache not properly initialized');
      }

      if (this.metadataCache.has(filename)) {
        return this.metadataCache.get(filename);
      }

      // Fetch metadata from API
      const response = await fetch(`${API_BASE_URL}/api/videos/metadata/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.statusText}`);
      }

      const metadata = await response.json();
      this.metadataCache.set(filename, metadata);
      return metadata;
    } catch (error) {
      console.error('Error getting metadata from cache:', error);
      throw error;
    }
  }

  clearCache() {
    try {
      this.cache.clear();
      this.metadataCache.clear();
      this.initialized = false;
      this.initializationError = null;
      console.log('Video cache cleared successfully');
    } catch (error) {
      console.error('Error clearing video cache:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const videoCacheService = new VideoCacheService();
export default videoCacheService;

/**
 * Caches a thumbnail URL for a video
 * @param {string} videoId - The ID of the video
 * @param {string} thumbnailUrl - The URL of the thumbnail
 */
export const cacheThumbnail = (videoId, thumbnailUrl) => {
  if (!videoId || !thumbnailUrl) return;
  
  // Add to in-memory cache with timestamp
  thumbnailCache.set(videoId, {
    url: thumbnailUrl,
    timestamp: Date.now(),
    lastAccessed: Date.now()
  });
  
  // Enforce memory cache size limit (LRU eviction)
  if (thumbnailCache.size > MAX_MEMORY_CACHE_SIZE) {
    let oldestKey = null;
    let oldestTime = Infinity;
    
    thumbnailCache.forEach((value, key) => {
      if (value.lastAccessed < oldestTime) {
        oldestTime = value.lastAccessed;
        oldestKey = key;
      }
    });
    
    if (oldestKey) {
      thumbnailCache.delete(oldestKey);
    }
  }
  
  // Debounce localStorage updates to reduce writes
  if (isInitialized) {
    if (cacheThumbnail.timeoutId) {
      clearTimeout(cacheThumbnail.timeoutId);
    }
    
    cacheThumbnail.timeoutId = setTimeout(() => {
      updateLocalStorageCache();
    }, 1000);
  }
};

/**
 * Update localStorage with current cache state
 * @private
 */
const updateLocalStorageCache = () => {
  try {
    // Get existing cache
    const existingCache = JSON.parse(localStorage.getItem('videoThumbnails') || '{}');
    
    // Add new items
    thumbnailCache.forEach((value, key) => {
      existingCache[key] = {
        url: value.url,
        timestamp: value.timestamp,
        lastAccessed: value.lastAccessed
      };
    });
    
    // Enforce storage size limit
    const entries = Object.entries(existingCache);
    if (entries.length > MAX_STORAGE_CACHE_SIZE) {
      // Sort by last accessed (oldest first)
      entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
      
      // Create new object with only the newest entries
      const newCache = {};
      entries.slice(entries.length - MAX_STORAGE_CACHE_SIZE).forEach(([key, value]) => {
        newCache[key] = value;
      });
      
      localStorage.setItem('videoThumbnails', JSON.stringify(newCache));
    } else {
      localStorage.setItem('videoThumbnails', JSON.stringify(existingCache));
    }
  } catch (error) {
    console.error('Error updating thumbnail cache in localStorage:', error);
  }
};

/**
 * Gets a cached thumbnail URL for a video
 * @param {string} videoId - The ID of the video
 * @returns {string|null} - The cached thumbnail URL or null if not cached
 */
export const getCachedThumbnail = (videoId) => {
  if (!videoId) return null;
  
  // Check in-memory cache first
  const cachedThumbnail = thumbnailCache.get(videoId);
  if (cachedThumbnail && Date.now() - cachedThumbnail.timestamp < CACHE_EXPIRATION) {
    // Update last accessed time
    cachedThumbnail.lastAccessed = Date.now();
    thumbnailCache.set(videoId, cachedThumbnail);
    return cachedThumbnail.url;
  }
  
  // If not in memory and we're initialized, check localStorage
  if (isInitialized) {
    try {
      const cachedThumbnails = JSON.parse(localStorage.getItem('videoThumbnails') || '{}');
      const storedThumbnail = cachedThumbnails[videoId];
      
      if (storedThumbnail && Date.now() - storedThumbnail.timestamp < CACHE_EXPIRATION) {
        // Update last accessed time
        storedThumbnail.lastAccessed = Date.now();
        
        // Update in-memory cache
        thumbnailCache.set(videoId, storedThumbnail);
        
        // Schedule localStorage update
        if (cacheThumbnail.timeoutId) {
          clearTimeout(cacheThumbnail.timeoutId);
        }
        cacheThumbnail.timeoutId = setTimeout(updateLocalStorageCache, 1000);
        
        return storedThumbnail.url;
      }
    } catch (error) {
      console.error('Error retrieving cached thumbnail from localStorage:', error);
    }
  }
  
  return null;
};

/**
 * Caches metadata for a video
 * @param {string} videoId - The ID of the video
 * @param {Object} metadata - The metadata to cache
 */
export const cacheVideoMetadata = (videoId, metadata) => {
  if (!videoId || !metadata) return;
  
  metadataCache.set(videoId, {
    data: metadata,
    timestamp: Date.now(),
    lastAccessed: Date.now()
  });
  
  // Enforce memory cache size limit (LRU eviction)
  if (metadataCache.size > MAX_MEMORY_CACHE_SIZE) {
    let oldestKey = null;
    let oldestTime = Infinity;
    
    metadataCache.forEach((value, key) => {
      if (value.lastAccessed < oldestTime) {
        oldestTime = value.lastAccessed;
        oldestKey = key;
      }
    });
    
    if (oldestKey) {
      metadataCache.delete(oldestKey);
    }
  }
  
  // Debounce localStorage updates
  if (isInitialized) {
    if (cacheVideoMetadata.timeoutId) {
      clearTimeout(cacheVideoMetadata.timeoutId);
    }
    
    cacheVideoMetadata.timeoutId = setTimeout(() => {
      try {
        // Get existing cache
        const existingCache = JSON.parse(localStorage.getItem('videoMetadata') || '{}');
        
        // Add new items
        metadataCache.forEach((value, key) => {
          existingCache[key] = {
            data: value.data,
            timestamp: value.timestamp,
            lastAccessed: value.lastAccessed
          };
        });
        
        // Enforce storage size limit
        const entries = Object.entries(existingCache);
        if (entries.length > MAX_STORAGE_CACHE_SIZE) {
          // Sort by last accessed (oldest first)
          entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
          
          // Create new object with only the newest entries
          const newCache = {};
          entries.slice(entries.length - MAX_STORAGE_CACHE_SIZE).forEach(([key, value]) => {
            newCache[key] = value;
          });
          
          localStorage.setItem('videoMetadata', JSON.stringify(newCache));
        } else {
          localStorage.setItem('videoMetadata', JSON.stringify(existingCache));
        }
      } catch (error) {
        console.error('Error caching video metadata in localStorage:', error);
      }
    }, 1000);
  }
};

/**
 * Gets cached metadata for a video
 * @param {string} videoId - The ID of the video
 * @returns {Object|null} - The cached metadata or null if not cached
 */
export const getCachedVideoMetadata = (videoId) => {
  if (!videoId) return null;
  
  // Check in-memory cache first
  const cachedMetadata = metadataCache.get(videoId);
  if (cachedMetadata && Date.now() - cachedMetadata.timestamp < CACHE_EXPIRATION) {
    // Update last accessed time
    cachedMetadata.lastAccessed = Date.now();
    metadataCache.set(videoId, cachedMetadata);
    return cachedMetadata.data;
  }
  
  // If not in memory and we're initialized, check localStorage
  if (isInitialized) {
    try {
      const cachedMetadata = JSON.parse(localStorage.getItem('videoMetadata') || '{}');
      const storedMetadata = cachedMetadata[videoId];
      
      if (storedMetadata && Date.now() - storedMetadata.timestamp < CACHE_EXPIRATION) {
        // Update last accessed time
        storedMetadata.lastAccessed = Date.now();
        
        // Update in-memory cache
        metadataCache.set(videoId, storedMetadata);
        
        // Schedule localStorage update
        if (cacheVideoMetadata.timeoutId) {
          clearTimeout(cacheVideoMetadata.timeoutId);
        }
        cacheVideoMetadata.timeoutId = setTimeout(() => {
          try {
            localStorage.setItem('videoMetadata', JSON.stringify(cachedMetadata));
          } catch (error) {
            console.error('Error updating video metadata in localStorage:', error);
          }
        }, 1000);
        
        return storedMetadata.data;
      }
    } catch (error) {
      console.error('Error retrieving cached video metadata from localStorage:', error);
    }
  }
  
  return null;
};

/**
 * Clears all cached video data
 */
export const clearVideoCache = () => {
  thumbnailCache.clear();
  metadataCache.clear();
  
  try {
    localStorage.removeItem('videoThumbnails');
    localStorage.removeItem('videoMetadata');
  } catch (error) {
    console.error('Error clearing video cache from localStorage:', error);
  }
};

/**
 * Initializes the video cache service
 * This should be called when the application starts
 */
export const initVideoCacheService = () => {
  // Load cached thumbnails from localStorage into memory
  try {
    // Load thumbnails
    const cachedThumbnails = JSON.parse(localStorage.getItem('videoThumbnails') || '{}');
    const now = Date.now();
    
    // Filter out expired entries and sort by last accessed (newest first)
    const validEntries = Object.entries(cachedThumbnails)
      .filter(([_, data]) => now - data.timestamp < CACHE_EXPIRATION)
      .sort((a, b) => b[1].lastAccessed - a[1].lastAccessed);
    
    // Take only the most recent entries up to the limit
    validEntries.slice(0, MAX_MEMORY_CACHE_SIZE).forEach(([videoId, data]) => {
      thumbnailCache.set(videoId, data);
    });
    
    // Load metadata with the same approach
    const cachedMetadata = JSON.parse(localStorage.getItem('videoMetadata') || '{}');
    
    const validMetadataEntries = Object.entries(cachedMetadata)
      .filter(([_, data]) => now - data.timestamp < CACHE_EXPIRATION)
      .sort((a, b) => b[1].lastAccessed - a[1].lastAccessed);
    
    validMetadataEntries.slice(0, MAX_MEMORY_CACHE_SIZE).forEach(([videoId, data]) => {
      metadataCache.set(videoId, data);
    });
    
    // Clean up localStorage if needed
    if (validEntries.length < Object.keys(cachedThumbnails).length) {
      const newCache = {};
      validEntries.forEach(([key, value]) => {
        newCache[key] = value;
      });
      localStorage.setItem('videoThumbnails', JSON.stringify(newCache));
    }
    
    if (validMetadataEntries.length < Object.keys(cachedMetadata).length) {
      const newCache = {};
      validMetadataEntries.forEach(([key, value]) => {
        newCache[key] = value;
      });
      localStorage.setItem('videoMetadata', JSON.stringify(newCache));
    }
    
    console.log(`Video cache initialized with ${thumbnailCache.size} thumbnails and ${metadataCache.size} metadata entries`);
  } catch (error) {
    console.error('Error initializing video cache service:', error);
  } finally {
    isInitialized = true;
  }
  
  // Preload common video formats support check
  setTimeout(() => {
    try {
      const video = document.createElement('video');
      const formats = {
        mp4: video.canPlayType('video/mp4'),
        webm: video.canPlayType('video/webm'),
        ogg: video.canPlayType('video/ogg')
      };
      
      localStorage.setItem('supportedVideoFormats', JSON.stringify(formats));
    } catch (e) {
      console.warn('Could not check video format support:', e);
    }
  }, 1000);
};

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
    
    try {
      // Cache the placeholder URL
      cacheThumbnail(videoId, PLACEHOLDER_IMAGE_URL);
      
      // Simulate network delay for development
      await new Promise(r => setTimeout(r, 100));
      
      resolve(PLACEHOLDER_IMAGE_URL);
    } catch (error) {
      console.error('Error preloading thumbnail:', error);
      // Use placeholder as fallback
      cacheThumbnail(videoId, PLACEHOLDER_IMAGE_URL);
      resolve(PLACEHOLDER_IMAGE_URL);
    } finally {
      activeLoads.delete(videoId);
    }
  }
  
  isProcessingQueue = false;
  
  // If there are more items in the queue and we have capacity, process them
  if (preloadQueue.length > 0 && activeLoads.size < MAX_CONCURRENT_LOADS) {
    setTimeout(processPreloadQueue, 0);
  }
};

// Initialize cache from localStorage
const initializeCache = () => {
  try {
    const cachedThumbnails = JSON.parse(localStorage.getItem('videoThumbnails') || '{}');
    const cachedMetadata = JSON.parse(localStorage.getItem('videoMetadata') || '{}');
    
    // Clear expired cache entries
    const now = Date.now();
    const validThumbnails = {};
    const validMetadata = {};
    
    Object.entries(cachedThumbnails).forEach(([key, value]) => {
      if (now - value.timestamp < CACHE_EXPIRATION) {
        validThumbnails[key] = value;
      }
    });
    
    Object.entries(cachedMetadata).forEach(([key, value]) => {
      if (now - value.timestamp < CACHE_EXPIRATION) {
        validMetadata[key] = value;
      }
    });
    
    // Update localStorage with valid entries
    localStorage.setItem('videoThumbnails', JSON.stringify(validThumbnails));
    localStorage.setItem('videoMetadata', JSON.stringify(validMetadata));
    
    // Update in-memory cache
    Object.entries(validThumbnails).forEach(([key, value]) => {
      thumbnailCache.set(key, value);
    });
    
    Object.entries(validMetadata).forEach(([key, value]) => {
      metadataCache.set(key, value);
    });
    
    isInitialized = true;
    console.log(`Video cache initialized with ${Object.keys(validThumbnails).length} thumbnails and ${Object.keys(validMetadata).length} metadata entries`);
  } catch (error) {
    console.error('Error initializing video cache:', error);
  }
};

// Initialize cache when the service is imported
initializeCache(); 