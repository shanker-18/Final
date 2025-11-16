import express from 'express';
import multer from 'multer';
import { Project } from '../models/Project.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Multer setup for in-memory video uploads (max 100MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});

// GET /api/projects - list projects
// Optional query params:
//   role=developer&sellerId=<uid>  => only that developer's projects
//   role=seeker                    => all active projects
//   (no params)                    => all projects
router.get('/', async (req, res) => {
  try {
    const { role, sellerId } = req.query;

    const filter = {};

    if (role === 'developer' && sellerId) {
      // Only this developer's projects
      filter['seller.id'] = sellerId;
    } else if (role === 'seeker') {
      // All active projects visible to seekers
      filter.status = 'active';
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: projects,
    });
  } catch (err) {
    console.error('Error fetching projects:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// POST /api/projects - create a new project (no raw video stored)
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      technologies,
      requirements,
      budget,
      category,
      seller,
      status,
    } = req.body;

    if (!title || !description || !technologies || !technologies.length || !requirements || !budget || !category || !seller || !seller.id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const project = new Project({
      title,
      description,
      technologies,
      requirements,
      budget,
      category,
      seller,
      status: status || 'active',
    });

    const saved = await project.save();

    return res.status(201).json({
      success: true,
      data: saved,
    });
  } catch (err) {
    console.error('Error creating project:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// POST /api/projects/:id/upload-video - upload video to Cloudinary using project _id as public_id
router.post('/:id/upload-video', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No video file provided',
      });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Upload video buffer to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'project_videos',
          public_id: project._id.toString(), // tie Cloudinary asset to Mongo project id
          overwrite: true,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    // Build thumbnail URL (basic transformation)
    const secureUrl = uploadResult.secure_url;
    const thumbnailUrl = secureUrl
      ? secureUrl.replace('/upload/', '/upload/w_640,h_360,c_fill,g_center/')
      : undefined;

    project.videoPublicId = uploadResult.public_id;
    project.videoUrl = secureUrl;
    project.thumbnailUrl = thumbnailUrl;

    const updated = await project.save();

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (err) {
    console.error('Error uploading project video:', err);
    return res.status(500).json({
      success: false,
      message: err?.message || 'Failed to upload video',
    });
  }
});

// GET /api/projects/:id - get a single project by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    return res.json({
      success: true,
      data: project,
    });
  } catch (err) {
    console.error('Error fetching project by ID:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// PUT /api/projects/:id - update an existing project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Only update fields that are provided
    const updatableFields = [
      'title',
      'description',
      'technologies',
      'requirements',
      'budget',
      'category',
      'status',
    ];

    updatableFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(updates, field)) {
        project[field] = updates[field];
      }
    });

    // Seller can also be updated if provided (e.g., name/avatar changes)
    if (updates.seller) {
      project.seller = {
        ...project.seller?.toObject?.() ?? project.seller,
        ...updates.seller,
      };
    }

    const saved = await project.save();

    return res.json({
      success: true,
      data: saved,
    });
  } catch (err) {
    console.error('Error updating project:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// DELETE /api/projects/:id - delete a project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    return res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting project:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// GET /api/projects/sample - create and return a sample project (for testing only)
router.get('/sample', async (_req, res) => {
  try {
    const sample = new Project({
      title: 'Sample Project',
      description: 'This is a sample project created to test MongoDB connection.',
      technologies: ['react', 'node', 'mongodb'],
      requirements: 'Build a sample full-stack application.',
      budget: 500,
      category: 'fullstack',
      seller: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        role: 'developer',
      },
      status: 'active',
    });

    const saved = await sample.save();

    return res.status(201).json({
      success: true,
      data: saved,
    });
  } catch (err) {
    console.error('Error creating sample project:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
