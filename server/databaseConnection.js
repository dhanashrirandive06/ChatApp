const mongoose = require("mongoose");

const URL = `mongodb+srv://dhanashrirandive06:dhanashrirandive06@cluster0.atftie4.mongodb.net/`;

mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to db"))
  .catch((e) => console.log("Error in db connection", e));
