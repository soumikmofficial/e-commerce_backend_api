/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    $match: {
      product: new ObjectId("61ab47f01c8c1fc40dffc1da"),
    },
  },
  {
    $group: {
      _id: null,
      averageRating: {
        $avg: "$rating",
      },
      numOfReviews: {
        $sum: 1,
      },
    },
  },
];

MongoClient.connect(
  "mongodb+srv://soumik:quickpass@node-express-projects.e0snz.mongodb.net/test?authSource=admin&replicaSet=atlas-x7sj1n-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true",
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (connectErr, client) {
    assert.equal(null, connectErr);
    const coll = client.db("ecommerce_backend_api").collection("reviews");
    coll.aggregate(agg, (cmdErr, result) => {
      assert.equal(null, cmdErr);
    });
    client.close();
  }
);
