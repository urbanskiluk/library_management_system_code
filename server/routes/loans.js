const express = require('express');
const router = express.Router();
const db     = require('../models/db');

const GRACE_PERIOD = 30;
const DAILY_FINE    = 0.50;

router.get('/books/available', async (req, res) => {
  try {
    const [books] = await db.query(`
      SELECT b.book_id, b.title,
             CONCAT(a.first_name,' ',a.last_name) AS author,
             g.name AS genre, b.isbn
      FROM book b
      JOIN author a ON b.author_id = a.author_id
      JOIN genre  g ON b.genre_id  = g.genre_id
      WHERE b.status = 'available'
      ORDER BY b.book_id
    `);
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching available books' });
  }
});

router.get('/', async (req, res) => {
  try {
    const [loans] = await db.query(`
      SELECT
        l.loan_id,
        l.user_id,
        CONCAT(u.first_name,' ',u.last_name) AS user_name,
        l.book_id,
        b.title AS book_title,
        DATE_FORMAT(l.loan_date,'%Y-%m-%d')   AS loan_date,
        DATE_FORMAT(l.return_date,'%Y-%m-%d') AS return_date,
        l.status,
        CASE
          WHEN l.status = 'aktywne po terminie'
            THEN GREATEST(DATEDIFF(CURDATE(), l.loan_date) - ?, 0)
          ELSE 0
        END AS overdue_days,
        CASE
          WHEN l.status = 'nieaktywne'
            THEN l.fine_total
          WHEN l.status = 'aktywne po terminie'
            THEN GREATEST(DATEDIFF(CURDATE(), l.loan_date) - ?, 0) * ?
          ELSE 0
        END AS fine_amount
      FROM loan l
      JOIN user u ON l.user_id = u.user_id
      JOIN book b ON l.book_id = b.book_id
      ORDER BY l.loan_date DESC
    `, [GRACE_PERIOD, GRACE_PERIOD, DAILY_FINE]);

    res.json(loans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching loans' });
  }
});

router.post('/', async (req, res) => {
  const { user_id, book_id } = req.body;
  if (!user_id || !book_id) return res.status(400).json({ message: 'Missing user_id or book_id' });
  try {
    await db.query(`INSERT INTO loan (user_id, book_id, loan_date, status)
                    VALUES (?, ?, CURDATE(), 'aktywne')`, [user_id, book_id]);
    await db.query(`UPDATE book SET status = 'checked_out' WHERE book_id = ?`, [book_id]);
    res.status(201).json({ message: 'Loan created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating loan' });
  }
});

router.put('/:id/return', async (req, res) => {
  const loanId = req.params.id;
  try {
    const [rows] = await db.query(
      'SELECT loan_date, status FROM loan WHERE loan_id = ?',
      [loanId]
    );
    if (!rows.length) return res.status(404).json({ message: 'Loan not found' });
    const { loan_date, status } = rows[0];

    let fine = 0;
    if (status === 'aktywne po terminie') {
      const [[{ overdue }]] = await db.query(
        `SELECT GREATEST(DATEDIFF(CURDATE(), ?) - ?, 0) AS overdue`,
        [loan_date, GRACE_PERIOD]
      );
      fine = overdue * DAILY_FINE;
    }

    await db.query(
      `UPDATE loan
         SET return_date = CURDATE(),
             status      = 'nieaktywne',
             fine_total  = ?
       WHERE loan_id = ?`,
      [fine, loanId]
    );

    await db.query(
      `UPDATE book
         SET status = 'available'
       WHERE book_id = (
         SELECT book_id FROM loan WHERE loan_id = ?
       )`,
      [loanId]
    );

    res.json({ message: 'Loan returned, fine recorded' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error returning loan' });
  }
});

module.exports = router;
