const { createClient } = require("@supabase/supabase-js");

let supabase;

function getSupabase() {
  if (supabase) return supabase;

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabase;
}

module.exports = {
  getSupabase,
};
