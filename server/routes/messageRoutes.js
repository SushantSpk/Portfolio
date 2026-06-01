const express = require("express");
const { getResend } = require("../config/resend");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

function asyncHandler(handler) {
  return function wrappedHandler(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function assertRequired(value, label) {
  if (!value || String(value).trim() === "") {
    const error = new Error(`${label} is required.`);
    error.statusCode = 400;
    throw error;
  }
}

router.get(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { data, error } = await req.supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data || []);
  })
);

router.get(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { data, error } = await req.supabase
      .from("contact_messages")
      .select("*, message_replies(*)")
      .eq("id", req.params.id)
      .single();

    if (error) throw error;

    res.json(data);
  })
);

router.patch(
  "/:id/status",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const status = req.body.status || "read";

    const { data, error } = await req.supabase
      .from("contact_messages")
      .update({ status })
      .eq("id", req.params.id)
      .select("*")
      .single();

    if (error) throw error;

    res.json(data);
  })
);

router.post(
  "/:id/reply",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const replyBody = req.body.reply_body || req.body.replyBody;
    assertRequired(replyBody, "Reply body");

    const resend = getResend();
    if (!resend || !process.env.RESEND_FROM_EMAIL) {
      return res.status(500).json({
        error: "Resend is not configured. Check RESEND_API_KEY and RESEND_FROM_EMAIL in server/.env.",
      });
    }

    const { data: message, error: messageError } = await req.supabase
      .from("contact_messages")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (messageError) throw messageError;

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: message.email,
      subject: `Re: Your message to ${process.env.ADMIN_EMAIL || "Sushant"}`,
      text: replyBody,
    });

    const { data: reply, error: replyError } = await req.supabase
      .from("message_replies")
      .insert({
        message_id: message.id,
        reply_body: replyBody,
        sent_to: message.email,
      })
      .select("*")
      .single();

    if (replyError) throw replyError;

    await req.supabase
      .from("contact_messages")
      .update({
        status: "replied",
        replied_at: new Date().toISOString(),
      })
      .eq("id", message.id);

    res.status(201).json({
      message: "Reply sent.",
      data: reply,
    });
  })
);

module.exports = router;
