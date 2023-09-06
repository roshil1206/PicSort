const multer = require("multer");
const { AppError } = require("./error");

const storage = multer.memoryStorage();

module.exports = multer({
  storage: storage,

  fileFilter: function (req, file, cb) {
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];

    const fileExtension = file.originalname.toLowerCase().slice(-4);

    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true); // Accept the file
    } else {
      cb(
        new AppError(500, "Invalid file type. Only images are allowed."),
        false
      );
    }
  },
});
