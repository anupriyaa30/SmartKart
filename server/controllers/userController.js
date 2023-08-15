const like = async (req, res) => {
  const db = req.db
  const userId = res.user.data.id
  const { product } = req.body
  const collection = db.collection("likes")

  const like = await collection.findOne({ "user": userId, "product": product })
  if (!like) {
    collection.insertOne({ "user": userId, "product": product })
    res.status(200).json({ ok: "true", message: "Liked" })
  }
  else {
    res.json({ ok: "false", message: "Couldn't like" })
  }
}

const liked = async (req, res) => {
  const db = req.db
  const userId = res.user.data.id
  const { product } = req.body
  const collection = db.collection("likes")
  const like = await collection.findOne({ "user": userId, "product": product })

  if (like) {
    res.status(200).json({ ok: "true", message: "true" })
  }
  else if (like === null || like === undefined) {
    res.status(200).json({ ok: "true", message: "false" })
  }
  else {
    res.status(500).json({ ok: "false", message: "Unknown Error" })
  }
}

const productClicked = async (req, res) => {
  const db = req.db
  const userId = res.user.data.id
  const { product } = req.body
  const collection = db.collection("clicks")
  const present = await collection.findOne({ "user": userId, "product": product })

  if (present) {
    const updatedCount = present.count + 1
    await collection.updateOne({ "user": userId, "product": product }, { $set: { "count": updatedCount } })
    const done = await collection.findOne({ "user": userId, "product": product })
    if (done.count === updatedCount) {
      res.status(200).json({ ok: "true", message: "Incremented clicks" })
    }
    else {
      res.status(200).json({ ok: "false", message: "Couldn't increment clicks" })
    }
  }
  else {
    await collection.insertOne({ "user": userId, "product": product, "count": 1 })
    const done = await collection.findOne({ "user": userId, "product": product })
    if (done) {
      res.status(200).json({ ok: "true", message: "Incremented clicks" })
    }
    else {
      res.status(200).json({ ok: "false", message: "Couldn't increment clicks" })
    }
  }
}

const rate = async (req, res) => {
  const db = req.db
  const user_id = res.user.data.id
  const { rating, product_id } = req.body
  const collection = db.collection("products")
  const present = await collection.findOne({ "id": product_id })

  if (present) {
    let no_of_ratings = present['no_of_ratings']
    let total_rating = present['ratings'] * no_of_ratings

    try {
      let collection2 = db.collection("ratings")
      const rating_present = await collection2.findOne({ "product": product_id, "user": user_id })

      if (rating_present) {
        total_rating -= rating_present["rating"]
        total_rating += rating
        let avg_rating = total_rating / no_of_ratings

        await collection.updateOne({ "id": product_id }, { $set: { "ratings": avg_rating, "no_of_ratings": no_of_ratings } })
        await collection2.updateOne({ "product": product_id, "user": user_id }, { $set: { "rating": rating } })
      }
      else {
        total_rating += rating
        let avg_rating = total_rating / (no_of_ratings + 1)
        await collection.updateOne({ "id": product_id }, { $set: { "ratings": avg_rating, "no_of_ratings": no_of_ratings + 1 } })
        collection2.insertOne({"product": product_id, "user": user_id, "rating": rating})
      }
      res.status(200).json({ ok: "true", message: "Ratings updated" })
    }
    catch (err) {
      res.status(500).json({ ok: "false", message: "Couldn't update the ratings", error: err })
    }
  }
  else {
    res.status(200).json({ ok: "false", message: "Couldn't update the ratings" })
  }
}

module.exports = { like, liked, productClicked, rate }