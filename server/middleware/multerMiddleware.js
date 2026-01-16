const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("@fluidjs/multer-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // uuid v13 is ESM-only, using dynamic import to bridge CommonJS
    const { v4: uuidv4 } = await import("uuid");
    return {
      folder: "greenville/public/images",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      public_id: `image-${uuidv4()}`,
    };
  },
});

const upload = multer({ storage: storage });
module.exports = { upload };
