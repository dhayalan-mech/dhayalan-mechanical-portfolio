const express = require('express');
const router = express.Router();
const { getQuery, runQuery } = require('../database');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET Profile
router.get('/', async (req, res) => {
  try {
    const profile = await getQuery(`SELECT * FROM profile ORDER BY id ASC LIMIT 1`);
    res.json(profile || {});
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// UPDATE Profile (Admin)
router.put('/', authenticateToken, async (req, res) => {
  try {
    const { name, role, location, email, phone, linkedin, github, bio, short_intro, photo_url } = req.body;

    const existing = await getQuery(`SELECT id FROM profile LIMIT 1`);

    if (existing) {
      await runQuery(
        `UPDATE profile SET name=?, role=?, location=?, email=?, phone=?, linkedin=?, github=?, bio=?, short_intro=?, photo_url=? WHERE id=?`,
        [name, role, location, email, phone, linkedin, github, bio, short_intro, photo_url, existing.id]
      );
    } else {
      await runQuery(
        `INSERT INTO profile (name, role, location, email, phone, linkedin, github, bio, short_intro, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, role, location, email, phone, linkedin, github, bio, short_intro, photo_url]
      );
    }

    const updated = await getQuery(`SELECT * FROM profile ORDER BY id ASC LIMIT 1`);
    res.json({ message: 'Profile updated successfully', profile: updated });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Upload Profile Photo (Admin)
router.post('/photo', authenticateToken, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const photo_url = `/uploads/${req.file.filename}`;
    const existing = await getQuery(`SELECT id FROM profile LIMIT 1`);

    if (existing) {
      await runQuery(`UPDATE profile SET photo_url=? WHERE id=?`, [photo_url, existing.id]);
    }

    res.json({ message: 'Profile photo uploaded successfully', photo_url });
  } catch (err) {
    console.error('Error uploading photo:', err);
    res.status(500).json({ error: 'Failed to upload profile photo' });
  }
});

module.exports = router;
