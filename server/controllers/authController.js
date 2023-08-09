const jwt = require("jsonwebtoken")
require('dotenv').config();
const age = 3 * 24 * 60 * 60    // 3 days => in seconds

const createToken = (data) => {
  // payload => data
  return jwt.sign({ data }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: age
  })
}

const test = (req, res) => {
  res.send("Done")
}

const login = async (req, res) => {
  const db = req.db
  const { name, email } = req.body
  const collection = db.collection("users")
  const userPresent = await collection.findOne({ "email": email })


  if (!userPresent) {
    collection.insertOne(req.body)
    const confirmed = await collection.findOne({ "email": email })
    if (confirmed) {
      const token = createToken({ "email": email })
      res.cookie('login', token, { httpOnly: true, maxAge: age * 1000, SameSite: "none" })
      res.status(200).json({ ok: "true", message: "Account created and logged in." })
    }
    else {
      res.status(500).json({ ok: "false", message: "Error while signing up", error: err })
    }
  }
  else {
    // login the user
    const token = createToken({ "email": email })
    res.cookie('login', token, { httpOnly: true, maxAge: age * 1000, SameSite: "none" })
    res.status(200).json({ ok: "true", message: "Logged In" })
  }
}

module.exports = { test, login }