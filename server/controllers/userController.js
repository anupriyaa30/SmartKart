const like = async (req, res) => {
  const db = req.db
  const userId = res.user.data.id
  const { product } = req.body
  const collection = db.collection("likes")

  const like = await collection.findOne({"user": userId, "product": product})
  if (!like) {
    collection.insertOne({"user": userId, "product": product})
    res.status(200).json({ok: "true", message: "Liked"})
  }
  else {
    res.json({ok: "false", message: "Couldn't like"})
  }
}

const liked = async (req, res) => {
  const db = req.db
  const userId = res.user.data.id
  const { product } = req.body
  const collection = db.collection("likes")
  const like = await collection.findOne({"user": userId, "product": product})

  if (like) {
    res.status(200).json({ok: "true", message: "true"})
  }
  else if (like === null || like === undefined) {
    res.status(200).json({ok: "true", message: "false"})
  }
  else {
    res.status(500).json({ok: "false", message: "Unknown Error"})
  }
}

const productClicked = async (req, res) => {
  const db = req.db
  const userId = res.user.data.id
  const { product } = req.body
  const collection = db.collection("clicks")
  const present = await collection.findOne({"user": userId, "product": product})
  
  if (present) {
    const updatedCount = present.count + 1
    await collection.updateOne({"user": userId, "product": product}, { $set: {"count": updatedCount} })
    const done = await collection.findOne({"user": userId, "product": product})
    if (done.count === updatedCount) {
      res.status(200).json({ok: "true", message: "Incremented clicks"})
    }
    else {
      res.status(200).json({ok: "false", message: "Couldn't increment clicks"})
    }
  }
  else {
    await collection.insertOne({"user": userId, "product": product, "count": 1})
    const done = await collection.findOne({"user": userId, "product": product})
    if (done) {
      res.status(200).json({ok: "true", message: "Incremented clicks"})
    }
    else {
      res.status(200).json({ok: "false", message: "Couldn't increment clicks"})
    }
  }
}

module.exports = { like, liked, productClicked }