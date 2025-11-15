// Simple script to create a Cloudinary upload preset
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dtfzeuwh1',
  api_key: '459392291172775',
  api_secret: '6SoMc-hfRiLGljih-ri6hjuVcJs',
  secure: true
});

// Create a new upload preset
async function createSimplePreset() {
  try {
    console.log('Creating video_uploads preset...');
    
    // Create the upload preset
    const result = await cloudinary.api.create_upload_preset({
      name: 'video_uploads',
      folder: 'videos',
      unsigned: true,
      resource_type: 'video',
      allowed_formats: 'mp4,mov,webm',
      access_mode: 'public'
    });
    
    console.log('Upload preset created successfully:', result);
    return result;
  } catch (error) {
    console.error('Error creating upload preset:', error);
    throw error;
  }
}

// Run the function
createSimplePreset()
  .then(result => {
    console.log('Preset creation complete');
  })
  .catch(error => {
    console.error('Preset creation failed:', error);
  }); 