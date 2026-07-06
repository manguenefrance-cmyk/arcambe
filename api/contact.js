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
      ["Servico", body.service],
      ["Localizacao", body.location],
      ["Origem", body.source],
      ["Mensagem", message]
    ].filter(([, value]) => value).map(([label, value]) => `<p><strong>${label}:</strong><br>${escapeHtml(value)}</p>`).join("");

    const transporter = createTransport();
    await transporter.sendMail({
      from: brandFrom(),
      to: salesInbox(),
      replyTo: email,
      subject: `Novo pedido de orcamento - ${name}`,
      html: emailLayout("Novo pedido de orcamento", details),
      text: `Novo pedido de orcamento\n\nNome: ${name}\nE-mail: ${email}\nServico: ${body.service || ""}\nTelefone: ${body.phone || ""}\nEmpresa: ${body.company || ""}\nLocalizacao: ${body.location || ""}\nOrigem: ${body.source || ""}\n\n${message}`
    });

    await transporter.sendMail({
      from: brandFrom(),
      to: email,
      replyTo: salesInbox(),
      subject: "Recebemos o seu pedido | ARCAMBE",
      html: emailLayout(
        "Recebemos o seu pedido",
        `<p>Ola ${escapeHtml(name)},</p><p>Obrigado por contactar a ARCAMBE. A sua solicitacao foi recebida com sucesso e sera analisada pela nossa equipa tecnica.</p><p>Responderemos com os proximos passos assim que avaliarmos o escopo, a localizacao e os requisitos do projecto.</p><p style="margin-top:22px"><strong>Resumo recebido:</strong><br>${escapeHtml(body.service || "Servico ARCAMBE")}<br>${escapeHtml(message)}</p>`
      ),
      text: `Ola ${name},\n\nObrigado por contactar a ARCAMBE. Recebemos o seu pedido e a nossa equipa tecnica vai responder com os proximos passos.\n\nResumo: ${body.service || "Servico ARCAMBE"}\n${message}`
    });

    return json(res, 200, { ok: true });
  } catch (error) {
    console.error(error);
    return json(res, 500, { ok: false, error: "Email delivery failed" });
  }
};
