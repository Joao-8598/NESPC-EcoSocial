/**
 * ECO SOCIAL - SCRIPT UNIFICADO
 * 
 * Este script contém todas as funcionalidades necessárias para:
 * - Feed de postagens sustentáveis
 * - Chat com o EcoBot
 * - Sistema de ranking de bairros
 * - Menus responsivos (mobile e desktop)
 * - Mapa de localização
 * - Animações e interações
 */

// =============================================
// CONSTANTES E CONFIGURAÇÕES GLOBAIS
// =============================================

// Dados dos bairros (pode ser substituído por API real posteriormente)
const NEIGHBORHOODS_DATA = [
    { name: "Centro", points: 1850 },
    { name: "Jardim Igapó", points: 1420 },
    { name: "Vila Brasil", points: 1210 },
    { name: "Gleba Palhano", points: 980 },
    { name: "Conjunto Parigot", points: 870 },
    { name: "Jardim Maringá", points: 750 },
    { name: "Vila Casoni", points: 680 },
    { name: "Jardim Bandeirantes", points: 620 },
    { name: "Vila Recreio", points: 550 },
    { name: "Jardim Leonor", points: 480 }
];

// Respostas pré-definidas do EcoBot
const ECOBOT_RESPONSES = {
    "coleta": "🗓️ Coleta seletiva no Centro: Segundas e Quartas às 14h\nJardim Igapó: Terças e Quintas às 10h\nVila Brasil: Quartas e Sextas às 13h",
    "reciclar": "♻️ Para reciclar plástico:\n1. Lave as embalagens para remover resíduos\n2. Remova rótulos e tampas quando possível\n3. Separe por tipo (PET, PEAD, PVC, etc.)\n4. Leve ao ecoponto mais próximo",
    "dicas": "🌿 Dicas sustentáveis:\n1. Use ecobags em vez de sacolas plásticas\n2. Feche a torneira ao escovar os dentes\n3. Prefira transporte sustentável (bicicleta, caminhada)\n4. Separe seu lixo para reciclagem\n5. Conserte em vez de descartar",
    "óleo": "⚠️ Nunca descarte óleo na pia! Isso contamina a água.\nLeve seu óleo usado a um ecoponto. Em Londrina, você pode levar ao:\n- Ecoponto Centro: Rua São Paulo, 500\n- Ecoponto Vila Brasil: Av. Rio de Janeiro, 1200",
    "compostagem": "🥗 Para fazer compostagem:\n1. Separe resíduos orgânicos (cascas, folhas, restos de vegetais)\n2. Monte uma composteira com baldes ou caixas\n3. Intercale camadas de material úmido e seco\n4. Revire a cada 3 dias\nEm 2-3 meses terá adubo de qualidade!",
    "default": "Desculpe, não entendi. Tente perguntar sobre 'coleta', 'reciclagem', 'dicas sustentáveis' ou 'descarte de óleo'!"
};

// Configurações do Intersection Observer para animações
const OBSERVER_OPTIONS = {
    threshold: 0.1
};

// =============================================
// FUNÇÕES DE GERENCIAMENTO DE POSTAGENS
// =============================================

/**
 * Simula a criação de uma nova postagem sustentável
 */
