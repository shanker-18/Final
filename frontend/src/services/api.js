const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://127.0.0.1:5000' : '');

// Add retry logic for API calls
const retry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay);
  }
};

// Projects API
export const projectsApi = {
  // Get all projects with pagination
  getAll: async (page = 1, limit = 10) => {
    try {
      const response = await retry(async () => {
        const res = await fetch(`${API_BASE_URL}/api/projects?page=${page}&limit=${limit}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch projects: ${res.statusText}`);
        }
        return res;
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw new Error('Failed to load projects. Please try again.');
    }
  },

  // Get project by ID
  getById: async (id) => {
    try {
      const response = await retry(async () => {
        const res = await fetch(`${API_BASE_URL}/api/projects/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch project: ${res.statusText}`);
        }
        return res;
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching project:', error);
      throw new Error('Failed to load project details. Please try again.');
    }
  },

  // Search projects
  search: async (query, page = 1, limit = 10) => {
    try {
      const response = await retry(async () => {
        const res = await fetch(
          `${API_BASE_URL}/api/projects/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
        );
        if (!res.ok) {
          throw new Error(`Search failed: ${res.statusText}`);
        }
        return res;
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error searching projects:', error);
      throw new Error('Search failed. Please try again.');
    }
  },

  // Get projects by user ID
  getByUserId: async (userId, page = 1, limit = 10) => {
    try {
      const response = await retry(async () => {
        const res = await fetch(
          `${API_BASE_URL}/api/projects/user/${userId}?page=${page}&limit=${limit}`
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch user projects: ${res.statusText}`);
        }
        return res;
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user projects:', error);
      throw new Error('Failed to load user projects. Please try again.');
    }
  },

  // Create new project
  create: async (projectData) => {
    try {
      const response = await retry(async () => {
        const res = await fetch(`${API_BASE_URL}/api/projects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData),
        });
        if (!res.ok) {
          throw new Error(`Failed to create project: ${res.statusText}`);
        }
        return res;
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error('Failed to create project. Please try again.');
    }
  },

  // Update project
  update: async (id, updateData) => {
    try {
      const response = await retry(async () => {
        const res = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });
        if (!res.ok) {
          throw new Error(`Failed to update project: ${res.statusText}`);
        }
        return res;
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error updating project:', error);
      throw new Error('Failed to update project. Please try again.');
    }
  },

  // Delete project
  delete: async (id) => {
    try {
      const response = await retry(async () => {
        const res = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          throw new Error(`Failed to delete project: ${res.statusText}`);
        }
        return res;
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting project:', error);
      throw new Error('Failed to delete project. Please try again.');
    }
  },
};

// Video API
export const videoApi = {
  // Get video URL
  getVideoUrl: async (projectId) => {
    try {
      const response = await retry(async () => {
        const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/video`, {
          headers: {
            'Accept': 'application/json',
          },
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch video URL: ${res.statusText}`);
        }
        return res;
      });
      
      const data = await response.json();
      if (!data || !data.filename) {
        throw new Error('Invalid video data received');
      }
      return data;
    } catch (error) {
      console.error('Error fetching video URL:', error);
      throw new Error('Failed to load video URL. Please try again.');
    }
  },

  // Get video stream URL
  getStreamUrl: (filename) => {
    try {
      if (!filename) return null;
      return `${API_BASE_URL}/api/videos/stream/${filename}`;
    } catch (error) {
      console.error('Error getting stream URL:', error);
      return null;
    }
  },

  // Get video metadata
  getVideoMetadata: async (filename) => {
    try {
      if (!filename) return null;
      
      const response = await retry(async () => {
        const res = await fetch(`${API_BASE_URL}/api/videos/stream/${filename}`, {
          method: 'HEAD'
        });
        if (!res.ok) {
          throw new Error(`Metadata fetch failed: ${res.statusText}`);
        }
        return res;
      });
      
      return {
        content_type: response.headers.get('content-type'),
        content_length: response.headers.get('content-length'),
        accept_ranges: response.headers.get('accept-ranges'),
        cache_control: response.headers.get('cache-control')
      };
    } catch (error) {
      console.error('Error getting video metadata:', error);
      return null;
    }
  },

  // Check if video is available
  checkVideoAvailability: async (filename) => {
    try {
      if (!filename) return false;
      
      const response = await fetch(`${API_BASE_URL}/api/videos/stream/${filename}`, {
        method: 'HEAD'
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error checking video availability:', error);
      return false;
    }
  },

  // Upload video
  uploadVideo: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/api/upload-video`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw new Error('Failed to upload video. Please try again.');
    }
  },

  // Get video thumbnail
  getThumbnail: async (filename) => {
    try {
      if (!filename) return null;
      
      const response = await retry(async () => {
        const res = await fetch(`${API_BASE_URL}/api/videos/thumbnail/${filename}`);
        if (!res.ok) {
          throw new Error(`Thumbnail fetch failed: ${res.statusText}`);
        }
        return res;
      });
      
      return await response.blob();
    } catch (error) {
      console.error('Error getting thumbnail:', error);
      return null;
    }
  },

  // Delete video
  deleteVideo: async (filename) => {
    try {
      if (!filename) return false;
      
      const response = await retry(async () => {
        const res = await fetch(`${API_BASE_URL}/api/videos/${filename}`, {
          method: 'DELETE',
        });
        
        if (!res.ok) {
          throw new Error(`Delete failed: ${res.statusText}`);
        }
        
        return res;
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting video:', error);
      return false;
    }
  }
};

// User API
export const userApi = {
  // Get user role
  getRole: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/role`);
    if (!response.ok) throw new Error('Failed to fetch user role');
    return response.json();
  },

  // Update user role
  updateRole: async (userId, role) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }),
    });
    if (!response.ok) throw new Error('Failed to update user role');
    return response.json();
  },
};

// User-to-user chat API (Mongo-backed)
export const userChatApi = {
  getConversations: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/api/user-chat/conversations?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error('Failed to load conversations');
    return res.json();
  },

  createOrGetConversation: async (currentUserId, otherUser) => {
    const res = await fetch(`${API_BASE_URL}/api/user-chat/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentUserId, otherUser }),
    });
    let data = null;
    try {
      data = await res.json();
    } catch {
      // ignore JSON parse error, will fall back to generic message
    }
    if (!res.ok || !data?.success) {
      const message = data?.message || `Failed to create conversation (status ${res.status})`;
      throw new Error(message);
    }
    return data;
  },

  getMessages: async (conversationId) => {
    const res = await fetch(`${API_BASE_URL}/api/user-chat/conversations/${conversationId}/messages`);
    if (!res.ok) throw new Error('Failed to load messages');
    return res.json();
  },

  sendMessage: async (conversationId, { senderId, senderName, text }) => {
    const res = await fetch(`${API_BASE_URL}/api/user-chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId, senderName, text }),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },
};
