const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const { connectToDatabase } = require('./db/conn');
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json())
app.use(bodyParser.json())


connectToDatabase()
  .then((db) => {
    app.use((req, res, next) => {
      req.db = db;
      next();
    });
    app.use(authRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });
