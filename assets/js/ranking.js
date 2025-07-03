// Mobile menu toggle
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});

// Sample neighborhood data
const neighborhoods = [
    { name: "Jardim das Flores", points: 1250, position: 1 },
    { name: "Vila Verde", points: 980, position: 2 },
    { name: "Bairro Ecológico", points: 875, position: 3 },
    { name: "Parque das Árvores", points: 760, position: 4 },
    { name: "Alameda Sustentável", points: 720, position: 5 },
    { name: "Morada do Sol", points: 680, position: 6 },
    { name: "Vila Harmonia", points: 650, position: 7 }
];

// Generate ranking list
function generateRankingList() {
    const rankingContainer = document.getElementById('neighborhood-rank');
    
    neighborhoods.forEach(neighborhood => {
        const rankItem = document.createElement('div');
        rankItem.className = `rank-item rank-${neighborhood.position} animate-fadeIn`;
        
        rankItem.innerHTML = `
            <div class="rank-position">${neighborhood.position}</div>
            <div class="neighborhood-info">
                <div class="neighborhood-name">${neighborhood.name}</div>
                <div class="neighborhood-points">${neighborhood.points} pontos</div>
            </div>
        `;
        
        rankingContainer.appendChild(rankItem);
    });
}

// Initialize chart
function initChart() {
    const ctx = document.getElementById('ranking-chart').getContext('2d');
    
    const labels = neighborhoods.map(n => n.name);
    const data = neighborhoods.map(n => n.points);
    const backgroundColors = [
        'rgba(255, 193, 7, 0.7)',
        'rgba(158, 158, 158, 0.7)',
        'rgba(141, 110, 99, 0.7)',
        'rgba(76, 175, 80, 0.7)',
        'rgba(33, 150, 243, 0.7)',
        'rgba(156, 39, 176, 0.7)',
        'rgba(244, 67, 54, 0.7)'
    ];
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Pontos Sustentáveis',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Pontos'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Bairros'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y} pontos`;
                        }
                    }
                }
            }
        }
    });
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

document.querySelectorAll('.rank-item, .metric-card').forEach(el => {
    observer.observe(el);
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    generateRankingList();
    initChart();
});