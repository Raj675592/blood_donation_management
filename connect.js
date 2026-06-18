const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
async function connectToMongoDB(url) {
  if (!url) {
    throw new Error("MongoDB connection URL is not defined in environment variables");
  }
  return mongoose.connect(url);
}

module.exports = {
  connectToMongoDB,
};
