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

function emailLayout(title, body, headerSubtitle = "") {
  return `
    <div style="margin:0;padding:40px 20px;background:#f3f4f6;font-family:Inter,Arial,sans-serif;color:#374151">
      <div style="max-width:600px;margin:auto;background:#ffffff;overflow:hidden;border:1px solid #e5e7eb;border-radius:8px">
        
        <!-- Header with Logo/Brand -->
        <div style="text-align:center;padding:30px 20px;background:#ffffff">
          <div style="font-size:28px;font-weight:900;color:#102019;letter-spacing:2px">ARCAMBE</div>
          <div style="font-size:11px;color:#059669;text-transform:uppercase;letter-spacing:3px;margin-top:4px">SIG & Soluções Ambientais</div>
        </div>
        
        <!-- Hero Section (Blue/Green block) -->
        <div style="background:#059669;color:#ffffff;padding:40px 30px;text-align:center">
          <h1 style="font-size:24px;line-height:1.3;margin:0;font-weight:700">${title}</h1>
          ${headerSubtitle ? `<p style="margin:16px 0 0;font-size:16px;color:#e5e7eb;line-height:1.5">${headerSubtitle}</p>` : ''}
        </div>
        
        <!-- Body Section -->
        <div style="padding:40px 30px;line-height:1.6;font-size:15px;color:#374151">
          ${body}
        </div>
        
        <!-- Footer -->
        <div style="padding:30px;background:#f9fafb;color:#6b7280;font-size:12px;text-align:center;border-top:1px solid #e5e7eb">
          <p style="margin:0 0 8px;font-weight:bold;color:#374151">ARCAMBE SIG & Soluções Ambientais, LDA.</p>
          <p style="margin:0 0 8px">Maputo, Moçambique</p>
          <p style="margin:0">Este e-mail foi gerado automaticamente.<br>Caso tenha alguma dúvida, contacte <a href="mailto:info@arcambe.com" style="color:#059669;text-decoration:none">info@arcambe.com</a></p>
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
