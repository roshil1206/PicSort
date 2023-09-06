const bcrypt = require("bcryptjs");

const response = (res, statusCode, success, data) => {
  return res.status(statusCode).json({ success, data });
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        reject(err);
      } else {
        resolve(hashedPassword);
      }
    });
  });
};

const comparePassword = async (password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (err, result) {
      if (result === true) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

const getFileExtension = (name) => {
  const parts = name.split(".");

  const extension = parts[parts.length - 1];

  return "." + extension.toLowerCase();
};

module.exports = { response, hashPassword, comparePassword, getFileExtension };
