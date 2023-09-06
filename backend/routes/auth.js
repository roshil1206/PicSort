const { addUserToDb, getUserByEmailDb } = require("../db/queries");
const { hashPassword, comparePassword } = require("../utils/functions");
const { response } = require("../utils/functions");
const { AppError } = require("../utils/error");
const { generate } = require("../middleware/auth");

const router = require("express").Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await getUserByEmailDb(email);
  if (!user[0]) {
    throw new AppError(200, "User dosen't exist");
  }

  const isPasswordTrue = await comparePassword(password, user[0].password);
  if (!isPasswordTrue) {
    throw new AppError(200, "Invalid Credentials");
  }
  return response(res, 200, true, { token: await generate(user[0].id) });
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await hashPassword(password);

  await addUserToDb(email, hashed);

  return response(res, 200, true);
});

module.exports = router;
