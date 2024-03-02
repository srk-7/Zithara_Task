const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'customers',
    password: 'root',
    port: 5432,
});


const app = express();
app.use(cors());
app.get('/getUsers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customer');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
});

app.get('/getSearchUsers', async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;
    const result = await pool.query(
      `SELECT * FROM customer WHERE customer_name ILIKE '%${searchTerm}%' OR location ILIKE '%${searchTerm}%'`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
}
);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});