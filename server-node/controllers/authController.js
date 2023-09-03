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
  console.log(req.body)
  res.send("1")
}

const login = async (req, res) => {
  const db = req.db
  const { email, password } = req.body
  const collection = db.collection("users")
  const count = db.collection("user_counter")
  let counter = await count.find({}).toArray()
  const user_count = counter[0].count
  const userPresent = await collection.findOne({ "email": email })

  if (!userPresent) {
    await collection.insertOne({ _id: user_count + 1, email: email, password: password })
    const confirmed = await collection.findOne({ "email": email })
    const result = await count.updateOne({}, { $set: { "count": user_count + 1 } })
    if (confirmed) {
      try {
        const token = createToken({ "email": email, "_id": user_count + 1 })
        // res.cookie('login', token, { httpOnly: true, maxAge: age * 1000, SameSite: "none" })
        res.cookie('login', token, {
          httpOnly: true,
          secure: true,
          SameSite: 'none',
          maxAge: age * 1000,
          domain: '.vercel.app',
        });
        res.status(200).json({ ok: true, message: "Account created and logged in." })
      }
      catch (err) {
        console.log(err)
        res.status(500).json({ ok: false, message: "Error while signing up", error: err })
      }
    }
    else {
      res.status(500).json({ ok: false, message: "Error while signing up" })
    }
  }
  else {
    // login the user
    const saved_user = await collection.findOne({ "email": email })
    const id = saved_user['_id']
    const saved_password = saved_user['password']
    if (password === saved_password) {
      const token = createToken({ "email": email, "_id": id })
      // res.cookie('login', token, { httpOnly: true, maxAge: age * 1000, SameSite: "none" })
      res.cookie('login', token, {
        httpOnly: true,
        secure: true,
        SameSite: 'none',
        maxAge: age * 1000,
        domain: '.vercel.app',
      });
      res.status(200).json({ ok: true, message: "Logged In" })
    }
    else {
      res.status(200).json({ ok: false, message: "Wrong password" })
    }
  }
}

const checkLogin = (req, res) => {
  const token = req.cookies.login;
  // check if token exists
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        // console.log(err);
        res.status(401).json({ ok: false, message: "Error while fetching the token", error: err })
      }
      else {
        res.status(200).json({ ok: true, message: decodedToken })
      }
    })
  }
  else {
    res.status(401).json({ ok: false, message: "Error while fetching the token" })
  }
}

const logout = (req, res) => {
  const token = req.cookies.login;
  try {
    // res.cookie('login', token, { httpOnly: true, maxAge: 1, SameSite: "none" })
    res.cookie('login', token, {
      httpOnly: true,
      secure: true,
      SameSite: 'none',
      maxAge: age * 1000,
      domain: '.vercel.app',
    });
    res.status(200).json({ ok: true, message: "Logged out" })
  }
  catch (err) {
    res.status(500).json({ ok: false, message: "Error logging out", error: err })
  }
}

module.exports = { test, login, checkLogin, logout }