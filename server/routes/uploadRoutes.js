const express = require("express");
const requireAdmin = require("../middleware/requireAdmin");
const upload = require("../middleware/upload");

const router = express.Router();

function asyncHandler(handler) {
  return function wrappedHandler(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function cleanFolderName(value) {
  const fallback = "uploads";
  const folder = String(value || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9-_/]/g, "-")
    .replace(/\/+/g, "/")
    .replace(/^\/|\/$/g, "");

  return folder || fallback;
}

router.post(
  "/",
  requireAdmin,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded. Use a multipart field named file.",
      });
    }

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "portfolio-images";
    const folder = cleanFolderName(req.body.folder);
    const extension = req.file.originalname.split(".").pop() || "bin";
    const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${extension}`;
    const storagePath = `${folder}/${fileName}`;

    const { error: uploadError } = await req.supabase.storage
      .from(bucket)
      .upload(storagePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data } = req.supabase.storage.from(bucket).getPublicUrl(storagePath);

    res.status(201).json({
      path: storagePath,
      publicUrl: data.publicUrl,
    });
  })
);

module.exports = router;
