const express = require('express');
const router = express.Router();
const { getQuery, runQuery } = require('../database');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET latest resume
router.get('/', async (req, res) => {
  try {
    const resume = await getQuery(`SELECT * FROM resume ORDER BY id DESC LIMIT 1`);
    res.json(resume || null);
  } catch (err) {
    console.error('Error fetching resume:', err);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

// UPLOAD new resume (Admin) - replaces previous resume
router.post('/upload', authenticateToken, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF resume file uploaded' });
    }

    const file_url = `/uploads/${req.file.filename}`;
    const original_name = req.file.originalname;

    const result = await runQuery(
      `INSERT INTO resume (file_url, original_name) VALUES (?, ?)`,
      [file_url, original_name]
    );

    const created = await getQuery(`SELECT * FROM resume WHERE id = ?`, [result.lastID]);
    res.status(201).json({ message: 'Resume uploaded successfully', resume: created });
  } catch (err) {
    console.error('Error uploading resume:', err);
    res.status(500).json({ error: 'Failed to upload resume' });
  }
});

// DELETE resume entry (Admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await runQuery(`DELETE FROM resume WHERE id = ?`, [id]);
    res.json({ message: 'Resume deleted successfully' });
  } catch (err) {
    console.error('Error deleting resume:', err);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

module.exports = router;
