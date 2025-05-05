const { verifyAccessToken } = require("../utils/jwt");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const decoded = await verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized",
    });
  }
};

module.exports = authMiddleware;
