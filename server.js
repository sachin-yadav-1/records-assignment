const app = require("./app");
const mongoose = require("mongoose");

const DB_URI =
  process.env.NODE_ENV === "development"
    ? process.env.DB_URI_LOCAL
    : process.env.DB_URI_ATLAS.replace("<PASS>", process.env.DB_PASS);

mongoose
  .connect(DB_URI, {})
  .then(() => console.log("DB connection successful!"))
  .catch((e) => console.log("DB connection error", e));

const PORT = process.env.PORT;
const server = app.listen(PORT, () =>
  console.log(`Server running on port: ${PORT}`)
);
