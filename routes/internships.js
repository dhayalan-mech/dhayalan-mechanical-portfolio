const express = require('express');
const router = express.Router();
const { allQuery, getQuery, runQuery } = require('../database');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET all internships
router.get('/', async (req, res) => {
  try {
    const list = await allQuery(`SELECT * FROM internships ORDER BY id DESC`);
    const parsed = list.map(item => ({
      ...item,
      images: item.images_json ? JSON.parse(item.images_json) : []
    }));
    res.json(parsed);
  } catch (err) {
    console.error('Error fetching internships:', err);
    res.status(500).json({ error: 'Failed to fetch internships' });
  }
});

// CREATE internship (Admin)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title_role, organization, location, duration, description, skills_learned, report_url, images } = req.body;
    if (!title_role || !organization) {
      return res.status(400).json({ error: 'Role title and organization are required' });
    }
    const imagesJson = JSON.stringify(images || []);
    const result = await runQuery(
      `INSERT INTO internships (title_role, organization, location, duration, description, skills_learned, report_url, images_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title_role,
        organization,
        location || '',
        duration || '',
        description || '',
        skills_learned || '',
        report_url || '',
        imagesJson
      ]
    );
    const created = await getQuery(`SELECT * FROM internships WHERE id = ?`, [result.lastID]);
    created.images = JSON.parse(created.images_json || '[]');
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating internship:', err);
    res.status(500).json({ error: 'Failed to create internship entry' });
  }
});

// UPDATE internship (Admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title_role, organization, location, duration, description, skills_learned, report_url, images } = req.body;
    const imagesJson = JSON.stringify(images || []);

    await runQuery(
      `UPDATE internships SET title_role=?, organization=?, location=?, duration=?, description=?, skills_learned=?, report_url=?, images_json=? WHERE id=?`,
      [title_role, organization, location, duration, description, skills_learned, report_url, imagesJson, id]
    );
    const updated = await getQuery(`SELECT * FROM internships WHERE id = ?`, [id]);
    updated.images = JSON.parse(updated.images_json || '[]');
    res.json(updated);
  } catch (err) {
    console.error('Error updating internship:', err);
    res.status(500).json({ error: 'Failed to update internship entry' });
  }
});

// DELETE internship (Admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await runQuery(`DELETE FROM internships WHERE id = ?`, [id]);
    res.json({ message: 'Internship entry deleted successfully' });
  } catch (err) {
    console.error('Error deleting internship:', err);
    res.status(500).json({ error: 'Failed to delete internship entry' });
  }
});

// UPLOAD internship report / files (Admin)
router.post('/upload', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const file_url = `/uploads/${req.file.filename}`;
    res.json({ message: 'Internship file uploaded', file_url, originalName: req.file.originalname });
  } catch (err) {
    console.error('Error uploading internship file:', err);
    res.status(500).json({ error: 'Failed to upload internship file' });
  }
});

module.exports = router;
