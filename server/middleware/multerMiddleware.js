// Shadow Of Leaf was Here

const multer = require("multer");

// Set up multer storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the destination folder for uploaded files
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    // Use the original filename
    cb(null, file.originalname);
  },
});

// Initialize the upload variable after the storage object has been created.
const upload = multer({ storage: storage });

module.exports = { upload };
