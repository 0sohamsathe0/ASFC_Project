import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) {
    throw new Error("No file path provided.");
  }

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });


    return response;
  } catch (error) {
    console.error("Cloudinary upload failed.");
    throw error;
  } finally {
    try {
      if (fs.existsSync(localFilePath)) {
        await fs.promises.unlink(localFilePath);
      }
    } catch (err) {
      console.error("Failed to delete a temporary upload.");
    }
  }
};

export const uploadPrivateAadhaar = async (localFilePath) => {
  if (!localFilePath) throw new Error("No file path provided.");

  try {
    return await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      type: "authenticated",
      folder: "asfc/aadhaar",
    });
  } catch (error) {
    console.error("Protected Aadhaar upload failed.");
    throw error;
  } finally {
    try {
      await fs.promises.unlink(localFilePath);
    } catch (error) {
      if (error?.code !== "ENOENT") console.error("Failed to delete a temporary upload.");
    }
  }
};

export const createPrivateAadhaarAccessUrl = ({ publicId, format, resourceType }) => {
  const expiresAt = Math.floor(Date.now() / 1000) + 5 * 60;
  const url = cloudinary.utils.private_download_url(publicId, format, {
    resource_type: resourceType || "image",
    type: "authenticated",
    expires_at: expiresAt,
    attachment: false,
  });
  return { url, expiresAt };
};

export const deleteFromCloudinary = async (publicId, options = {}) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: options.resourceType || "image",
      type: options.type || "upload",
      invalidate: true,
    });
  } catch (error) {
    console.error("Cloudinary cleanup failed.");
  }
};
