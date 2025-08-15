// Presentation App JavaScript
class PresentationApp {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 12;
        this.slides = document.querySelectorAll('.slide');
        this.isTransitioning = false;
        
        this.initializeElements();
        this.bindEvents();
        this.updateUI();
    }
    
    initializeElements() {
        // Navigation elements
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.overviewBtn = document.getElementById('overviewBtn');
        this.closeOverviewBtn = document.getElementById('closeOverview');
        
        // UI elements
        this.currentSlideSpan = document.getElementById('currentSlide');
        this.totalSlidesSpan = document.getElementById('totalSlides');
        this.progressFill = document.getElementById('progressFill');
        this.slideOverview = document.getElementById('slideOverview');
        this.slidesContainer = document.getElementById('slidesContainer');
        
        // Overview items
        this.overviewItems = document.querySelectorAll('.overview-item');
        
        // CTA buttons
        this.ctaButtons = document.querySelectorAll('.cta-buttons .btn');
    }
    
    bindEvents() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.overviewBtn.addEventListener('click', () => this.showOverview());
        this.closeOverviewBtn.addEventListener('click', () => this.hideOverview());
        
        // Overview items
        this.overviewItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const slideNumber = parseInt(e.target.dataset.slide);
                this.goToSlide(slideNumber);
                this.hideOverview();
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Touch/swipe support for mobile
        this.bindTouchEvents();
        
        // CTA buttons
        this.bindCTAEvents();
        
        // Close overview on background click
        this.slideOverview.addEventListener('click', (e) => {
            if (e.target === this.slideOverview) {
                this.hideOverview();
            }
        });
    }
    
    bindTouchEvents() {
        let startX = null;
        let startY = null;
        
        this.slidesContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        this.slidesContainer.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const deltaX = startX - endX;
            const deltaY = startY - endY;
            
            // Only process horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
            
            startX = null;
            startY = null;
        });
    }
    
    bindCTAEvents() {
        this.ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const buttonText = e.target.textContent.trim();
                
                if (buttonText === 'Schedule Demo') {
                    this.handleScheduleDemo();
                } else if (buttonText === 'Download Proposal') {
                    this.handleDownloadProposal();
                }
            });
        });
    }
    
    handleScheduleDemo() {
        // Simulate scheduling demo action
        alert('Thank you for your interest! A Criyx.com representative will contact you within 24 hours to schedule your personalized demo.');
    }
    
    handleDownloadProposal() {
        // Simulate downloading proposal
        alert('Thank you! Your detailed proposal is being prepared and will be sent to your email shortly.');
    }
    
    handleKeyboard(e) {
        // Prevent navigation when overview is open
        if (!this.slideOverview.classList.contains('hidden')) {
            if (e.key === 'Escape') {
                this.hideOverview();
            }
            return;
        }
        
        switch (e.key) {
            case 'ArrowRight':
            case ' ':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
            case 'Escape':
                this.hideOverview();
                break;
            case 'o':
            case 'O':
                this.showOverview();
                break;
        }
    }
    
    nextSlide() {
        if (this.isTransitioning) return;
        
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    previousSlide() {
        if (this.isTransitioning) return;
        
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    goToSlide(slideNumber) {
        if (this.isTransitioning || slideNumber === this.currentSlide || 
            slideNumber < 1 || slideNumber > this.totalSlides) {
            return;
        }
        
        this.isTransitioning = true;
        
        // Remove active class from current slide
        const currentSlideEl = document.querySelector('.slide.active');
        if (currentSlideEl) {
            currentSlideEl.classList.remove('active');
            
            // Add prev class for transition direction
            if (slideNumber < this.currentSlide) {
                currentSlideEl.classList.add('prev');
            }
        }
        
        // Add active class to new slide
        const newSlideEl = document.querySelector(`.slide[data-slide="${slideNumber}"]`);
        if (newSlideEl) {
            // Remove any existing transition classes
            this.slides.forEach(slide => {
                slide.classList.remove('prev');
            });
            
            setTimeout(() => {
                newSlideEl.classList.add('active');
                this.currentSlide = slideNumber;
                this.updateUI();
                
                // Reset transition flag
                setTimeout(() => {
                    this.isTransitioning = false;
                }, 300);
            }, 50);
        }
    }
    
    updateUI() {
        // Update slide counter
        this.currentSlideSpan.textContent = this.currentSlide;
        this.totalSlidesSpan.textContent = this.totalSlides;
        
        // Update progress bar
        const progress = (this.currentSlide / this.totalSlides) * 100;
        this.progressFill.style.width = `${progress}%`;
        
        // Update navigation buttons
        this.prevBtn.disabled = this.currentSlide === 1;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides;
        
        // Update overview items
        this.overviewItems.forEach(item => {
            const slideNum = parseInt(item.dataset.slide);
            item.classList.toggle('active', slideNum === this.currentSlide);
        });
        
        // Update document title
        document.title = `Criyx.com Presentation - Slide ${this.currentSlide}`;
    }
    
    showOverview() {
        this.slideOverview.classList.remove('hidden');
        // Focus on close button for accessibility
        this.closeOverviewBtn.focus();
    }
    
    hideOverview() {
        this.slideOverview.classList.add('hidden');
        // Return focus to overview button
        this.overviewBtn.focus();
    }
    
    // Auto-advance functionality (optional)
    startAutoAdvance(interval = 30000) {
        this.autoAdvanceInterval = setInterval(() => {
            if (this.currentSlide < this.totalSlides && 
                this.slideOverview.classList.contains('hidden')) {
                this.nextSlide();
            } else {
                this.stopAutoAdvance();
            }
        }, interval);
    }
    
    stopAutoAdvance() {
        if (this.autoAdvanceInterval) {
            clearInterval(this.autoAdvanceInterval);
            this.autoAdvanceInterval = null;
        }
    }
    
    // Presenter mode functionality
    enterPresenterMode() {
        document.body.classList.add('presenter-mode');
        // Hide cursor after inactivity
        let cursorTimer;
        
        const hideCursor = () => {
            document.body.style.cursor = 'none';
        };
        
        const showCursor = () => {
            document.body.style.cursor = 'default';
            clearTimeout(cursorTimer);
            cursorTimer = setTimeout(hideCursor, 3000);
        };
        
        document.addEventListener('mousemove', showCursor);
        showCursor();
    }
    
    exitPresenterMode() {
        document.body.classList.remove('presenter-mode');
        document.body.style.cursor = 'default';
    }
}

// Enhanced slide transition effects
class SlideTransitions {
    static fadeTransition(currentSlide, nextSlide, direction) {
        return new Promise(resolve => {
            currentSlide.style.opacity = '0';
            setTimeout(() => {
                currentSlide.classList.remove('active');
                nextSlide.classList.add('active');
                nextSlide.style.opacity = '1';
                resolve();
            }, 300);
        });
    }
    
    static slideTransition(currentSlide, nextSlide, direction) {
        return new Promise(resolve => {
            const translateX = direction === 'next' ? '-100%' : '100%';
            const translateXNext = direction === 'next' ? '100%' : '-100%';
            
            nextSlide.style.transform = `translateX(${translateXNext})`;
            nextSlide.classList.add('active');
            
            setTimeout(() => {
                currentSlide.style.transform = `translateX(${translateX})`;
                nextSlide.style.transform = 'translateX(0)';
                
                setTimeout(() => {
                    currentSlide.classList.remove('active');
                    currentSlide.style.transform = '';
                    resolve();
                }, 300);
            }, 50);
        });
    }
}

// Analytics tracking (placeholder)
class PresentationAnalytics {
    static trackSlideView(slideNumber, slideTitle) {
        // Placeholder for analytics tracking
        console.log(`Slide viewed: ${slideNumber} - ${slideTitle}`);
    }
    
    static trackInteraction(action, details) {
        // Placeholder for interaction tracking
        console.log(`Interaction: ${action}`, details);
    }
    
    static trackTimeSpent(slideNumber, timeSpent) {
        // Placeholder for time tracking
        console.log(`Time spent on slide ${slideNumber}: ${timeSpent}ms`);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const app = new PresentationApp();
    
    // Add some enhanced functionality
    let slideStartTime = Date.now();
    
    // Track time spent on each slide
    const originalGoToSlide = app.goToSlide.bind(app);
    app.goToSlide = function(slideNumber) {
        const timeSpent = Date.now() - slideStartTime;
        PresentationAnalytics.trackTimeSpent(this.currentSlide, timeSpent);
        
        const result = originalGoToSlide(slideNumber);
        slideStartTime = Date.now();
        
        // Track slide view
        const slideTitle = document.querySelector(`.slide[data-slide="${slideNumber}"] h1`)?.textContent || `Slide ${slideNumber}`;
        PresentationAnalytics.trackSlideView(slideNumber, slideTitle);
        
        return result;
    };
    
    // Add fullscreen functionality
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F11' || (e.key === 'f' && e.ctrlKey)) {
            e.preventDefault();
            toggleFullscreen();
        }
    });
    
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    // Add print functionality
    window.addEventListener('beforeprint', () => {
        // Show all slides for printing
        document.querySelectorAll('.slide').forEach(slide => {
            slide.style.position = 'static';
            slide.style.opacity = '1';
            slide.style.transform = 'none';
            slide.style.pageBreakAfter = 'always';
        });
    });
    
    window.addEventListener('afterprint', () => {
        // Restore original slide styles
        location.reload();
    });
    
    // Add slide notes functionality (for presenter mode)
    const slideNotes = {
        1: "Welcome! This presentation outlines how AI can revolutionize your business operations.",
        2: "Criyx.com is a leader in creating custom AI solutions that drive growth and efficiency.",
        3: "Businesses today face rising costs, inefficient manual workflows, and the challenge of data overload.",
        4: "AI provides a powerful solution, boosting productivity, cutting costs, and improving lead quality.",
        5: "For real estate, AI can automate lead scoring, offer personalized property recommendations, and provide 24/7 support.",
        6: "In the restaurant industry, AI can automate ordering, optimize inventory, and deliver personalized marketing.",
        7: "For e-commerce, AI enables dynamic pricing, hyper-personalization, and supply chain optimization.",
        8: "Our AI ecosystem is a comprehensive solution covering sales, operations, and customer experience.",
        9: "We follow a clear, phased roadmap to ensure a smooth and successful AI transformation.",
        10: "Expect a significant and measurable return on your investment, with clear business value.",
        11: "Criyx.com is your trusted partner, offering deep expertise and custom-tailored solutions.",
        12: "Let's discuss how we can build the future of your business together. Schedule a demo to get started."
    };
    
    // Make slide notes available globally
    window.getSlideNotes = (slideNumber) => {
        return slideNotes[slideNumber] || `Notes for slide ${slideNumber}`;
    };
    
    // Add accessibility improvements
    document.querySelectorAll('.slide').forEach((slide, index) => {
        slide.setAttribute('aria-label', `Slide ${index + 1} of ${app.totalSlides}`);
    });
    
    // Announce slide changes for screen readers
    const originalUpdateUI = app.updateUI.bind(app);
    app.updateUI = function() {
        originalUpdateUI();
        
        // Create live region for screen readers
        let liveRegion = document.getElementById('slide-announcer');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'slide-announcer';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            document.body.appendChild(liveRegion);
        }
        
        const slideTitle = document.querySelector(`.slide[data-slide="${this.currentSlide}"] h1`)?.textContent || `Slide ${this.currentSlide}`;
        liveRegion.textContent = `${slideTitle}, slide ${this.currentSlide} of ${this.totalSlides}`;
    };
    
    console.log('Criyx.com Presentation App initialized successfully');
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PresentationApp, SlideTransitions, PresentationAnalytics };
}