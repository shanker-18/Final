import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Make sure environment variables from .env are loaded before configuring Cloudinary
dotenv.config();

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
