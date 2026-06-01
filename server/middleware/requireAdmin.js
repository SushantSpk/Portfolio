const { getSupabase } = require("../config/supabase");

async function requireAdmin(req, res, next) {
  const supabase = getSupabase();
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!supabase) {
    return res.status(500).json({
      error: "Supabase is not configured. Check server/.env.",
    });
  }

  if (!adminEmail) {
    return res.status(500).json({
      error: "ADMIN_EMAIL is missing in server/.env.",
    });
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).json({
      error: "Admin login required.",
    });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({
      error: "Invalid or expired admin session.",
    });
  }

  if ((data.user.email || "").toLowerCase() !== adminEmail.toLowerCase()) {
    return res.status(403).json({
      error: "This account is not allowed to access the admin area.",
    });
  }

  req.supabase = supabase;
  req.adminUser = data.user;
  return next();
}

module.exports = requireAdmin;
