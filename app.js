const express=require("express")
const pgPromise=require('pg-promise') ;
const dotenv=require('dotenv') ;

dotenv.config();
const app = express();
const port = 8000;

const pgp = pgPromise();
const connectionString = {
  connectionString: process.env.DB_CONNECTION_STRING,
};

console.log(process.env.DB_CONNECTION_STRING)
const db = pgp(connectionString);

app.use(express.json()); 

app.get('/data', async (req, res) => {
  try {
    const data = await db.query('SELECT * FROM users');
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/data', async (req, res) => {
  try {
    const { name, email } = req.body; 

    const query = 'INSERT INTO users (name, email) VALUES ($1, $2)';
    await db.query(query, [name, email]);
    res.status(201).json({ message: 'Success.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
