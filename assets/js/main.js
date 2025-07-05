// JavaScript para controlar o menu desktop
document.getElementById('desktop-menu-button').addEventListener('click', function() {
    const menu = document.getElementById('desktop-menu');
    menu.classList.toggle('hidden');
});


// Menu mobile
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});


// Fechar o menu quando clicar fora
document.addEventListener('click', function(event) {
    const menu = document.getElementById('desktop-menu');
    const button = document.getElementById('desktop-menu-button');
    
    if (!menu.contains(event.target) && !button.contains(event.target)) {
        menu.classList.add('hidden');
    }
});


// Scrol suave para os links âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
            
            // Scroll to target
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
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


// Form submission handler
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Obrigado pelo seu contato! Responderemos em breve.');
    this.reset();
});


// JavaScript para pegar a localização atual e carregar o mapa
let map;
            
function ativarLoc() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                
                // Substitui o conteúdo pelo mapa
                const mapContainer = document.getElementById('map-container');
                mapContainer.innerHTML = ''; // Limpa o conteúdo
                mapContainer.style.padding = '0'; // Remove padding se existir
                
                // Cria o mapa com Leaflet
                map = L.map('map-container').setView([latitude, longitude], 15);
                
                // Adiciona camada de tiles (mapa base) - usando OpenStreetMap
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);
                
                // Adiciona marcador da localização
                L.marker([latitude, longitude], {
                    title: "Sua localização",
                    alt: "Sua localização",
                    riseOnHover: true
                }).addTo(map)
                .bindPopup("Você está aqui!")
                .openPopup();
                
                // Adiciona círculo de precisão
                L.circle([latitude, longitude], {
                    color: 'green',
                    fillColor: '#00FF00',
                    fillOpacity: 0.35,
                    radius: position.coords.accuracy
                }).addTo(map);

                // Exemplo rápido: Adicionando um ponto de coleta seletiva
                L.marker([latitude + 0.001, longitude + 0.003], { 
                    icon: L.divIcon({ 
                        html: '<i class="fas fa-recycle" style="color: blue; font-size: 24px;"></i>', 
                        className: 'custom-icon' 
                    }) 
                }).addTo(map)
                .bindPopup("Ponto de coleta seletiva");
            },
            function(error) {
                let errorMessage;
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Permissão de localização negada. Por favor, ative a localização para usar este recurso.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "As informações de localização não estão disponíveis.";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "A solicitação de localização expirou.";
                        break;
                    case error.UNKNOWN_ERROR:
                        errorMessage = "Ocorreu um erro desconhecido ao obter a localização.";
                        break;
                }
                alert(errorMessage);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        alert("Seu navegador não suporta geolocalização. Por favor, atualize ou use outro navegador.");
    }
}

// Função para alternar entre modo claro e escuro
function toggleDarkMode() {
    // Verifica se o modo escuro está ativado
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    // Alterna a classe 'dark' no elemento html
    document.documentElement.classList.toggle('dark');
    
    // Atualiza o ícone do botão
    const themeIcon = document.getElementById('theme-icon');
    if (isDarkMode) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // Salva a preferência no localStorage
    localStorage.setItem('darkMode', !isDarkMode);
}

// Verifica a preferência do usuário ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    // Verifica o localStorage primeiro
    const darkModePreference = localStorage.getItem('darkMode');
    
    // Verifica também a preferência do sistema
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Se houver preferência salva ou o sistema preferir modo escuro
    if (darkModePreference === 'true' || (darkModePreference === null && prefersDarkScheme.matches)) {
        document.documentElement.classList.add('dark');
        const themeIcon = document.getElementById('theme-icon');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // Adiciona o evento de clique ao botão
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleDarkMode);
    }
});


let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // Impede o comportamento automático
  deferredPrompt = e; // Armazena o evento para uso futuro
  document.querySelector('#install-button').style.display = 'inline-block';
});

document.getElementById('install-button').addEventListener('click', () => {
  if (deferredPrompt) {
    deferredPrompt.prompt(); // Mostra o prompt de instalação
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Usuário aceitou a instalação 👍');
      } else {
        console.log('Usuário recusou a instalação 👎');
      }
      deferredPrompt = null;
    });
  }
});