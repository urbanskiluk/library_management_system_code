const express = require('express');
const router  = express.Router();
const db      = require('../models/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM genre');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Błąd przy pobieraniu gatunków' });
  }
});

module.exports = router;