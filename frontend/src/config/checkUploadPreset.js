// Script to check and update Cloudinary upload preset
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dtfzeuwh1',
  api_key: '459392291172775',
  api_secret: '6SoMc-hfRiLGljih-ri6hjuVcJs',
  secure: true
});

// Check and update the upload preset
async function checkAndUpdatePreset() {
  try {
    console.log('Checking app_videos upload preset...');
    
    // Get the preset details
    const preset = await cloudinary.api.get_upload_preset('app_videos');
    console.log('Current preset configuration:', preset);
    
    // Check if the preset is unsigned
    if (!preset.unsigned) {
      console.log('Preset is not configured for unsigned uploads. Updating...');
      
      // Update the preset to be unsigned
      const result = await cloudinary.api.update_upload_preset('app_videos', {
        unsigned: true,
        folder: 'videos',
        resource_type: 'video',
        allowed_formats: 'mp4,mov,webm',
        access_mode: 'public'
      });
      
      console.log('Preset updated successfully:', result);
    } else {
      console.log('Preset is already configured for unsigned uploads.');
    }
    
    return preset;
  } catch (error) {
    console.error('Error checking/updating preset:', error);
    throw error;
  }
}

// Run the function
checkAndUpdatePreset()
  .then(result => {
    console.log('Preset check complete');
  })
  .catch(error => {
    console.error('Preset check failed:', error);
  });

export { checkAndUpdatePreset }; 