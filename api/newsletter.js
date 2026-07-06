const {
  createTransport,
  brandFrom,
  salesInbox,
  json,
  readBody,
  escapeHtml,
  emailLayout
} = require("./lib/mail");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Method not allowed" });

  try {
    const body = await readBody(req);
    if (body.website) return json(res, 200, { ok: true });

    const email = String(body.email || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json(res, 400, { ok: false, error: "Invalid email" });
    }

    const transporter = createTransport();
    await transporter.sendMail({
      from: brandFrom(),
      to: salesInbox(),
      replyTo: email,
      subject: "Nova subscrição da newsletter ARCAMBE",
      html: emailLayout(
        "Nova subscrição da newsletter", 
        `<p><strong>E-mail:</strong><br>${escapeHtml(email)}</p>`,
        "Um novo utilizador subscreveu a newsletter."
      ),
      text: `Nova subscrição da newsletter ARCAMBE\n\nE-mail: ${email}`
    });

    await transporter.sendMail({
      from: brandFrom(),
      to: email,
      replyTo: salesInbox(),
      subject: "Bem-vindo à ARCAMBE! | Subscrição confirmada",
      html: emailLayout(
        "Bem-vindo à ARCAMBE!",
        `<p style="margin-top:0;font-size:16px">Olá,</p><p>Muito obrigado por subscrever a newsletter da ARCAMBE.</p><p>A partir de agora poderemos partilhar notas técnicas, novidades de cursos e oportunidades ligadas a SIG, licenciamento ambiental e sustentabilidade directamente na sua caixa de entrada.</p><br><p style="margin:0">Com os melhores cumprimentos,<br><strong>A Equipa ARCAMBE</strong></p>`,
        "A sua subscrição foi confirmada com sucesso."
      ),
      text: "Olá! Obrigado por subscrever a newsletter da ARCAMBE. Vamos partilhar notas técnicas, novidades de cursos e oportunidades."
    });

    res.writeHead(302, { Location: req.headers.referer || '/' });
    res.end();
    return;
  } catch (error) {
    console.error(error);
    return json(res, 500, { ok: false, error: "Email delivery failed" });
  }
};
