const express = require('express');
const router = express.Router();
const { allQuery, getQuery, runQuery } = require('../database');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET all certificates
router.get('/', async (req, res) => {
  try {
    const list = await allQuery(`SELECT * FROM certificates ORDER BY id DESC`);
    res.json(list);
  } catch (err) {
    console.error('Error fetching certificates:', err);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// CREATE certificate (Admin)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, issuer, date, description, file_url, credential_url } = req.body;
    if (!title || !issuer) {
      return res.status(400).json({ error: 'Certificate title and issuer are required' });
    }
    const result = await runQuery(
      `INSERT INTO certificates (title, issuer, date, description, file_url, credential_url) VALUES (?, ?, ?, ?, ?, ?)`,
      [title, issuer, date || '', description || '', file_url || '', credential_url || '']
    );
    const created = await getQuery(`SELECT * FROM certificates WHERE id = ?`, [result.lastID]);
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating certificate:', err);
    res.status(500).json({ error: 'Failed to create certificate' });
  }
});

// UPDATE certificate (Admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, issuer, date, description, file_url, credential_url } = req.body;

    await runQuery(
      `UPDATE certificates SET title=?, issuer=?, date=?, description=?, file_url=?, credential_url=? WHERE id=?`,
      [title, issuer, date, description, file_url, credential_url, id]
    );
    const updated = await getQuery(`SELECT * FROM certificates WHERE id = ?`, [id]);
    res.json(updated);
  } catch (err) {
    console.error('Error updating certificate:', err);
    res.status(500).json({ error: 'Failed to update certificate' });
  }
});

// DELETE certificate (Admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await runQuery(`DELETE FROM certificates WHERE id = ?`, [id]);
    res.json({ message: 'Certificate deleted successfully' });
  } catch (err) {
    console.error('Error deleting certificate:', err);
    res.status(500).json({ error: 'Failed to delete certificate' });
  }
});

// UPLOAD certificate file (Admin)
router.post('/upload', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const file_url = `/uploads/${req.file.filename}`;
    res.json({ message: 'Certificate file uploaded', file_url, filename: req.file.originalname });
  } catch (err) {
    console.error('Error uploading certificate file:', err);
    res.status(500).json({ error: 'Failed to upload certificate file' });
  }
});

module.exports = router;
