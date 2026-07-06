<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Dados do formulário de Inscrição
    $nome = strip_tags(trim($_POST["nome"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $whatsapp = strip_tags(trim($_POST["whatsapp"]));
    $instituicao = strip_tags(trim($_POST["instituicao"]));
    $pagamento = strip_tags(trim($_POST["pagamento"]));

    // 2. Configuração do E-mail de destino (Formação)
    $destinatario = "formacao@arcambe.com"; 
    $assunto = "NOVA INSCRIÇÃO DE CURSO: " . $nome;

    // 3. Montagem do corpo da mensagem
    $corpo = "--- NOVA INSCRIÇÃO NO CURSO GEE ---\n\n";
    $corpo .= "Nome do Aluno: $nome\n";
    $corpo .= "E-mail: $email\n";
    $corpo .= "WhatsApp: $whatsapp\n";
    $corpo .= "Instituição: $instituicao\n";
    $corpo .= "Método de Pagamento Escolhido: $pagamento\n\n";
    $corpo .= "--- Fim da Mensagem ---";

    // 4. Cabeçalhos do e-mail
    $headers = "From: site@arcambe.com" . "\r\n" .
               "Reply-To: $email" . "\r\n" .
               "X-Mailer: PHP/" . phpversion();

    // 5. Enviar e redirecionar
    if (mail($destinatario, $assunto, $corpo, $headers)) {
        header("Location: index.html?status=sucesso");
    } else {
        echo "Erro ao enviar a inscrição. Por favor, tente novamente ou contacte-nos pelo WhatsApp.";
    }
} else {
    header("Location: inscricao.html");
}
?>
