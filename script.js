// Show data - This would typically come from an API
const showsData = [
    {
        id: 1,
        title: "MAMI",
        genre: "Drama",
        thumbnail: "https://images.unsplash.com/photo-1489599128872-7e18526b2176?w=400&h=225&fit=crop",
        description: "A compelling drama series"
    },
    {
        id: 2,
        title: "Alice And Huck",
        genre: "Adventure",
        thumbnail: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&h=225&fit=crop",
        description: "An adventure tale of friendship"
    },
    {
        id: 3,
        title: "When Jesse was Born",
        genre: "Biography",
        thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=225&fit=crop",
        description: "A biographical journey"
    },
    {
        id: 4,
        title: "Thirsty (Trailer)",
        genre: "Thriller",
        thumbnail: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=225&fit=crop",
        description: "A thrilling trailer"
    },
    {
        id: 5,
        title: "New Day",
        genre: "Romance",
        thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop",
        description: "A romantic story of new beginnings"
    },
    {
        id: 6,
        title: "Typhoon Talk: Break the Stigma",
        genre: "Documentary",
        thumbnail: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=225&fit=crop",
        description: "Breaking barriers and stigmas"
    },
    {
        id: 7,
        title: "Silent Waters",
        genre: "Mystery",
        thumbnail: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=225&fit=crop",
        description: "A mysterious tale by the water"
    },
    {
        id: 8,
        title: "City Lights",
        genre: "Urban Drama",
        thumbnail: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=400&h=225&fit=crop",
        description: "Stories from the big city"
    }
];

class ShowsManager {
    constructor() {
        this.showsGrid = document.getElementById('showsGrid');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentPage = 0;
        this.showsPerPage = 6;
        this.maxPages = Math.ceil(showsData.length / this.showsPerPage);
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.renderShows();
        this.updateNavigationButtons();
    }
    
    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.previousPage());
        this.nextBtn.addEventListener('click', () => this.nextPage());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousPage();
            } else if (e.key === 'ArrowRight') {
                this.nextPage();
            }
        });
        
        // Add show card click handlers
        this.showsGrid.addEventListener('click', (e) => {
            const showCard = e.target.closest('.show-card');
            if (showCard) {
                const showId = showCard.dataset.showId;
                this.handleShowClick(showId);
            }
        });
    }
    
    showLoading() {
        this.loadingSpinner.classList.add('active');
    }
    
    hideLoading() {
        this.loadingSpinner.classList.remove('active');
    }
    
    createShowCard(show) {
        const showCard = document.createElement('div');
        showCard.className = 'show-card';
        showCard.dataset.showId = show.id;
        showCard.setAttribute('tabindex', '0');
        showCard.setAttribute('role', 'button');
        showCard.setAttribute('aria-label', `Play ${show.title}`);
        
        showCard.innerHTML = `
            <div class="thumbnail-container">
                ${this.createThumbnailElement(show)}
            </div>
            <div class="show-info">
                <h3 class="show-title">${this.escapeHtml(show.title)}</h3>
                <p class="show-genre">${this.escapeHtml(show.genre)}</p>
            </div>
        `;
        
        return showCard;
    }
    
    createThumbnailElement(show) {
        if (show.thumbnail) {
            return `
                <img 
                    class="thumbnail-image" 
                    src="${show.thumbnail}" 
                    alt="${this.escapeHtml(show.title)} thumbnail"
                    onerror="this.parentElement.innerHTML = this.parentElement.dataset.fallback"
                    data-fallback='<div class="thumbnail-placeholder" aria-label="No thumbnail available"></div>'
                    loading="lazy"
                />
            `;
        } else {
            return '<div class="thumbnail-placeholder" aria-label="No thumbnail available"></div>';
        }
    }
    
    renderShows() {
        this.showLoading();
        
        // Simulate API delay
        setTimeout(() => {
            const startIndex = this.currentPage * this.showsPerPage;
            const endIndex = startIndex + this.showsPerPage;
            const currentShows = showsData.slice(startIndex, endIndex);
            
            this.showsGrid.innerHTML = '';
            
            if (currentShows.length === 0) {
                this.showsGrid.innerHTML = `
                    <div class="empty-state">
                        <h3>No shows available</h3>
                        <p>Check back later for new content</p>
                    </div>
                `;
            } else {
                currentShows.forEach(show => {
                    const showCard = this.createShowCard(show);
                    this.showsGrid.appendChild(showCard);
                });
            }
            
            this.hideLoading();
            this.updateNavigationButtons();
            
            // Add stagger animation
            this.animateShowCards();
        }, 500);
    }
    
    animateShowCards() {
        const cards = this.showsGrid.querySelectorAll('.show-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    previousPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.renderShows();
        }
    }
    
    nextPage() {
        if (this.currentPage < this.maxPages - 1) {
            this.currentPage++;
            this.renderShows();
        }
    }
    
    updateNavigationButtons() {
        this.prevBtn.disabled = this.currentPage === 0;
        this.nextBtn.disabled = this.currentPage === this.maxPages - 1;
        
        // Update ARIA labels
        this.prevBtn.setAttribute('aria-label', 
            `Previous page${this.currentPage === 0 ? ' (disabled)' : ''}`);
        this.nextBtn.setAttribute('aria-label', 
            `Next page${this.currentPage === this.maxPages - 1 ? ' (disabled)' : ''}`);
    }
    
    handleShowClick(showId) {
        const show = showsData.find(s => s.id == showId);
        if (show) {
            console.log(`Playing show: ${show.title}`);
            // Here you would typically navigate to the show page or open a modal
            // For demo purposes, we'll just show an alert
            alert(`Opening "${show.title}" - ${show.description}`);
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Method to update shows data (for API integration)
    updateShows(newShowsData) {
        showsData.length = 0;
        showsData.push(...newShowsData);
        this.maxPages = Math.ceil(showsData.length / this.showsPerPage);
        this.currentPage = 0;
        this.renderShows();
    }
    
    // Method to add error handling for API failures
    handleError(error) {
        console.error('Error loading shows:', error);
        this.hideLoading();
        this.showsGrid.innerHTML = `
            <div class="error-message">
                <h3>Sorry, we couldn't load the shows</h3>
                <p>Please try refreshing the page</p>
                <button onclick="location.reload()" style="margin-top: 10px; padding: 10px 20px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 5px; cursor: pointer;">
                    Refresh Page
                </button>
            </div>
        `;
    }
}

// Initialize the shows manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.showsManager = new ShowsManager();
});

// Add some utility functions for potential API integration
const API = {
    async fetchShows() {
        try {
            // This would be your actual API endpoint
            // const response = await fetch('/api/shows');
            // const data = await response.json();
            // return data;
            
            // For now, return our mock data
            return new Promise(resolve => {
                setTimeout(() => resolve(showsData), 1000);
            });
        } catch (error) {
            throw new Error('Failed to fetch shows');
        }
    },
    
    async fetchShowDetails(showId) {
        try {
            // const response = await fetch(`/api/shows/${showId}`);
            // return await response.json();
            
            return showsData.find(show => show.id == showId);
        } catch (error) {
            throw new Error('Failed to fetch show details');
        }
    }
};

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShowsManager, API };
}