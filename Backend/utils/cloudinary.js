import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File uploaded:", response.secure_url);

    return response.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return null;
  } finally {
    if (localFilePath && fs.existsSync(localFilePath)) {
      await fs.promises.unlink(localFilePath);
    }
  }
};

export { uploadOnCloudinary };