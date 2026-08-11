const express = require('express');
const router = express.Router();
const { allQuery, getQuery, runQuery } = require('../database');
const { authenticateToken } = require('../middleware/auth');

// SUBMIT contact message (Public)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const result = await runQuery(
      `INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)`,
      [name, email, phone || '', message]
    );

    res.status(201).json({
      message: 'Thank you! Your message has been received successfully. Dhayalan will get back to you soon.',
      id: result.lastID
    });
  } catch (err) {
    console.error('Error saving contact message:', err);
    res.status(500).json({ error: 'Failed to process contact message. Please try again later.' });
  }
});

// GET all contact messages (Admin)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const list = await allQuery(`SELECT * FROM contact_messages ORDER BY id DESC`);
    res.json(list);
  } catch (err) {
    console.error('Error fetching contact messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// DELETE contact message (Admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await runQuery(`DELETE FROM contact_messages WHERE id = ?`, [id]);
    res.json({ message: 'Contact message deleted successfully' });
  } catch (err) {
    console.error('Error deleting contact message:', err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

module.exports = router;
