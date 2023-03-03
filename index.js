const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
// const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
//* MONGOOSE DATABASE CONNECTION
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database connection successfull!"))
  .catch((error) => {
    console.log(error);
  });

const router = express.Router();
router.get("/", (req, res) => {
  res.send("hello");
});
//? ROUTERS LISTENING URL "PROTOCOL/HOSTNAME:5555/PATH?/SEARCH#HASH"

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
// app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);
//? SERVER LISTEINING IN THE PORT
// app.save("view engine", "pug");
let PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Backend server  is running at port ${PORT}!`);
});
