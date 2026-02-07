import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "@fluidjs/multer-cloudinary";
import { v4 as uuidv4 } from "uuid";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "greenville/public/images",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      public_id: `image-${uuidv4()}`,
    };
  },
});

export const upload = multer({ storage: storage });
