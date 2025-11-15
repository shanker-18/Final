import axios from 'axios';

const CLOUDINARY_CLOUD_NAME = 'dg4wnvlp7';
const CLOUDINARY_UPLOAD_PRESET = 'video_upload_preset';

export const uploadVideoToCloudinary = async (videoFile) => {
  try {
    console.log('Starting video upload to Cloudinary...');
    const formData = new FormData();
    formData.append('file', videoFile);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('resource_type', 'video');
    formData.append('folder', 'project_videos');

    // Only use allowed parameters for unsigned upload
    formData.append('tags', 'project_video');

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`;
    console.log('Uploading to:', uploadUrl);
    console.log('Using upload preset:', CLOUDINARY_UPLOAD_PRESET);
    
    const response = await axios.post(
      uploadUrl,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Upload progress:', percentCompleted + '%');
        }
      }
    );

    if (!response.data || !response.data.secure_url) {
      console.error('Invalid response from Cloudinary:', response.data);
      throw new Error('Failed to get video URL from Cloudinary');
    }

    // Create thumbnail URL using basic transformations
    const thumbnailUrl = response.data.secure_url.replace('/upload/', '/upload/w_640,h_360,c_fill/');
    
    const result = {
      url: response.data.secure_url,
      publicId: response.data.public_id,
      thumbnail: thumbnailUrl
    };

    console.log('Upload successful:', result);
    return result;

  } catch (error) {
    console.error('Detailed Cloudinary upload error:', {
      error,
      response: error.response?.data,
      message: error.message,
      status: error.response?.status
    });

    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Please check your Cloudinary credentials');
    } else if (error.response?.status === 413) {
      throw new Error('Video file is too large. Maximum size is 100MB');
    } else if (error.response?.data?.error?.message) {
      throw new Error(`Cloudinary Error: ${error.response.data.error.message}`);
    } else {
      throw new Error(`Failed to upload video to Cloudinary: ${error.message}`);
    }
  }
};

export const getVideoDetails = async (publicId) => {
  try {
    const response = await axios.get(`/api/cloudinary/video/${publicId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw new Error('Failed to fetch video details');
  }
}; 