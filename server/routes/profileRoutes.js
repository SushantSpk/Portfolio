const express = require("express");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

function asyncHandler(handler) {
  return function wrappedHandler(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function pick(source, allowedFields) {
  return allowedFields.reduce((result, field) => {
    if (Object.prototype.hasOwnProperty.call(source, field)) {
      result[field] = source[field];
    }
    return result;
  }, {});
}

router.put(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const payload = pick(req.body, [
      "full_name",
      "role",
      "bio",
      "location",
      "profile_image_url",
      "resume_url",
      "email",
    ]);

    payload.updated_at = new Date().toISOString();

    const { data: existing, error: readError } = await req.supabase
      .from("profile")
      .select("id")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (readError) throw readError;

    const query = existing
      ? req.supabase.from("profile").update(payload).eq("id", existing.id)
      : req.supabase.from("profile").insert(payload);

    const { data, error } = await query.select("*").single();

    if (error) throw error;

    res.json(data);
  })
);

module.exports = router;
