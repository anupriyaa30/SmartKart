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
  const db = req.db
  const coll = db.collection("products")
  console.log(coll)
  res.send("1");
}

const login = async (req, res) => {
  const db = req.db
  const { email, id } = req.body
  const collection = db.collection("users")
  const userPresent = await collection.findOne({ "email": email })

  if (!userPresent) {
    collection.insertOne(req.body)
    const confirmed = await collection.findOne({ "email": email })
    if (confirmed) {
      const token = createToken({ "email": email, "id": id })
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

const checkLogin = (req, res) => {
	const token = req.cookies.login;
	// check if token exists
	if (token) {
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
			if (err) {
				// console.log(err);
        res.status(500).json({ok: false, message: "Error while fetching the token", error: err})
			}
			else {
        res.status(200).json({ok: true, message: token})
			}
		})
	}
	else {
		res.status(500).json({ok: false, message: "Error while fetching the token"})
	}
}

const logout = (req, res) => {
  const token = req.cookies.login;
  try {
    res.cookie('login', token, { httpOnly: true, maxAge: 1, SameSite: "none" })
    res.status(200).json({ok: "true", message: "Logged out"})
  }
  catch (err) {
    res.status(500).json({ok: "false", message: "Error logging out", error: err})
  }
}

module.exports = { test, login, checkLogin, logout }