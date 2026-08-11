const express = require('express');
const router = express.Router();
const { allQuery, getQuery, runQuery } = require('../database');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET all achievements
router.get('/', async (req, res) => {
  try {
    const list = await allQuery(`SELECT * FROM achievements ORDER BY id DESC`);
    res.json(list);
  } catch (err) {
    console.error('Error fetching achievements:', err);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

// CREATE achievement (Admin)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, date, file_url } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Achievement title is required' });
    }
    const result = await runQuery(
      `INSERT INTO achievements (title, description, date, file_url) VALUES (?, ?, ?, ?)`,
      [title, description || '', date || '', file_url || '']
    );
    const created = await getQuery(`SELECT * FROM achievements WHERE id = ?`, [result.lastID]);
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating achievement:', err);
    res.status(500).json({ error: 'Failed to create achievement' });
  }
});

// UPDATE achievement (Admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, file_url } = req.body;

    await runQuery(
      `UPDATE achievements SET title=?, description=?, date=?, file_url=? WHERE id=?`,
      [title, description, date, file_url, id]
    );
    const updated = await getQuery(`SELECT * FROM achievements WHERE id = ?`, [id]);
    res.json(updated);
  } catch (err) {
    console.error('Error updating achievement:', err);
    res.status(500).json({ error: 'Failed to update achievement' });
  }
});

// DELETE achievement (Admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await runQuery(`DELETE FROM achievements WHERE id = ?`, [id]);
    res.json({ message: 'Achievement deleted successfully' });
  } catch (err) {
    console.error('Error deleting achievement:', err);
    res.status(500).json({ error: 'Failed to delete achievement' });
  }
});

// UPLOAD achievement attachment (Admin)
router.post('/upload', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const file_url = `/uploads/${req.file.filename}`;
    res.json({ message: 'Achievement attachment uploaded', file_url });
  } catch (err) {
    console.error('Error uploading achievement attachment:', err);
    res.status(500).json({ error: 'Failed to upload attachment' });
  }
});

module.exports = router;
