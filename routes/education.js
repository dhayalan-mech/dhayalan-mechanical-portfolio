const express = require('express');
const router = express.Router();
const { allQuery, getQuery, runQuery } = require('../database');
const { authenticateToken } = require('../middleware/auth');

// GET all education
router.get('/', async (req, res) => {
  try {
    const list = await allQuery(`SELECT * FROM education ORDER BY id DESC`);
    res.json(list);
  } catch (err) {
    console.error('Error fetching education:', err);
    res.status(500).json({ error: 'Failed to fetch education list' });
  }
});

// CREATE education (Admin)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { degree, institution, year_status, details } = req.body;
    if (!degree || !institution) {
      return res.status(400).json({ error: 'Degree and institution are required.' });
    }
    const result = await runQuery(
      `INSERT INTO education (degree, institution, year_status, details) VALUES (?, ?, ?, ?)`,
      [degree, institution, year_status || '', details || '']
    );
    const created = await getQuery(`SELECT * FROM education WHERE id = ?`, [result.lastID]);
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating education:', err);
    res.status(500).json({ error: 'Failed to create education entry' });
  }
});

// UPDATE education (Admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { degree, institution, year_status, details } = req.body;
    const { id } = req.params;

    await runQuery(
      `UPDATE education SET degree=?, institution=?, year_status=?, details=? WHERE id=?`,
      [degree, institution, year_status, details, id]
    );
    const updated = await getQuery(`SELECT * FROM education WHERE id = ?`, [id]);
    res.json(updated);
  } catch (err) {
    console.error('Error updating education:', err);
    res.status(500).json({ error: 'Failed to update education entry' });
  }
});

// DELETE education (Admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await runQuery(`DELETE FROM education WHERE id = ?`, [id]);
    res.json({ message: 'Education entry deleted successfully' });
  } catch (err) {
    console.error('Error deleting education:', err);
    res.status(500).json({ error: 'Failed to delete education entry' });
  }
});

module.exports = router;
