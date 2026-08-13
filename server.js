const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDatabase } = require('./database');

// Import routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const educationRoutes = require('./routes/education');
const skillsRoutes = require('./routes/skills');
const projectsRoutes = require('./routes/projects');
const certificatesRoutes = require('./routes/certificates');
const achievementsRoutes = require('./routes/achievements');
const internshipsRoutes = require('./routes/internships');
const resumeRoutes = require('./routes/resume');
const contactRoutes = require('./routes/contact');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads folder
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/internships', internshipsRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Dhayalan Portfolio API Server is running smoothly' });
});

// Serve frontend static build in production
const clientDistPath = __dirname;
app.use(express.static(clientDistPath));

// SPA catch-all fallback routing for direct URLs like /projects, /about, /admin
app.get('*', (req, res) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Dhayalan R Portfolio API</title></head>
        <body style="font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; text-align: center;">
          <h1>⚙️ Mechanical Engineering Portfolio Server</h1>
          <p>API Server is running on port ${PORT}. Client bundle build is pending.</p>
          <p>Run <code>npm run build</code> in the client directory or root to build production assets.</p>
        </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Dhayalan R Portfolio Server running on port ${PORT}`);
  console.log(`📁 Uploads served at http://localhost:${PORT}/uploads`);
  console.log(`==================================================`);
});
