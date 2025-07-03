// Dados fictícios para os bairros de Londrina
const neighborhoods = [
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

// Simulação de postagens
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
    
    // Atualizar ranking (simulação)
    const neighborhoodIndex = neighborhoods.findIndex(n => n.name === neighborhood);
    if (neighborhoodIndex !== -1) {
        neighborhoods[neighborhoodIndex].points += points;
        if (typeof updateRanking === 'function') updateRanking();
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

// Funções do 
const responses = {
    "coleta": "🗓️ Coleta seletiva no Centro: Segundas e Quartas às 14h\nJardim Igapó: Terças e Quintas às 10h\nVila Brasil: Quartas e Sextas às 13h",
    "reciclar": "♻️ Para reciclar plástico:\n1. Lave as embalagens para remover resíduos\n2. Remova rótulos e tampas quando possível\n3. Separe por tipo (PET, PEAD, PVC, etc.)\n4. Leve ao ecoponto mais próximo",
    "dicas": "🌿 Dicas sustentáveis:\n1. Use ecobags em vez de sacolas plásticas\n2. Feche a torneira ao escovar os dentes\n3. Prefira transporte sustentável (bicicleta, caminhada)\n4. Separe seu lixo para reciclagem\n5. Conserte em vez de descartar",
    "óleo": "⚠️ Nunca descarte óleo na pia! Isso contamina a água.\nLeve seu óleo usado a um ecoponto. Em Londrina, você pode levar ao:\n- Ecoponto Centro: Rua São Paulo, 500\n- Ecoponto Vila Brasil: Av. Rio de Janeiro, 1200",
    "compostagem": "🥗 Para fazer compostagem:\n1. Separe resíduos orgânicos (cascas, folhas, restos de vegetais)\n2. Monte uma composteira com baldes ou caixas\n3. Intercale camadas de material úmido e seco\n4. Revire a cada 3 dias\nEm 2-3 meses terá adubo de qualidade!",
    "default": "Desculpe, não entendi. Tente perguntar sobre 'coleta', 'reciclagem', 'dicas sustentáveis' ou 'descarte de óleo'!"
};

function sendQuickMessage(text) {
    if(document.getElementById('user-input')) {
        document.getElementById('user-input').value = text;
        sendUserMessage();
    }
}

function sendUserMessage() {
    const input = document.getElementById('user-input');
    if(!input) return;
    
    const text = input.value.trim();
    if (text === '') return;
    
    const chatMessages = document.getElementById('chat-messages');
    
    // Adicionar mensagem do usuário
    chatMessages.innerHTML += `<div class="message user">${text}</div>`;
    
    // Processar resposta
    let response = responses.default;
    const lowerInput = text.toLowerCase();
    
    if (lowerInput.includes("coleta")) response = responses.coleta;
    if (lowerInput.includes("recicla")) response = responses.reciclar;
    if (lowerInput.includes("dica") || lowerInput.includes("sustentável")) response = responses.dicas;
    if (lowerInput.includes("óleo")) response = responses.óleo;
    if (lowerInput.includes("compostagem")) response = responses.compostagem;
    
    // Adicionar resposta do bot
    setTimeout(() => {
        chatMessages.innerHTML += `<div class="message bot">${response}</div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 500);
    
    // Limpar input
    input.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Permitir enviar com Enter
if (document.getElementById('user-input')) {
    document.getElementById('user-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendUserMessage();
        }
    });
}

// Atualizar ranking
function updateRanking() {
    // Ordenar bairros por pontos
    const sortedNeighborhoods = [...neighborhoods].sort((a, b) => b.points - a.points);
    
    // Atualizar lista de classificação
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
    
    if (document.getElementById('neighborhood-rank')) {
        document.getElementById('neighborhood-rank').innerHTML = rankingHTML;
    }
    
    // Atualizar gráfico
    if (document.getElementById('ranking-chart')) {
        updateChart();
    }
}

// Atualizar gráfico de ranking
function updateChart() {
    const sortedNeighborhoods = [...neighborhoods].sort((a, b) => b.points - a.points);
    const topNeighborhoods = sortedNeighborhoods.slice(0, 5);
    
    const ctx = document.getElementById('ranking-chart').getContext('2d');
    
    if (window.rankingChart) {
        window.rankingChart.destroy();
    }
    
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

// Inicializar a página
function init() {
    // Adicionar funcionalidade de curtir
    document.addEventListener('click', function(e) {
        if (e.target.closest('.like-btn')) {
            const btn = e.target.closest('.like-btn');
            if (btn.innerHTML.includes('fas fa-heart')) {
                btn.innerHTML = '<i class="fas fa-heart" style="color: var(--accent2);"></i>';
            } else {
                btn.innerHTML = '<i class="fas fa-heart"></i>';
            }
        }
    });
    
    // Inicializar funcionalidades específicas de cada página
    if (document.getElementById('feed-posts')) {
        // Gerar algumas postagens iniciais
        const initialPosts = [
            { user: "Mariana Costa", neighborhood: "Centro", action: "♻️ Reciclagem (1kg = 10 pontos)", points: 10 },
            { user: "Pedro Santos", neighborhood: "Jardim Igapó", action: "🚲 Transporte sustentável (5km = 15 pontos)", points: 15 },
            { user: "Ana Silva", neighborhood: "Vila Brasil", action: "🌳 Plantio de árvore (1 árvore = 50 pontos)", points: 50 }
        ];
        
        initialPosts.forEach(post => {
            document.getElementById('feed-posts').innerHTML += `
                <div class="post">
                    <div class="post-header">
                        <div class="user-avatar">${post.user.charAt(0)}</div>
                        <div>
                            <div>${post.user}</div>
                            <div style="font-size: 0.8rem; color: var(--accent1);">${post.neighborhood}</div>
                        </div>
                    </div>
                    <div class="post-content">
                        ${post.action}
                    </div>
                    <div class="post-footer">
                        <div class="post-points">+${post.points} pontos</div>
                        <button class="like-btn"><i class="fas fa-heart"></i></button>
                    </div>
                </div>
            `;
        });
    }
    
    if (document.getElementById('neighborhood-rank')) {
        updateRanking();
    }
}

// Inicializar quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', init);

// Menu hambúrguer responsivo
function setupHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.fake-menu');
    if (hamburger && menu) {
        hamburger.addEventListener('click', function() {
            menu.classList.toggle('open');
        });
        // Fecha o menu ao clicar fora
        document.addEventListener('click', function(e) {
            if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
                menu.classList.remove('open');
            }
        });
    }
}

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
    // Pergunta de complexidade média
    const perguntas = [
        'Você sabia que separar resíduos orgânicos pode reduzir em até 50% o lixo enviado aos aterros? Como você faz a separação na sua casa?',
        'Qual ação sustentável você acha mais fácil de adotar no seu bairro: compostagem, reciclagem ou economia de água?',
        'Se pudesse propor um desafio ecológico para sua comunidade, qual seria?',
        'Como as hortas comunitárias podem ajudar a melhorar a qualidade de vida no seu bairro?',
        'Você já participou de alguma ação de coleta de lixo eletrônico? Conte como foi!'
    ];
    const pergunta = perguntas[Math.floor(Math.random() * perguntas.length)];
    // Adiciona pergunta no chat
    chatMessages.innerHTML += `<div class="message bot">${pergunta}</div>`;
    chatMessages.scrollTop = chatMessages.scrollHeight;
    // 1s depois, Eco pensa
    setTimeout(() => {
        ecoThinking();
    }, 1000);
}

function ecoThinking() {
    const avatar = document.getElementById('eco-avatar');
    const chatMessages = document.getElementById('chat-messages');
    if (!avatar || !chatMessages) return;
    avatar.src = 'assets/Images/agente/3-pensando.png';
    // Pontinhos piscando
    let dots = 0;
    const thinkingDiv = document.createElement('div');
    thinkingDiv.className = 'message bot thinking';
    chatMessages.appendChild(thinkingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    const interval = setInterval(() => {
        dots = (dots + 1) % 4;
        thinkingDiv.textContent = '...'.substring(0, dots);
    }, 500);
    // Após 3s, começa a responder
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
    // Resposta exemplo
    const resposta = 'Ótima pergunta! Adotar pequenas ações, como separar resíduos e incentivar vizinhos, faz toda a diferença. Que tal começar hoje mesmo?';
    let i = 0;
    let talking = true;
    const answerDiv = document.createElement('div');
    answerDiv.className = 'message bot';
    chatMessages.appendChild(answerDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    let lastSwitch = Date.now();
    // Alterna imagens enquanto digita
    function typeChar() {
        if (i < resposta.length) {
            answerDiv.textContent += resposta[i];
            if (resposta[i] !== ' ') {
                if (Date.now() - lastSwitch > 90) {
                    avatar.src = (talking ? 'assets/Images/agente/4-falando1.png' : 'assets/Images/agente/5-falando2.png');
                    talking = !talking;
                    lastSwitch = Date.now();
                }
            }
            chatMessages.scrollTop = chatMessages.scrollHeight;
            setTimeout(typeChar, 30); // digitação rápida
            i++;
        } else {
            avatar.src = 'assets/Images/agente/1-sorrindo.png';
            ecoLoopActive = true;
            setTimeout(ecoWelcomeLoop, 1000);
        }
    }
    typeChar();
}

// Alerta 'Em breve!' para tópicos do menu de navegação
function setupFakeMenuAlert() {
    document.querySelectorAll('.fake-menu li').forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const old = document.getElementById('soon-alert');
            if (old) old.remove();
            const alert = document.createElement('div');
            alert.id = 'soon-alert';
            alert.textContent = 'Em breve!';
            alert.style.position = 'fixed';
            alert.style.top = '18px';
            alert.style.left = '50%';
            alert.style.transform = 'translateX(-50%)';
            alert.style.background = 'var(--primary)';
            alert.style.color = '#fff';
            alert.style.padding = '10px 28px';
            alert.style.borderRadius = '12px';
            alert.style.fontWeight = 'bold';
            alert.style.fontSize = '1.1rem';
            alert.style.zIndex = '9999';
            alert.style.boxShadow = '0 2px 12px rgba(60,100,60,0.13)';
            document.body.appendChild(alert);
            setTimeout(() => { alert.remove(); }, 1200);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setupHamburgerMenu();
    setupFakeMenuAlert();
    if (window.location.pathname.includes('')) {
        ecoWelcomeAndChat();
    }
});