import mongoose from 'mongoose';

const SellerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, default: 'developer' },
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    technologies: { type: [String], required: true, default: [] },
    requirements: { type: String, required: true, trim: true },
    budget: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    seller: { type: SellerSchema, required: true },
    status: { type: String, default: 'active' },

    // Placeholder fields for future Cloudinary integration
    videoPublicId: { type: String },
    videoUrl: { type: String },
    thumbnailUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model('Project', ProjectSchema);
