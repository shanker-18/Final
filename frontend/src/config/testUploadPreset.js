// Script to test if the upload preset exists and is properly configured
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dtfzeuwh1',
  api_key: '459392291172775',
  api_secret: '6SoMc-hfRiLGljih-ri6hjuVcJs',
  secure: true
});

// Test the upload preset
async function testUploadPreset() {
  try {
    console.log('Listing all upload presets...');
    
    // List all upload presets
    const { presets } = await cloudinary.api.upload_presets();
    
    console.log(`Found ${presets.length} presets:`);
    
    // Check if our preset exists
    const videoUploadsPreset = presets.find(preset => preset.name === 'video_uploads');
    
    if (videoUploadsPreset) {
      console.log('✅ video_uploads preset exists!');
      console.log('Preset details:', videoUploadsPreset);
      
      // Check if it's unsigned
      if (videoUploadsPreset.unsigned) {
        console.log('✅ Preset is correctly configured for unsigned uploads');
      } else {
        console.log('❌ Preset is NOT configured for unsigned uploads');
      }
    } else {
      console.log('❌ video_uploads preset does not exist');
    }
    
    return presets;
  } catch (error) {
    console.error('Error testing upload preset:', error);
    throw error;
  }
}

// Run the function
testUploadPreset()
  .then(result => {
    console.log('Preset test complete');
  })
  .catch(error => {
    console.error('Preset test failed:', error);
  }); 