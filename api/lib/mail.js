const nodemailer = require("nodemailer");

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function createTransport() {
  const port = Number(process.env.ZOHO_SMTP_PORT || 465);
  return nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST || "smtp.zoho.com",
    port,
    secure: port === 465,
    auth: {
      user: required("ZOHO_SMTP_USER"),
      pass: required("ZOHO_SMTP_PASS")
    }
  });
}

function brandFrom() {
  const from = process.env.MAIL_FROM || process.env.ZOHO_SMTP_USER;
  return `"ARCAMBE" <${from}>`;
}

function salesInbox() {
  return process.env.SALES_TO || "info@arcambe.com";
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return Object.fromEntries(new URLSearchParams(raw));
  }
}

function emailLayout(title, body) {
  return `
    <div style="margin:0;padding:28px;background:#f6f4ed;font-family:Inter,Arial,sans-serif;color:#102019">
      <div style="max-width:640px;margin:auto;background:#ffffff;border:1px solid #dfe6df;border-radius:12px;overflow:hidden">
        <div style="background:#082d22;color:#ffffff;padding:24px 28px">
          <div style="font-size:22px;font-weight:800;letter-spacing:.04em">ARCAMBE</div>
          <div style="font-size:12px;color:#7ee0ae;text-transform:uppercase;letter-spacing:.16em">SIG & Solucoes Ambientais</div>
        </div>
        <div style="padding:28px">
          <h1 style="font-size:26px;line-height:1.15;margin:0 0 16px;color:#102019">${escapeHtml(title)}</h1>
          ${body}
        </div>
        <div style="padding:20px 28px;background:#f0f5f0;color:#61706a;font-size:13px">
          ARCAMBE SIG & Solucoes Ambientais, LDA | Maputo, Mocambique | info@arcambe.com
        </div>
      </div>
    </div>`;
}

module.exports = {
  createTransport,
  brandFrom,
  salesInbox,
  json,
  readBody,
  escapeHtml,
  emailLayout
};
