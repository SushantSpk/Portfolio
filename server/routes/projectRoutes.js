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

function assertRequired(value, label) {
  if (!value || String(value).trim() === "") {
    const error = new Error(`${label} is required.`);
    error.statusCode = 400;
    throw error;
  }
}

const projectFields = [
  "title",
  "category",
  "description",
  "image_url",
  "shot_label",
  "tech_stack",
  "live_url",
  "case_study_url",
  "github_url",
  "display_order",
  "is_featured",
];

router.post(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const payload = pick(req.body, projectFields);
    assertRequired(payload.title, "Project title");

    const { data, error } = await req.supabase
      .from("projects")
      .insert(payload)
      .select("*")
      .single();

    if (error) throw error;

    res.status(201).json(data);
  })
);

router.put(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const payload = pick(req.body, projectFields);
    payload.updated_at = new Date().toISOString();

    const { data, error } = await req.supabase
      .from("projects")
      .update(payload)
      .eq("id", req.params.id)
      .select("*")
      .single();

    if (error) throw error;

    res.json(data);
  })
);

router.delete(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { error } = await req.supabase.from("projects").delete().eq("id", req.params.id);

    if (error) throw error;

    res.status(204).send();
  })
);

module.exports = router;
