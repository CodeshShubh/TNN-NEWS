import multer from "multer";
import cloudinary from "../config/cloudinary.js"; //use your configured instance
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Request } from "express";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file) => {
    return {
      folder: "TNN-News",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      resource_type: "image",
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

export const upload = multer({ storage });
