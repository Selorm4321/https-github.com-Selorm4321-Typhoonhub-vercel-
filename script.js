// Helper to generate inline SVG thumbnails so the page doesn't rely on
// external image hosts. Some providers (like Unsplash) now block hotlinking,
// which results in 403 responses and empty thumbnails. Instead of using
// `data:` URLs (which can be blocked by Content Security Policies) we embed
// the SVG markup directly in the page so it always renders.
const createInlineThumbnail = (title) => {
    return `
        <svg
            class="thumbnail-image"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 400 225"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            role="img"
            aria-label="${title} thumbnail"
        >
            <rect width="400" height="225" fill="#333" />
            <text
                x="50%"
                y="50%"
                dominant-baseline="middle"
                text-anchor="middle"
                fill="#fff"
                font-family="Arial, sans-serif"
                font-size="24"
            >${title}</text>
        </svg>
    `;
};

// Show data - This would typically come from an API
const showsData = [
    {
        id: 1,
        title: "MAMI",
        genre: "Drama",
        thumbnail: createInlineThumbnail("MAMI"),
        description: "A compelling drama series"
    },
    {
        id: 2,
        title: "Alice And Huck",
        genre: "Adventure",
        thumbnail: createInlineThumbnail("Alice And Huck"),
        description: "An adventure tale of friendship"
    },
    {
        id: 3,
        title: "When Jesse was Born",
        genre: "Biography",
        thumbnail: createInlineThumbnail("When Jesse was Born"),
        description: "A biographical journey"
    },
    {
        id: 4,
        title: "Thirsty (Trailer)",
        genre: "Thriller",
        thumbnail: createInlineThumbnail("Thirsty"),
        description: "A thrilling trailer"
    },
    {
        id: 5,
        title: "New Day",
        genre: "Romance",
        thumbnail: createInlineThumbnail("New Day"),
        description: "A romantic story of new beginnings"
    },
    {
        id: 6,
        title: "Typhoon Talk: Break the Stigma",
        genre: "Documentary",
        thumbnail: createInlineThumbnail("Typhoon Talk"),
        description: "Breaking barriers and stigmas"
    },
    {
        id: 7,
        title: "Silent Waters",
        genre: "Mystery",
        thumbnail: createInlineThumbnail("Silent Waters"),
        description: "A mysterious tale by the water"
    },
    {
        id: 8,
        title: "City Lights",
        genre: "Urban Drama",
        thumbnail: createInlineThumbnail("City Lights"),
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
            // If the thumbnail string contains raw SVG markup, return it directly
            if (show.thumbnail.trim().startsWith('<svg')) {
                return show.thumbnail;
            }
            // Otherwise treat it as an image URL
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
        }
        return '<div class="thumbnail-placeholder" aria-label="No thumbnail available"></div>';
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