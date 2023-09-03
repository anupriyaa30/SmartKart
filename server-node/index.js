const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const { connectToDatabase } = require('./db/conn');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

require('dotenv').config();

const corsOptions = {
	origin: ["http://localhost:3000"],
	credentials: true,
};
const app = express();
app.use(cors(corsOptions))
app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser())


connectToDatabase()
  .then((db) => {
    app.use((req, res, next) => {
      req.db = db;
      next();
    });
    app.use(authRoutes);
    app.use(userRoutes);

    app.get('/', (req, res) => {
      res.send("Node server ready")
    })

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });
