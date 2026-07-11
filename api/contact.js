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

    const name = String(body.name || body.cliente || body.nome_completo || body.nome || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || body.detalhes || body.mensagem || "Nova submissão").trim();
    
    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json(res, 400, { ok: false, error: "Invalid request" });
    }

    const details = [
      ["Nome/Empresa", name],
      ["E-mail", email],
      ["Telefone/WhatsApp", body.phone || body.whatsapp || body.telefone],
      ["Serviço/Curso", body.service || body.curso],
      ["Localização", body.location || body.localizacao],
      ["Instituição", body.instituicao],
      ["Pagamento", body.pagamento],
      ["Mensagem/Detalhes", message !== "Nova submissão" ? message : null]
    ].filter(([, value]) => value).map(([label, value]) => `<p><strong>${label}:</strong><br>${escapeHtml(value)}</p>`).join("");

    const transporter = createTransport();
    await transporter.sendMail({
      from: brandFrom(),
      to: salesInbox(),
      replyTo: email,
      subject: `Novo pedido/inscrição - ${name}`,
      html: emailLayout(
        "Novo pedido / inscrição", 
        details,
        "Recebemos uma nova solicitação através do website."
      ),
      text: `Novo pedido/inscrição\n\nNome: ${name}\nE-mail: ${email}\nDetalhes:\n${message}`
    });

    let autoReplyTitle = `Olá ${escapeHtml(name)},<br>Obrigado pelo seu contacto.`;
    let autoReplySubtitle = "Estamos a analisar o seu pedido e entraremos em contacto em breve.";
    let autoReplyBodyHtml = `<p style="margin-top:0">A sua solicitação foi recebida com sucesso e será analisada pela nossa equipa.</p><p>Responderemos com os próximos passos assim que avaliarmos os detalhes do seu contacto.</p>`;
    let autoReplyBodyText = `Olá ${name},\n\nObrigado por contactar a ARCAMBE. Recebemos o seu pedido e a nossa equipa vai responder com os próximos passos.\n\n`;

    const isCurso = body.curso || (body.service && body.service.toLowerCase().includes("inscriç"));
    const nomeCurso = body.curso || (body.service ? body.service.replace(/inscrição:\s*/i, '') : '');

    if (isCurso) {
      autoReplyTitle = `Parabéns pela inscrição, ${escapeHtml(name)}!`;
      autoReplySubtitle = `A sua inscrição no curso ${escapeHtml(nomeCurso)} foi recebida.`;
      autoReplyBodyHtml = `<p style="margin-top:0">Muito obrigado por escolher a ARCAMBE para a sua formação profissional.</p><p>A sua vaga está pré-reservada. A nossa equipa de formação entrará em contacto nas próximas 24 a 48 horas úteis com os detalhes de pagamento e para finalização da sua inscrição.</p>`;
      autoReplyBodyText = `Olá ${name},\n\nMuito obrigado por escolher a ARCAMBE para a sua formação profissional. A sua inscrição no curso ${nomeCurso} foi recebida e a vaga está pré-reservada. A nossa equipa entrará em contacto nas próximas 24 a 48 horas úteis com os detalhes.\n\n`;
    } else if (body.service) {
      autoReplyTitle = `Olá ${escapeHtml(name)},<br>Obrigado pelo pedido.`;
      autoReplySubtitle = `O seu pedido para ${escapeHtml(body.service)} está sob análise.`;
      autoReplyBodyHtml = `<p style="margin-top:0">Agradecemos o seu interesse nos serviços da ARCAMBE.</p><p>A nossa equipa técnica já recebeu o seu pedido e está a analisar os requisitos. Entraremos em contacto brevemente com mais informações ou uma proposta técnico-comercial.</p>`;
      autoReplyBodyText = `Olá ${name},\n\nObrigado por contactar a ARCAMBE. O seu pedido para ${body.service} foi recebido e a nossa equipa técnica vai responder com os próximos passos em breve.\n\n`;
    }

    const summaryHtml = `<div style="margin-top:30px;padding:20px;background:#f3f4f6;border-radius:8px"><h3 style="margin:0 0 10px;font-size:14px;color:#102019">Resumo do Pedido:</h3><p style="margin:0;font-size:13px"><strong>Serviço/Curso:</strong> ${escapeHtml(body.service || body.curso || "Contacto Geral")}<br><strong>Mensagem:</strong> ${escapeHtml(message)}</p></div><br><p style="margin:0">Com os melhores cumprimentos,<br><strong>A Equipa ARCAMBE</strong></p>`;
    const summaryText = `Resumo:\nServiço/Curso: ${body.service || body.curso || "Contacto Geral"}\nMensagem: ${message}`;

    await transporter.sendMail({
      from: brandFrom(),
      to: email,
      replyTo: salesInbox(),
      subject: isCurso ? `Confirmação de Inscrição | ARCAMBE` : "Recebemos o seu pedido | ARCAMBE",
      html: emailLayout(autoReplyTitle, autoReplyBodyHtml + summaryHtml, autoReplySubtitle),
      text: autoReplyBodyText + summaryText
    });

    const referer = req.headers.referer || '/';
    const baseUrl = referer.split('?')[0];
    res.writeHead(302, { Location: baseUrl + '?success=true' });
    res.end();
    return;
  } catch (error) {
    console.error(error);
    return json(res, 500, { ok: false, error: "Email delivery failed" });
  }
};
