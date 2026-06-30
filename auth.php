<?php
session_start();
// Configuração da Base de Dados
$host = "localhost";
$db   = "arcambe_plataforma";
$user = "teu_usuario";
$pass = "tua_senha";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) { die("Erro de conexão."); }

// Função para verificar se o aluno está autorizado
function verificarAcesso() {
    if (!isset($_SESSION['aluno_id'])) {
        header("Location: login.html");
        exit();
    }
    
    // Verifica se o Token da sessão ainda é o mesmo na DB (evita logins duplos)
    global $conn;
    $id = $_SESSION['aluno_id'];
    $token_atual = session_id();
    
    $query = "SELECT session_token FROM alunos WHERE id = '$id'";
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    
    if ($row['session_token'] !== $token_atual) {
        session_destroy();
        header("Location: login.html?erro=sessao_dupla");
        exit();
    }
}
?>