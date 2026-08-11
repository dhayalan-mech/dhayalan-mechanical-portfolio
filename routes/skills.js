const express = require('express');
const router = express.Router();
const { allQuery, getQuery, runQuery } = require('../database');
const { authenticateToken } = require('../middleware/auth');

// GET skills
router.get('/', async (req, res) => {
  try {
    const skills = await allQuery(`SELECT * FROM skills ORDER BY category ASC, id ASC`);
    res.json(skills);
  } catch (err) {
    console.error('Error fetching skills:', err);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// CREATE skill (Admin)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, category, level, icon } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }
    const result = await runQuery(
      `INSERT INTO skills (name, category, level, icon) VALUES (?, ?, ?, ?)`,
      [name, category, level || 'Intermediate', icon || 'Wrench']
    );
    const created = await getQuery(`SELECT * FROM skills WHERE id = ?`, [result.lastID]);
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating skill:', err);
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

// UPDATE skill (Admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, category, level, icon } = req.body;
    const { id } = req.params;

    await runQuery(
      `UPDATE skills SET name=?, category=?, level=?, icon=? WHERE id=?`,
      [name, category, level, icon, id]
    );
    const updated = await getQuery(`SELECT * FROM skills WHERE id = ?`, [id]);
    res.json(updated);
  } catch (err) {
    console.error('Error updating skill:', err);
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

// DELETE skill (Admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await runQuery(`DELETE FROM skills WHERE id = ?`, [id]);
    res.json({ message: 'Skill deleted successfully' });
  } catch (err) {
    console.error('Error deleting skill:', err);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

module.exports = router;
