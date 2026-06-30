<?php 
  require_once('auth.php'); 
  verificarAcesso(); 
?>

<!DOCTYPE html>
<html lang="pt-pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SALA PRO | ARCAMBE SIG</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        heading: ['Outfit', 'sans-serif'],
                    },
                    colors: { 
                        arcambeVerde: '#1b7a5d', 
                        arcambeEscuro: '#0a3628', 
                        arcambeClaro: '#2ecc71' 
                    }
                }
            }
        }
    </script>
    <style>
        .video-container { position: relative; pb: 56.25%; height: 0; overflow: hidden; }
        .video-container iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #1b7a5d; border-radius: 10px; }
    </style>
</head>
<body class="bg-gray-100 font-sans overflow-hidden">
    <script>
    // Se quiseres uma proteção extra rápida, podes pedir uma senha ao carregar a página
    const acesso = prompt("Introduza o Código de Acesso à Aula:");
    if (acesso !== "ARCAMBE2026") { // Tu defines a senha aqui
        alert("Código incorreto. Contacte o suporte.");
        window.location.href = "index.html";
    }
</script>

    <nav class="bg-gradient-to-r from-gray-950 via-[#0a1a14] to-gray-900 h-[60px] px-6 flex justify-between items-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative z-50 border-b border-white/10">
        <div class="flex items-center gap-3 group">
            <div class="w-8 h-8 bg-arcambeVerde rounded flex items-center justify-center font-heading font-black text-white shadow-lg group-hover:scale-105 transition-transform">A</div>
            <span class="text-white font-heading font-bold uppercase text-xs tracking-[0.2em]">Painel do Aluno | <span class="text-arcambeClaro">ARCAMBE</span></span>
        </div>
        <div class="hidden md:flex items-center gap-6 text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em] italic">
            Sessão em Direto: <span class="text-white font-black">Formação Avançada SIG</span>
        </div>
        <a href="index.html" class="bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all duration-300 border border-red-600/30">
            Sair da Sala
        </a>
    </nav>

    <div class="flex h-[calc(100vh-60px)] flex-col md:flex-row">
        
        <main class="flex-1 bg-black flex flex-col relative">
            
            <div class="w-full aspect-video bg-black shadow-2xl">
                <iframe 
                    src="https://www.youtube.com/embed/ID_DA_SUA_LIVE?autoplay=1&rel=0" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen 
                    class="w-full h-full">
                </iframe>
            </div>

            <div class="flex-1 bg-[#121212] border-t border-white/10 relative">
                <div class="absolute inset-0 p-4">
                    <h4 class="text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">Chat em Tempo Real</h4>
                    <iframe 
                        src="https://www.youtube.com/live_chat?v=ID_DA_SUA_LIVE&embed_domain=127.0.0.1" 
                        class="w-full h-[calc(100%-20px)] rounded-lg">
                    </iframe>
                </div>
            </div>
        </main>

        <aside class="w-full md:w-[350px] bg-white border-l border-gray-200 flex flex-col shadow-inner">
            
            <div class="p-6 overflow-y-auto flex-1 space-y-8">
                
                <section>
                    <h3 class="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 flex items-center gap-2">
                        <i class="fa-solid fa-file-arrow-down text-arcambeVerde text-sm"></i> Recursos da Aula
                    </h3>
                    <div class="space-y-3">
                        <a href="materiais/guia_sig.pdf" target="_blank" class="flex items-center p-3 bg-gray-50 border border-gray-100 rounded-xl hover:border-arcambeVerde hover:shadow-md transition group">
                            <i class="fa-solid fa-file-pdf text-red-500 text-xl mr-3 transition-transform group-hover:scale-110"></i>
                            <div>
                                <p class="text-[11px] font-bold text-gray-800 leading-none">Guia Prático QGIS</p>
                                <span class="text-[9px] text-gray-400 font-medium">PDF • 5.8 MB</span>
                            </div>
                        </a>

                        <a href="materiais/script_gee.txt" download class="flex items-center p-3 bg-gray-50 border border-gray-100 rounded-xl hover:border-arcambeVerde hover:shadow-md transition group">
                            <i class="fa-solid fa-code text-blue-500 text-xl mr-3 transition-transform group-hover:scale-110"></i>
                            <div>
                                <p class="text-[11px] font-bold text-gray-800 leading-none">Script GEE - NDVI</p>
                                <span class="text-[9px] text-gray-400 font-medium">Javascript • 15 KB</span>
                            </div>
                        </a>
                    </div>
                </section>

                <section class="bg-arcambeVerde/5 p-5 rounded-2xl border border-arcambeVerde/10">
                    <h4 class="text-[10px] font-black uppercase text-arcambeVerde mb-2">Dúvida Urgente?</h4>
                    <p class="text-[10px] text-gray-600 leading-relaxed mb-4">Se tiver problemas com a conexão ou com o código, chame o instrutor no WhatsApp.</p>
                    <a href="https://wa.me/258844172237" target="_blank" class="w-full py-3 bg-arcambeVerde text-white rounded-xl text-[9px] font-black uppercase block text-center shadow-lg hover:bg-arcambeEscuro transition-all">
                        <i class="fa-brands fa-whatsapp mr-2 text-sm"></i> Falar com Suporte
                    </a>
                </section>

                <div class="pt-6 border-t border-gray-100">
                    <div class="flex items-center gap-4">
                        <img src="Francisco.png" class="w-10 h-10 rounded-full object-cover border-2 border-arcambeVerde" alt="Instrutor">
                        <div>
                            <p class="text-[10px] font-black text-gray-800 uppercase leading-none">Francisco Manguene</p>
                            <span class="text-[9px] text-gray-400 font-bold uppercase">Especialista SIG</span>
                        </div>
                    </div>
                </div>

            </div>

            <div class="p-4 bg-gray-50 border-t border-gray-100 text-center">
                <p class="text-[9px] font-bold text-gray-300 uppercase tracking-widest italic">© 2026 ARCAMBE Mozambique</p>
            </div>
        </aside>
    </div>

</body>
</html>