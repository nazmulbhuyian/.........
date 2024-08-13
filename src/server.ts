const mongoose = require("mongoose");
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.kt8xke4.mongodb.net/cit_furniture?retryWrites=true&w=majority&appName=Cluster0`;

function connectDB() {
  mongoose.set("strictQuery", false);
  const time = new Date().toLocaleTimeString();
  const date = new Date().toLocaleString("en-us", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  mongoose
    .connect(uri)
    .then(() => {
      console.log(
        "\x1b[36m%s\x1b[0m",
        "[FC]",
        time,
        ":",
        date,
        ": Database is connected Successfully"
      );
    })
    .catch((err: Error) => {
      console.error(`Error connecting to MongoDB: ${err.message}`);
    });
}

export default connectDB;
