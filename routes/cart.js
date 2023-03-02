const _ = require("lodash");
const Cart = require("../models/Cart");
const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("./verifyToken");
//? CREATE

router.post("/", verifyToken, async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user.id });
  const product = _.pick(req.body, ["productId", "quantity", "color", "size"]);
  if (cart) {
    cart = await Cart.updateOne(
      {
        _id: cart._id,
      },
      {
        $push: {
          products: product,
        },
      }
    );
  } else {
    cart = await Cart.create({
      userId: req.user.id,
      products: [product],
    });
  }
  res.status(200).send(cart);
});

//? DELETE

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted!");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/", verifyToken, async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user.id });
  if (cart) {
    await Cart.deleteOne({ userId: req.user.id });
  }
  res.status(200).send({ message: "Success" });
});

//? UPDATE

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updateCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    req.status(200).json(updateCart);
  } catch (error) {
    res.status(200).json(error);
  }
});

//? GET USER CART
router.get("/", verifyToken, async (req, res) => {
  // console.log(req.user);
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "product.productId"
    );
    req.status(200).json(cart?.products || []);
  } catch (error) {
    res.status(500).json(error);
  }
});

//? GEt ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (error) {
    res.status(200).json(error);
  }
});

module.exports = router;
