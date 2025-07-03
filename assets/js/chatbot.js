// Mobile menu toggle
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});

// Chat functions
function sendUserMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (message) {
        addMessage(message, 'user');
        userInput.value = '';
        
        // Simulate bot response after a short delay
        setTimeout(() => {
            const botResponses = [
                "Ótima pergunta! A coleta seletiva no centro acontece às terças e quintas-feiras.",
                "Plásticos devem ser lavados e separados por tipo antes da reciclagem. Posso te enviar um guia completo?",
                "Aqui estão 3 dicas sustentáveis para hoje: 1) Use uma garrafa reutilizável, 2) Desligue luzes não utilizadas, 3) Opte por transporte público ou bicicleta.",
                "Você pode descartar óleo de cozinha usado em ecopontos específicos. Há um na Rua Verde, nº 123, próximo ao mercado."
            ];
            
            const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
            addMessage(randomResponse, 'bot');
        }, 1000);
    }
}

function sendQuickMessage(message) {
    document.getElementById('user-input').value = message;
    sendUserMessage();
}

function addMessage(text, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.classList.add('animate-fadeIn');
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Allow sending message with Enter key
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendUserMessage();
    }
});

// Animate elements when they come into view
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .badge-icon').forEach(el => {
    observer.observe(el);
});