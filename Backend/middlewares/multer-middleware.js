import multer from "multer";
import fs from "fs";
import crypto from "crypto";

// Create temp directory if it doesn't exist
const uploadDir = "./temp";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Allowed MIME types
const ALLOWED_MIME_TYPES_BY_FIELD = {
  photo: new Set(["image/jpeg", "image/png"]),
  aadharCardPhoto: new Set(["image/jpeg", "image/png", "application/pdf"]),
};

const EXTENSION_BY_MIME_TYPE = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "application/pdf": ".pdf",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = EXTENSION_BY_MIME_TYPE[file.mimetype] || "";
    cb(null, `${crypto.randomUUID()}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES_BY_FIELD[file.fieldname]?.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "Unsupported file type"
      )
    );
  }
};

export const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 2,
  },

  fileFilter,
});

export const registrationUpload = (req, res, next) => {
  const registrationFields = upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "aadharCardPhoto", maxCount: 1 },
  ]);

  registrationFields(req, res, async (error) => {
    if (!error) {
      next();
      return;
    }

    await cleanupUploadedFiles(req.files);
    res.status(400).json({
      success: false,
      message: "The uploaded files are invalid or exceed the allowed size.",
    });
  });
};

export const cleanupUploadedFiles = async (files) => {
  const uploadedFiles = files && typeof files === "object"
    ? Object.values(files).flat().filter(Boolean)
    : [];

  await Promise.all(uploadedFiles.map(async (file) => {
    if (!file?.path) return;
    try {
      await fs.promises.unlink(file.path);
    } catch (error) {
      if (error?.code !== "ENOENT") {
        console.error("Temporary upload cleanup failed.");
      }
    }
  }));
};
