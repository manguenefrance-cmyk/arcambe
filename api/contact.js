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

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();
    if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json(res, 400, { ok: false, error: "Invalid request" });
    }

    const details = [
      ["Nome", name],
      ["E-mail", email],
      ["Telefone", body.phone],
      ["Empresa", body.company],
      ["Serviço", body.service],
      ["Localização", body.location],
      ["Origem", body.source],
      ["Mensagem", message]
    ].filter(([, value]) => value).map(([label, value]) => `<p><strong>${label}:</strong><br>${escapeHtml(value)}</p>`).join("");

    const transporter = createTransport();
    await transporter.sendMail({
      from: brandFrom(),
      to: salesInbox(),
      replyTo: email,
      subject: `Novo pedido de orçamento - ${name}`,
      html: emailLayout(
        "Novo pedido de orçamento", 
        details,
        "Recebemos uma nova solicitação através do website."
      ),
      text: `Novo pedido de orçamento\n\nNome: ${name}\nE-mail: ${email}\nServiço: ${body.service || ""}\nTelefone: ${body.phone || ""}\nEmpresa: ${body.company || ""}\nLocalização: ${body.location || ""}\nOrigem: ${body.source || ""}\n\n${message}`
    });

    await transporter.sendMail({
      from: brandFrom(),
      to: email,
      replyTo: salesInbox(),
      subject: "Recebemos o seu pedido | ARCAMBE",
      html: emailLayout(
        `Olá ${escapeHtml(name)},<br>Obrigado pelo seu contacto.`,
        `<p style="margin-top:0">A sua solicitação foi recebida com sucesso e será analisada pela nossa equipa técnica.</p><p>Responderemos com os próximos passos assim que avaliarmos o escopo, a localização e os requisitos do projecto.</p><div style="margin-top:30px;padding:20px;background:#f3f4f6;border-radius:8px"><h3 style="margin:0 0 10px;font-size:14px;color:#102019">Resumo do Pedido:</h3><p style="margin:0;font-size:13px"><strong>Serviço:</strong> ${escapeHtml(body.service || "Serviço ARCAMBE")}<br><strong>Mensagem:</strong> ${escapeHtml(message)}</p></div><br><p style="margin:0">Com os melhores cumprimentos,<br><strong>A Equipa ARCAMBE</strong></p>`,
        "Estamos a analisar o seu pedido e entraremos em contacto em breve."
      ),
      text: `Olá ${name},\n\nObrigado por contactar a ARCAMBE. Recebemos o seu pedido e a nossa equipa técnica vai responder com os próximos passos.\n\nResumo: ${body.service || "Serviço ARCAMBE"}\n${message}`
    });

    res.writeHead(302, { Location: req.headers.referer || '/' });
    res.end();
    return;
  } catch (error) {
    console.error(error);
    return json(res, 500, { ok: false, error: "Email delivery failed" });
  }
};
