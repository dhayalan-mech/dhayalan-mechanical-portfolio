const express = require('express');
const router = express.Router();
const { allQuery, getQuery, runQuery } = require('../database');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET all projects
router.get('/', async (req, res) => {
  try {
    const list = await allQuery(`SELECT * FROM projects ORDER BY id DESC`);
    const parsed = list.map(p => ({
      ...p,
      attachments: p.attachments_json ? JSON.parse(p.attachments_json) : []
    }));
    res.json(parsed);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET single project
router.get('/:id', async (req, res) => {
  try {
    const project = await getQuery(`SELECT * FROM projects WHERE id = ?`, [req.params.id]);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    project.attachments = project.attachments_json ? JSON.parse(project.attachments_json) : [];
    res.json(project);
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// CREATE project (Admin)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      problem_statement,
      objective,
      methodology,
      components_tools,
      key_features,
      result_outcome,
      category,
      project_date,
      github_link,
      demo_link,
      image_url,
      attachments
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Project title is required' });
    }

    const attachmentsJson = JSON.stringify(attachments || []);

    const result = await runQuery(
      `INSERT INTO projects (title, description, problem_statement, objective, methodology, components_tools, key_features, result_outcome, category, project_date, github_link, demo_link, image_url, attachments_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || '',
        problem_statement || '',
        objective || '',
        methodology || '',
        components_tools || '',
        key_features || '',
        result_outcome || '',
        category || 'CAD / Design',
        project_date || new Date().toISOString().split('T')[0],
        github_link || '',
        demo_link || '',
        image_url || '',
        attachmentsJson
      ]
    );

    const created = await getQuery(`SELECT * FROM projects WHERE id = ?`, [result.lastID]);
    created.attachments = JSON.parse(created.attachments_json || '[]');
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// UPDATE project (Admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      problem_statement,
      objective,
      methodology,
      components_tools,
      key_features,
      result_outcome,
      category,
      project_date,
      github_link,
      demo_link,
      image_url,
      attachments
    } = req.body;

    const attachmentsJson = JSON.stringify(attachments || []);

    await runQuery(
      `UPDATE projects SET title=?, description=?, problem_statement=?, objective=?, methodology=?, components_tools=?, key_features=?, result_outcome=?, category=?, project_date=?, github_link=?, demo_link=?, image_url=?, attachments_json=? WHERE id=?`,
      [
        title,
        description,
        problem_statement,
        objective,
        methodology,
        components_tools,
        key_features,
        result_outcome,
        category,
        project_date,
        github_link,
        demo_link,
        image_url,
        attachmentsJson,
        id
      ]
    );

    const updated = await getQuery(`SELECT * FROM projects WHERE id = ?`, [id]);
    updated.attachments = JSON.parse(updated.attachments_json || '[]');
    res.json(updated);
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE project (Admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await runQuery(`DELETE FROM projects WHERE id = ?`, [id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// UPLOAD project files / images (Admin)
router.post('/upload', authenticateToken, upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded' });
    }

    const fileInfos = req.files.map(file => ({
      name: file.originalname,
      url: `/uploads/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.json({ message: 'Files uploaded successfully', files: fileInfos });
  } catch (err) {
    console.error('Error uploading project files:', err);
    res.status(500).json({ error: 'Failed to upload project files' });
  }
});

module.exports = router;
