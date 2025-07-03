// Mobile menu toggle
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});

// Sample posts data
let posts = [
    {
        id: 1,
        user: "Ana Silva",
        action: "♻️ Reciclagem de plástico",
        neighborhood: "Centro",
        points: 30,
        content: "Separei 3kg de plástico para reciclagem no ecoponto da praça central.",
        timestamp: "10 minutos atrás",
        liked: false
    },
    {
        id: 2,
        user: "Carlos Oliveira",
        action: "🚲 Transporte sustentável",
        neighborhood: "Jardim Igapó",
        points: 45,
        content: "Pedalei 15km para ir ao trabalho hoje, evitando usar o carro!",
        timestamp: "1 hora atrás",
        liked: true
    },
    {
        id: 3,
        user: "Mariana Costa",
        action: "🌳 Plantio de árvore",
        neighborhood: "Vila Brasil",
        points: 50,
        content: "Plantei uma muda de ipê-amarelo no jardim comunitário.",
        timestamp: "3 horas atrás",
        liked: false
    }
];

// Generate feed posts
function generateFeedPosts() {
    const feedContainer = document.getElementById('feed-posts');
    feedContainer.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post animate-fadeIn';
        
        postElement.innerHTML = `
            <div class="post-header">
                <div class="user-avatar">${post.user.charAt(0)}</div>
                <div>
                    <h3 class="font-bold text-gray-800">${post.user}</h3>
                    <p class="text-sm text-gray-500">${post.timestamp} • ${post.neighborhood}</p>
                </div>
            </div>
            <div class="post-content">
                <p><span class="font-bold">${post.action}</span> - ${post.content}</p>
            </div>
            <div class="post-footer">
                <div class="post-points">+${post.points} pontos</div>
                <button class="like-btn ${post.liked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        `;
        
        feedContainer.appendChild(postElement);
    });
}

// Toggle like on post
function toggleLike(postId) {
    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
        posts[postIndex].liked = !posts[postIndex].liked;
        generateFeedPosts();
    }
}

// Simulate new post
function simulatePost() {
    const actionType = document.getElementById('action-type');
    const neighborhood = document.getElementById('neighborhood');
    
    const actionText = actionType.options[actionType.selectedIndex].text.split(' ')[0];
    const points = parseInt(actionType.value);
    
    const newPost = {
        id: posts.length + 1,
        user: "Você",
        action: actionText,
        neighborhood: neighborhood.value,
        points: points,
        content: `Ação sustentável registrada no bairro ${neighborhood.value}.`,
        timestamp: "Agora mesmo",
        liked: false
    };
    
    posts.unshift(newPost);
    generateFeedPosts();
    
    // Reset form
    actionType.selectedIndex = 0;
    neighborhood.selectedIndex = 0;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

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

document.querySelectorAll('.post').forEach(el => {
    observer.observe(el);
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    generateFeedPosts();
});