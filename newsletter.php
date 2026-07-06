<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email_assinante = filter_var(trim($_POST["email_newsletter"]), FILTER_SANITIZE_EMAIL);

    if (filter_var($email_assinante, FILTER_VALIDATE_EMAIL)) {
        $destinatario = "info@arcambe.com"; // O teu e-mail da ARCAMBE
        $assunto = "NOVA ASSINATURA DE NEWSLETTER - SITE";
        
        $corpo = "Tens um novo interessado nos serviços da ARCAMBE!\n\n";
        $corpo .= "E-mail do Assinante: " . $email_assinante . "\n\n";
        $corpo .= "Data: " . date("d/m/Y H:i:s") . "\n";
        
        $headers = "From: site@arcambe.com" . "\r\n" .
                   "Reply-To: " . $email_assinante . "\r\n" .
                   "X-Mailer: PHP/" . phpversion();

        if (mail($destinatario, $assunto, $corpo, $headers)) {
            // Redireciona de volta com mensagem de sucesso
            header("Location: index.html?newsletter=sucesso#newsletter");
        } else {
            echo "Erro ao processar. Tente novamente.";
        }
    } else {
        echo "E-mail inválido.";
    }
}
?>