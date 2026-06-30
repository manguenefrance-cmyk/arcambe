<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Dados do formulário
    $nome = strip_tags(trim($_POST["cliente"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $servico = $_POST["servico"];
    $detalhes = strip_tags(trim($_POST["detalhes"]));

    // 2. Configuração do E-mail de destino (O TEU E-MAIL)
    $destinatario = "comercial@arcambe.com"; // OU f.manguene@arcambe.com
    $assunto = "NOVA SOLICITAÇÃO DE ORÇAMENTO: " . strtoupper($servico);

    // 3. Montagem do corpo da mensagem
    $corpo = "--- NOVO PEDIDO DE ORÇAMENTO (SITE ARCAMBE) ---\n\n";
    $corpo .= "Nome/Empresa: $nome\n";
    $corpo .= "E-mail: $email\n";
    $corpo .= "Serviço solicitado: $servico\n\n";
    $corpo .= "Detalhes do Projeto:\n$detalhes\n\n";
    $corpo .= "--- Fim da Mensagem ---";

    // 4. Cabeçalhos do e-mail
    $headers = "From: site@arcambe.com" . "\r\n" .
               "Reply-To: $email" . "\r\n" .
               "X-Mailer: PHP/" . phpversion();

    // 5. Enviar e redirecionar
    if (mail($destinatario, $assunto, $corpo, $headers)) {
        // Redireciona para uma página de sucesso (podes criar uma ou voltar ao index)
        header("Location: index.html?status=sucesso");
    } else {
        echo "Erro ao enviar. Por favor, tente novamente ou use o WhatsApp.";
    }
}
?>