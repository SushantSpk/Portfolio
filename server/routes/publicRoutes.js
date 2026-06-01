const express = require("express");
const { getSupabase } = require("../config/supabase");

const router = express.Router();

function asyncHandler(handler) {
  return function wrappedHandler(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function requireSupabase(req, res, next) {
  const supabase = getSupabase();

  if (!supabase) {
    return res.status(500).json({
      error: "Supabase is not configured. Check server/.env.",
    });
  }

  req.supabase = supabase;
  return next();
}

function assertRequired(value, label) {
  if (!value || String(value).trim() === "") {
    const error = new Error(`${label} is required.`);
    error.statusCode = 400;
    throw error;
  }
}

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is running",
    env: {
      supabaseConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
      resendConfigured: Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL),
      clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
    },
  });
});

router.get(
  "/profile",
  requireSupabase,
  asyncHandler(async (req, res) => {
    const { data, error } = await req.supabase
      .from("profile")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    res.json(data || null);
  })
);

router.get(
  "/projects",
  requireSupabase,
  asyncHandler(async (req, res) => {
    const { data, error } = await req.supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data || []);
  })
);

router.post(
  "/contact",
  requireSupabase,
  asyncHandler(async (req, res) => {
    const { name, email, company, message } = req.body;

    assertRequired(name, "Name");
    assertRequired(email, "Email");
    assertRequired(message, "Message");

    const { data, error } = await req.supabase
      .from("contact_messages")
      .insert({
        name: name.trim(),
        email: email.trim(),
        company: company ? company.trim() : null,
        message: message.trim(),
      })
      .select("*")
      .single();

    if (error) throw error;

    res.status(201).json({
      message: "Message received.",
      data,
    });
  })
);

module.exports = router;
