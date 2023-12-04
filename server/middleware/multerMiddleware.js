// Shadow Of Leaf was Here

const multer = require("multer");

// Set up multer storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Prepend the current working directory (cwd) to the path
    const path = `public/images`;
    cb(null, path);
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

// Initialize the upload variable after the storage object has been created.
const upload = multer({ storage: storage });

module.exports = { upload };
