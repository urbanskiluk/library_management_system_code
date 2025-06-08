const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/', async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          book.book_id, 
          book.title, 
          book.publisher, 
          genre.name AS genre,
          book.isbn,
          book.status,
          CONCAT(author.first_name, ' ', author.last_name) AS author
        FROM book
        JOIN author ON book.author_id = author.author_id
        JOIN genre ON book.genre_id = genre.genre_id
      `);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching books' });
    }
  });

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM book WHERE book_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Nie znaleziono książki' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Błąd serwera przy pobieraniu książki' });
  }
});

router.put('/:id', async (req, res) => {
  const { title, publisher, isbn, author_id, genre_id } = req.body;
  try {
    await db.query(
      `UPDATE book SET title = ?, publisher = ?, isbn = ?, author_id = ?, genre_id = ? WHERE book_id = ?`,
      [title, publisher, isbn, author_id, genre_id, req.params.id]
    );
    res.json({ message: 'Książka zaktualizowana' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Błąd przy aktualizacji książki' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM book WHERE book_id = ?', [req.params.id]);
    res.json({ message: 'Książka usunięta' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Błąd podczas usuwania książki' });
  }
});

router.post('/', async (req, res) => {
  const { title, publisher, isbn, author_id, genre_id } = req.body;
  try {
    await db.execute(
      'INSERT INTO book (title, publisher, isbn, author_id, genre_id) VALUES (?, ?, ?, ?, ?)',
      [title, publisher, isbn, author_id, genre_id]
    );
    res.status(201).send('Książka dodana');
  } catch (err) {
    console.error(err);
    res.status(500).send('Błąd przy dodawaniu książki');
  }
});

module.exports = router;