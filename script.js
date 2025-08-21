// Real TyphoonHub show data from your YouTube channel
const showsData = [
    {
        id: 1,
        title: "Jwhonjovouchor and the Yiiiii Kakai Voice of Waste Masks",
        genre: "Documentary",
        thumbnail: "https://img.youtube.com/vi/v3_ueH-TMdc/maxresdefault.jpg",
        description: "An intimate look into the world of Ghanaian artist Jwhonjovouchor, who transforms discarded materials and ocean waste into breathtaking masks and sculptures.",
        youtubeId: "v3_ueH-TMdc",
        duration: "Documentary Feature",
        channel: "TyphoonENT"
    },
    {
        id: 2,
        title: "TyphoonHub Original Content #2",
        genre: "Original Series",
        thumbnail: "https://img.youtube.com/vi/MtIRD4VX_bo/maxresdefault.jpg",
        description: "Original content from TyphoonHub showcasing independent filmmaking and creative storytelling.",
        youtubeId: "MtIRD4VX_bo",
        duration: "Series Episode",
        channel: "TyphoonENT"
    },
    {
        id: 3,
        title: "TyphoonHub Original Content #3",
        genre: "Original Series", 
        thumbnail: "https://img.youtube.com/vi/IHWigm2UgQE/maxresdefault.jpg",
        description: "Continuing the series of original independent films and creative content from emerging filmmakers.",
        youtubeId: "IHWigm2UgQE",
        duration: "Series Episode",
        channel: "TyphoonENT"
    },
    {
        id: 4,
        title: "TyphoonHub Original Content #4",
        genre: "Original Series",
        thumbnail: "https://img.youtube.com/vi/kMBqikKeXYM/maxresdefault.jpg", 
        description: "Independent filmmaking showcase featuring unique stories and creative vision from up-and-coming directors.",
        youtubeId: "kMBqikKeXYM",
        duration: "Series Episode",
        channel: "TyphoonENT"
    },
    {
        id: 5,
        title: "TyphoonHub Original Content #5",
        genre: "Original Series",
        thumbnail: "https://img.youtube.com/vi/QW6_dfNfE0c/maxresdefault.jpg",
        description: "Exploring diverse narratives and artistic expression through independent film and digital storytelling.",
        youtubeId: "QW6_dfNfE0c", 
        duration: "Series Episode",
        channel: "TyphoonENT"
    },
    {
        id: 6,
        title: "TyphoonHub Original Content #6",
        genre: "Original Series",
        thumbnail: "https://img.youtube.com/vi/6gmYHtOfWa4/maxresdefault.jpg",
        description: "Latest installment in the TyphoonHub original series, featuring innovative filmmaking and compelling stories.",
        youtubeId: "6gmYHtOfWa4",
        duration: "Series Episode", 
        channel: "TyphoonENT"
    }
];

class ShowsManager {
    constructor() {
        this.showsGrid = document.getElementById('showsGrid');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentPage = 0;
        this.showsPerPage = 12; // Show all your content on one page
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
                ${show.youtubeId ? '<div class="play-overlay"><div class="play-button">▶</div></div>' : ''}
            </div>
            <div class="show-info">
                <h3 class="show-title">${this.escapeHtml(show.title)}</h3>
                <p class="show-genre">${this.escapeHtml(show.genre)}</p>
                ${show.duration ? `<p class="show-duration">${this.escapeHtml(show.duration)}</p>` : ''}
            </div>
        `;
        
        return showCard;
    }
    
    createThumbnailElement(show) {
        if (show.thumbnail) {
            // For YouTube thumbnails, try maxresdefault first, fallback to hqdefault
            const fallbackThumbnail = show.youtubeId ? 
                `https://img.youtube.com/vi/${show.youtubeId}/hqdefault.jpg` : null;
            
            return `
                <img 
                    class="thumbnail-image" 
                    src="${show.thumbnail}" 
                    alt="${this.escapeHtml(show.title)} thumbnail"
                    onerror="this.onerror=null; this.src='${fallbackThumbnail || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'225\' viewBox=\'0 0 400 225\'%3E%3Crect width=\'400\' height=\'225\' fill=\'%23333\'/%3E%3Ctext x=\'200\' y=\'112.5\' text-anchor=\'middle\' dy=\'.3em\' fill=\'white\' font-family=\'Arial\' font-size=\'24\'%3E🎬%3C/text%3E%3C/svg%3E'}'; if(!this.src.includes('hqdefault') && !this.src.includes('data:image')) { this.parentElement.innerHTML = '<div class=\\'thumbnail-placeholder\\' aria-label=\\'No thumbnail available\\'></div>'; }"
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
        if (show && show.youtubeId) {
            console.log(`Playing show: ${show.title}`);
            // Open YouTube video in new tab for now
            window.open(`https://www.youtube.com/watch?v=${show.youtubeId}`, '_blank');
        } else if (show) {
            // Fallback for shows without YouTube ID
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