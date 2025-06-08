const express = require("express");
const router  = express.Router();
const db      = require("../models/db");

router.get("/", async (req, res) => {
  try {
    const [books]       = await db.query("SELECT COUNT(*) AS total_books FROM book");
    const [available]   = await db.query("SELECT COUNT(*) AS available_books FROM book WHERE status = 'available'");
    const [checkedOut]  = await db.query("SELECT COUNT(*) AS checked_out_books FROM book WHERE status = 'checked_out'");
    const [users]       = await db.query("SELECT COUNT(*) AS total_users FROM user");
    const [loans]       = await db.query("SELECT COUNT(*) AS total_loans FROM loan");
    const [activeLoans] = await db.query("SELECT COUNT(*) AS active_loans FROM loan WHERE status = 'aktywne'");
    const [fines]       = await db.query("SELECT SUM(fine_total) AS total_fines FROM loan");
    const [loansByMonth]= await db.query(`
      SELECT DATE_FORMAT(loan_date,'%Y-%m') AS month, COUNT(*) AS count
      FROM loan
      GROUP BY month
      ORDER BY month
    `);

    res.json({
      books:       books[0].total_books,
      available:   available[0].available_books,
      checkedOut:  checkedOut[0].checked_out_books,
      users:       users[0].total_users,
      loans:       loans[0].total_loans,
      activeLoans: activeLoans[0].active_loans,
      totalFines:  parseFloat(fines[0].total_fines || 0),
      loansByMonth
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching stats");
  }
});

router.get("/genre-distribution", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT g.name AS genre, COUNT(*) AS count
      FROM book b
      JOIN genre g ON b.genre_id = g.genre_id
      GROUP BY g.name
      ORDER BY count DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching genre distribution" });
  }
});

router.get("/top-users", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT CONCAT(u.first_name,' ',u.last_name) AS user, COUNT(*) AS loans
      FROM loan l
      JOIN user u ON l.user_id = u.user_id
      GROUP BY l.user_id
      ORDER BY loans DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching top users" });
  }
});

router.get("/top-authors", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT CONCAT(a.first_name,' ',a.last_name) AS author, COUNT(*) AS loans
      FROM loan l
      JOIN book b   ON l.book_id  = b.book_id
      JOIN author a ON b.author_id = a.author_id
      GROUP BY a.author_id
      ORDER BY loans DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching top authors" });
  }
});

router.get("/avg-loan-duration", async (req, res) => {
    try {
      const [[{ avg_duration }]] = await db.query(`
        SELECT AVG(DATEDIFF(return_date, loan_date)) AS avg_duration
        FROM loan
        WHERE return_date IS NOT NULL
      `);
      res.json({ avgDuration: avg_duration || 0 });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching average loan duration" });
    }
  });
  
  router.get("/monthly-average-duration", async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          DATE_FORMAT(return_date, '%Y-%m') AS month,
          AVG(DATEDIFF(return_date, loan_date)) AS avg_duration
        FROM loan
        WHERE return_date IS NOT NULL
        GROUP BY month
        ORDER BY month
      `);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching monthly average duration" });
    }
  });
  
  router.get("/loans-by-genre", async (req, res) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          g.name  AS genre,
          COUNT(*) AS count
        FROM loan l
        JOIN book b   ON l.book_id  = b.book_id
        JOIN genre g  ON b.genre_id = g.genre_id
        GROUP BY g.name
        ORDER BY count DESC
      `);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching loans by genre" });
    }
  });

module.exports = router;
