import { createPool } from 'mysql2/promise';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const pool = createPool({
    host: 'localhost',
    user: 'yourUsername',
    password: 'yourPassword',
    database: 'yourDatabase',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// MongoDB Atlas Configuration
const uri = "mongodb+srv://Manian VJS:Manian@18@freelancehub.uikhn.mongodb.net/?appName=FreelanceHub";

// Connect to MongoDB Atlas
export async function connectToDatabase() {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection.db;
    }
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    });
    console.log("✅ Successfully connected to MongoDB Atlas!");
    return mongoose.connection.db;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    throw error;
  }
}

// Get projects with pagination
export async function getProjects(page = 1, limit = 10) {
  try {
    const Project = mongoose.model('Project');
    const projects = await Project.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    
    const total = await Project.countDocuments();
    
    return {
      data: projects,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

// Get project by ID
export async function getProjectById(id) {
  try {
    const Project = mongoose.model('Project');
    const project = await Project.findById(id).lean();
    return project;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
}

// Create new project
export async function createProject(projectData) {
  try {
    const Project = mongoose.model('Project');
    const project = new Project({
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return await project.save();
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

// Update project
export async function updateProject(id, updateData) {
  try {
    const Project = mongoose.model('Project');
    const result = await Project.findByIdAndUpdate(
      id,
      { 
        ...updateData,
        updatedAt: new Date()
      },
      { new: true }
    );
    return result;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

// Delete project
export async function deleteProject(id) {
  try {
    const Project = mongoose.model('Project');
    const result = await Project.findByIdAndDelete(id);
    return result;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

// Search projects
export async function searchProjects(query, page = 1, limit = 10) {
  try {
    const Project = mongoose.model('Project');
    const projects = await Project.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'seller.name': { $regex: query, $options: 'i' } },
        { technologies: { $regex: query, $options: 'i' } }
      ]
    })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
    
    const total = await Project.countDocuments({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'seller.name': { $regex: query, $options: 'i' } },
        { technologies: { $regex: query, $options: 'i' } }
      ]
    });
    
    return {
      data: projects,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('Error searching projects:', error);
    throw error;
  }
}

// Get projects by user ID
export async function getProjectsByUserId(userId, page = 1, limit = 10) {
  try {
    const Project = mongoose.model('Project');
    const projects = await Project.find({ 'seller.id': userId })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    
    const total = await Project.countDocuments({ 'seller.id': userId });
    
    return {
      data: projects,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('Error fetching user projects:', error);
    throw error;
  }
}

// Close database connection
export async function closeDatabaseConnection() {
  try {
    await mongoose.connection.close();
    console.log('📝 MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
}

export { pool };

export async function getUserRole(userId) {
    try {
        const [rows] = await pool.execute(
            'SELECT role FROM users WHERE id = ?',
            [userId]
        );
        return rows[0]?.role;
    } catch (error) {
        console.error('Error fetching user role:', error);
        return null;
    }
}

export async function updateUserRole(userId, role) {
    try {
        await pool.execute(
            'UPDATE users SET role = ? WHERE id = ?',
            [role, userId]
        );
        return true;
    } catch (error) {
        console.error('Error updating user role:', error);
        return false;
    }
} 