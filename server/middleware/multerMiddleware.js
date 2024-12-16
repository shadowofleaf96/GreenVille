const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("@fluidjs/multer-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "greenville/public/images",
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id:`image-${Date.now()}`,
  },
});

const upload = multer({ storage: storage });
module.exports = { upload };