function simulatePost() {
    const actionSelect = document.getElementById('action-type');
    const neighborhoodSelect = document.getElementById('neighborhood');
    const actionText = actionSelect.options[actionSelect.selectedIndex].text;
    const points = parseInt(actionSelect.value);
    const neighborhood = neighborhoodSelect.value;
    
    const userNames = ["Ana Silva", "Carlos Oliveira", "Mariana Costa", "Pedro Santos", "Juliana Pereira"];
    const randomUser = userNames[Math.floor(Math.random() * userNames.length)];
    
    const postHTML = `
        <div class="post">
            <div class="post-header">
                <div class="user-avatar">${randomUser.charAt(0)}</div>
                <div>
                    <div>${randomUser}</div>
                    <div style="font-size: 0.8rem; color: var(--accent1);">${neighborhood}</div>
                </div>
            </div>
            <div class="post-content">
                ${actionText}
            </div>
            <div class="post-footer">
                <div class="post-points">+${points} pontos</div>
                <button class="like-btn"><i class="fas fa-heart"></i></button>
            </div>
        </div>
    `;
    
    if(document.getElementById('feed-posts')) {
        document.getElementById('feed-posts').insertAdjacentHTML('afterbegin', postHTML);
    }
    
    // Atualiza o ranking do bairro
    const neighborhoodIndex = NEIGHBORHOODS_DATA.findIndex(n => n.name === neighborhood);
    if (neighborhoodIndex !== -1) {
        NEIGHBORHOODS_DATA[neighborhoodIndex].points += points;
        updateRanking();
    }
    
    // Feedback visual
    const btn = document.querySelector('.simulate-btn');
    if(btn) {
        btn.innerHTML = '<i class="fas fa-check"></i> Ação Registrada!';
        btn.style.background = 'linear-gradient(to right, var(--success), #66BB6A)';
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-bolt"></i> Registrar Ação!';
            btn.style.background = 'linear-gradient(to right, var(--primary), var(--secondary))';
        }, 2000);
    }
}

// =============================================
// FUNÇÕES DO ECOBOT (CHAT)
// =============================================

/**
 * Envia uma mensagem rápida pré-definida para o EcoBot
 * @param {string} text - Texto da mensagem rápida
 */
function sendQuickMessage(text) {
    if(document.getElementById('user-input')) {
        document.getElementById('user-input').value = text;
        sendUserMessage();
    }
}

/**
 * Processa e envia a mensagem do usuário para o EcoBot
 */
