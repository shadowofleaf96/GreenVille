// Shadow Of Leaf was Here

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = `public/images`;
    cb(null, path);
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };
