const { Resend } = require("resend");

let resend;

function getResend() {
  if (resend) return resend;

  if (!process.env.RESEND_API_KEY) {
    return null;
  }

  resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

module.exports = {
  getResend,
};
