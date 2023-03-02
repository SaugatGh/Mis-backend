const jwt = require("jsonwebtoken");

//? Token verification
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).sender({ message: "Invalid Credentials!" });
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");
      // console.log(user);
      req.user = user;
      next();
    });
  }
};

//? TokenAuthorization

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      req
        .status(403)
        .json(
          "You are not allowed to do that you are authorization from token"
        );
    }
  });
};

//? TokenAndAdmin

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res
        .status(403)
        .json(
          "You are not allwed to that because you dont have verifyToken from Admin"
        );
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
};