function sendUserMessage() {
    const input = document.getElementById('user-input');
    if(!input) return;
    
    const text = input.value.trim();
    if (text === '') return;
    
    const chatMessages = document.getElementById('chat-messages');
    
    // Adiciona mensagem do usuário
    chatMessages.innerHTML += `<div class="message user">${text}</div>`;
    
    // Processa a resposta
    let response = ECOBOT_RESPONSES.default;
    const lowerInput = text.toLowerCase();
    
    if (lowerInput.includes("coleta")) response = ECOBOT_RESPONSES.coleta;
    if (lowerInput.includes("recicla")) response = ECOBOT_RESPONSES.reciclar;
    if (lowerInput.includes("dica") || lowerInput.includes("sustentável")) response = ECOBOT_RESPONSES.dicas;
    if (lowerInput.includes("óleo")) response = ECOBOT_RESPONSES.óleo;
    if (lowerInput.includes("compostagem")) response = ECOBOT_RESPONSES.compostagem;
    
    // Adiciona resposta do bot após um pequeno delay
    setTimeout(() => {
        chatMessages.innerHTML += `<div class="message bot">${response}</div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 500);
    
    // Limpa o input
    input.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// =============================================
// FUNÇÕES DE RANKING
// =============================================

/**
 * Atualiza a lista de classificação dos bairros
 */
function updateRanking() {
    // Ordena bairros por pontos
    const sortedNeighborhoods = [...NEIGHBORHOODS_DATA].sort((a, b) => b.points - a.points);
    
    // Gera o HTML do ranking
    let rankingHTML = '';
    sortedNeighborhoods.forEach((neighborhood, index) => {
        rankingHTML += `
            <div class="rank-item ${index < 3 ? 'rank-' + (index+1) : ''}">
                <div class="rank-position">${index+1}</div>
                <div class="neighborhood-info">
                    <div class="neighborhood-name">${neighborhood.name}</div>
                    <div class="neighborhood-points">${neighborhood.points} pontos</div>
                </div>
            </div>
        `;
    });
    
    // Atualiza a página
    if (document.getElementById('neighborhood-rank')) {
        document.getElementById('neighborhood-rank').innerHTML = rankingHTML;
    }
    
    // Atualiza o gráfico se existir
    if (document.getElementById('ranking-chart')) {
        updateChart();
    }
}

/**
 * Atualiza o gráfico de ranking
 */
function updateChart() {
    const sortedNeighborhoods = [...NEIGHBORHOODS_DATA].sort((a, b) => b.points - a.points);
    const topNeighborhoods = sortedNeighborhoods.slice(0, 5);
    
    const ctx = document.getElementById('ranking-chart').getContext('2d');
    
    // Destrói o gráfico anterior se existir
    if (window.rankingChart) {
        window.rankingChart.destroy();
    }
    
    // Cria novo gráfico
    window.rankingChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topNeighborhoods.map(n => n.name),
            datasets: [{
                label: 'Pontos',
                data: topNeighborhoods.map(n => n.points),
                backgroundColor: [
                    'rgba(255, 193, 7, 0.7)',
                    'rgba(158, 158, 158, 0.7)',
                    'rgba(141, 110, 99, 0.7)',
                    'rgba(93, 115, 126, 0.7)',
                    'rgba(160, 193, 124, 0.7)'
                ],
                borderColor: [
                    'rgb(255, 193, 7)',
                    'rgb(158, 158, 158)',
                    'rgb(141, 110, 99)',
                    'rgb(93, 115, 126)',
                    'rgb(160, 193, 124)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Top 5 Bairros Sustentáveis',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}

// =============================================
// FUNÇÕES DE MENU E NAVEGAÇÃO
// =============================================

/**
 * Configura o menu hamburguer para mobile
 */
function setupMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    
    if (menuButton && menu) {
        menuButton.addEventListener('click', function() {
            menu.classList.toggle('hidden');
        });
    }
}

/**
 * Configura o menu dropdown para desktop
 */
function setupDesktopMenu() {
    const menuButton = document.getElementById('desktop-menu-button');
    const menu = document.getElementById('desktop-menu');
    
    if (menuButton && menu) {
        menuButton.addEventListener('click', function() {
            menu.classList.toggle('hidden');
        });
        
        // Fecha o menu ao clicar fora
        document.addEventListener('click', function(event) {
            if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
                menu.classList.add('hidden');
            }
        });
    }
}

/**
 * Configura a navegação suave para âncoras
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Fecha o menu mobile se estiver aberto
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
                
                // Rolagem suave
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =============================================
// FUNÇÕES DE ANIMAÇÃO E INTERAÇÃO
// =============================================

/**
 * Configura o Intersection Observer para animações
 */
function setupAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeIn');
                observer.unobserve(entry.target);
            }
        });
    }, OBSERVER_OPTIONS);

    // Observa elementos que devem ser animados
    document.querySelectorAll('.feature-card, .badge-icon, .post, .rank-item, .metric-card').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Configura o comportamento do EcoBot (avatar animado)
 */
let ecoLoopActive = true;

function ecoWelcomeLoop() {
    if (!ecoLoopActive) return;
    const avatar = document.getElementById('eco-avatar');
    if (!avatar) return;
    
    avatar.src = 'assets/Images/agente/1-sorrindo.png';
    setTimeout(() => {
        avatar.src = 'assets/Images/agente/2-piscando.png';
        setTimeout(() => {
            avatar.src = 'assets/Images/agente/1-sorrindo.png';
            setTimeout(ecoWelcomeLoop, 2000 + Math.random() * 1000);
        }, 300 + Math.random() * 300);
    }, 1000 + Math.random() * 1000);
}

function ecoWelcomeAndChat() {
    ecoLoopActive = true;
    ecoWelcomeLoop();
    
    // Após 4s, inicia a conversa
    setTimeout(() => {
        ecoLoopActive = false;
        ecoAskQuestion();
    }, 4000);
}

function ecoAskQuestion() {
    const avatar = document.getElementById('eco-avatar');
    const chatMessages = document.getElementById('chat-messages');
    if (!avatar || !chatMessages) return;
    
    const perguntas = [
        'Você sabia que separar resíduos orgânicos pode reduzir em até 50% o lixo enviado aos aterros? Como você faz a separação na sua casa?',
        'Qual ação sustentável você acha mais fácil de adotar no seu bairro: compostagem, reciclagem ou economia de água?',
        'Se pudesse propor um desafio ecológico para sua comunidade, qual seria?',
        'Como as hortas comunitárias podem ajudar a melhorar a qualidade de vida no seu bairro?',
        'Você já participou de alguma ação de coleta de lixo eletrônico? Conte como foi!'
    ];
    
    const pergunta = perguntas[Math.floor(Math.random() * perguntas.length)];
    chatMessages.innerHTML += `<div class="message bot">${pergunta}</div>`;
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    setTimeout(() => {
        ecoThinking();
    }, 1000);
}

function ecoThinking() {
    const avatar = document.getElementById('eco-avatar');
    const chatMessages = document.getElementById('chat-messages');
    if (!avatar || !chatMessages) return;
    
    avatar.src = 'assets/Images/agente/3-pensando.png';
    
    let dots = 0;
    const thinkingDiv = document.createElement('div');
    thinkingDiv.className = 'message bot thinking';
    chatMessages.appendChild(thinkingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    const interval = setInterval(() => {
        dots = (dots + 1) % 4;
        thinkingDiv.textContent = '...'.substring(0, dots);
    }, 500);
    
    setTimeout(() => {
        clearInterval(interval);
        thinkingDiv.remove();
        ecoAnswer();
    }, 3000);
}

function ecoAnswer() {
    const avatar = document.getElementById('eco-avatar');
    const chatMessages = document.getElementById('chat-messages');
    if (!avatar || !chatMessages) return;
    
    const resposta = 'Ótima pergunta! Adotar pequenas ações, como separar resíduos e incentivar vizinhos, faz toda a diferença. Que tal começar hoje mesmo?';
    let i = 0;
    let talking = true;
    const answerDiv = document.createElement('div');
    answerDiv.className = 'message bot';
    chatMessages.appendChild(answerDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    let lastSwitch = Date.now();
    
    function typeChar() {
        if (i < resposta.length) {
            answerDiv.textContent += resposta[i];
            if (resposta[i] !== ' ') {
                if (Date.now() - lastSwitch > 90) {
                    avatar.src = talking ? 'assets/Images/agente/4-falando1.png' : 'assets/Images/agente/5-falando2.png';
                    talking = !talking;
                    lastSwitch = Date.now();
                }
            }
            chatMessages.scrollTop = chatMessages.scrollHeight;
            setTimeout(typeChar, 30);
            i++;
        } else {
            avatar.src = 'assets/Images/agente/1-sorrindo.png';
            ecoLoopActive = true;
            setTimeout(ecoWelcomeLoop, 1000);
        }
    }
    
    typeChar();
}

// =============================================
// INICIALIZAÇÃO DA PÁGINA
// =============================================

/**
 * Inicializa todas as funcionalidades da página
 */
function initPage() {
    // Configura menus
    setupMobileMenu();
    setupDesktopMenu();
    setupSmoothScrolling();
    
    // Configura animações
    setupAnimations();
    
    // Configura o EcoBot se estiver na página correta
    if (document.getElementById('eco-avatar')) {
        ecoWelcomeAndChat();
    }
    
    // Configura o envio de mensagens com Enter
    const userInput = document.getElementById('user-input');
    if (userInput) {
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendUserMessage();
            }
        });
    }
    
    // Atualiza o ranking se estiver na página correta
    if (document.getElementById('neighborhood-rank')) {
        updateRanking();
    }
    
    // Configura o formulário de contato
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Obrigado pelo seu contato! Responderemos em breve.');
            this.reset();
        });
    }
}

// Inicializa a página quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initPage);