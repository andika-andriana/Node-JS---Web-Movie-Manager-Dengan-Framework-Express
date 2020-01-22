// Setup connection MongoDB
const mongoose = require("mongoose");

const mongoDB = `mongodb://MovieManager:12345@moviemanager-shard-00-00-mvaqk.mongodb.net:27017,moviemanager-shard-00-01-mvaqk.mongodb.net:27017,moviemanager-shard-00-02-mvaqk.mongodb.net:27017/test?ssl=true&replicaSet=moviemanager-shard-0&authSource=admin&retryWrites=true&w=majority`;

// base URL
// `mongodb+srv://MovieManager:12345@moviemanager-mvaqk.mongodb.net/test?retryWrites=true&w=majority`;

mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"));

mongoose.Promise = global.Promise;

module.exports = mongoose;
