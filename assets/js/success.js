
document.addEventListener("DOMContentLoaded", function() {
    if (window.location.search.includes("success=true")) {
        // Create modal
        const modalHtml = `
        <div id="success-modal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 opacity-0 transition-opacity duration-500">
            <div class="bg-white rounded-[2rem] p-8 md:p-12 max-w-sm w-full text-center shadow-2xl transform scale-95 transition-all duration-500 relative border border-gray-100">
                <div class="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <i class="fa-solid fa-check text-4xl text-green-500"></i>
                </div>
                <h2 class="text-3xl font-black text-gray-900 mb-3 tracking-tight">Sucesso!</h2>
                <p class="text-gray-500 mb-8 text-sm leading-relaxed">A sua solicitação foi recebida. Entraremos em contacto muito em breve.</p>
                <button onclick="document.getElementById('success-modal').classList.add('opacity-0'); setTimeout(()=>document.getElementById('success-modal').remove(), 500)" class="w-full bg-[#059669] hover:bg-[#047857] text-white py-4 rounded-2xl font-bold uppercase tracking-widest shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    Continuar
                </button>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Animate in
        setTimeout(() => {
            const modal = document.getElementById('success-modal');
            if (modal) {
                modal.classList.remove('opacity-0');
                modal.children[0].classList.remove('scale-95');
                modal.children[0].classList.add('scale-100');
            }
        }, 50);
        
        // Remove query param from URL without refreshing
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
});
