const jwt = require("jsonwebtoken");
const { getUserByIdDb } = require("../db/queries");
const { AppError } = require("../utils/error");

const defaultExpiry = 60 * 60 * 24 * 30;

function verify(req, res, next) {
  try {
    if (!req.headers.authorization)
      throw new AppError(401, "Unauthorized Access");
    const token = req.headers.authorization.replace("Bearer ", "");

    if (!token) {
      throw new AppError(401, "Unauthorized Access");
    }

    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
      try {
        if (err) {
          throw new AppError(401, err.message);
        } else {
          const data = await getUserByIdDb(decoded.id);
          req.user = data;
          next();
        }
      } catch (err) {
        const { statusCode, message } = err;
        res.status(statusCode || 500).json({
          status: "error",
          statusCode: statusCode || 500,
          message: statusCode === 500 ? "An error occurred" : message,
        });
      }
    });
  } catch (error) {
    throw new AppError(401, error.message || "Unauthorized access");
  }
}

function generate(id) {
  let jwtExpirationTime = defaultExpiry;

  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: jwtExpirationTime,
  });
  return token;
}

module.exports = {
  generate,
  verify,
};
