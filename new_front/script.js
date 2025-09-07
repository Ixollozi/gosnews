// Global state
let isSearchOpen = false;
let isLoginOpen = false;
let isMobileMenuOpen = false;
let isLanguageDropdownOpen = false;
let isMainDropdownOpen = false;

// DOM elements
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const searchOverlay = document.getElementById('searchOverlay');
const loginModal = document.getElementById('loginModal');
const mobileMenu = document.getElementById('mobileMenu');
const searchInput = document.querySelector('.search-input');
const tabBtns = document.querySelectorAll('.tab-btn');
const programCards = document.querySelectorAll('.program-card');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSearch();
    initializeLogin();
    initializeMobileMenu();
    initializeTabs();
    initializeAccessibility();
    initializeAnimations();
    initializeLanguageSelector();
    initializeMainDropdown();
    setActiveNavLink();
});

// Set active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Navigation functionality
function initializeNavigation() {
    // Handle mobile navigation clicks - just close menu for external links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = href.substring(1);
                showSection(targetSection);
                closeMobileMenu();
            } else {
                // For external links, just close the mobile menu
                closeMobileMenu();
            }
        });
    });

    // Handle language switcher
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            langBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            showLanguageNotification(`Язык изменен на ${this.textContent}`);
        });
    });
}

function showSection(sectionId) {
    // This function is only used for same-page navigation with # anchors
    // For external HTML files, normal browser navigation is used
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Search functionality
function initializeSearch() {
    // Handle search input
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(this.value);
            }, 300);
        });

        // Handle search form submission
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
            }
        });
    }
}

function toggleSearch() {
    isSearchOpen = !isSearchOpen;
    searchOverlay.classList.toggle('active', isSearchOpen);
    
    if (isSearchOpen && searchInput) {
        searchInput.focus();
    }
}

function performSearch(query) {
    if (!query.trim()) return;
    
    // Simulate search
    console.log('Searching for:', query);
    showNotification(`Поиск: "${query}"`);
    
    // In a real application, this would make an API call
    // and update the content accordingly
}

// Login functionality
function initializeLogin() {
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
}

function toggleLogin() {
    isLoginOpen = !isLoginOpen;
    loginModal.classList.toggle('active', isLoginOpen);
}

function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        showNotification('Пожалуйста, заполните все поля', 'error');
        return;
    }
    
    // Simulate login
    showNotification('Вход в систему...', 'info');
    
    setTimeout(() => {
        showNotification('Вы успешно вошли в систему', 'success');
        toggleLogin();
        // Reset form
        document.querySelector('.login-form').reset();
    }, 1000);
}

// Mobile menu functionality
function initializeMobileMenu() {
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isMobileMenuOpen && !mobileMenu.contains(e.target) && !e.target.closest('.mobile-menu-btn')) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    mobileMenu.classList.toggle('active', isMobileMenuOpen);
}

function closeMobileMenu() {
    isMobileMenuOpen = false;
    mobileMenu.classList.remove('active');
}

// Tabs functionality
function initializeTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            filterPrograms(tab);
            updateActiveTab(this);
        });
    });
}

function updateActiveTab(activeBtn) {
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
}

function filterPrograms(category) {
    programCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// Accessibility features
function initializeAccessibility() {
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Close modals with Escape key
        if (e.key === 'Escape') {
            if (isSearchOpen) toggleSearch();
            if (isLoginOpen) toggleLogin();
            if (isMobileMenuOpen) closeMobileMenu();
            if (isMainDropdownOpen) closeMainDropdown();
            if (isLanguageDropdownOpen) closeLanguageDropdown();
        }
        
        // Open search with Ctrl+K or Cmd+K
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toggleSearch();
        }
    });

    // Focus management
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    // Trap focus in modals
    function trapFocus(element) {
        const focusableContent = element.querySelectorAll(focusableElements);
        const firstFocusableElement = focusableContent[0];
        const lastFocusableElement = focusableContent[focusableContent.length - 1];

        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    // Apply focus trap to modals
    if (searchOverlay) trapFocus(searchOverlay);
    if (loginModal) trapFocus(loginModal);
}

// Utility functions
function toggleHighContrast() {
    document.documentElement.classList.toggle('high-contrast');
    const isEnabled = document.documentElement.classList.contains('high-contrast');
    localStorage.setItem('highContrast', isEnabled);
    showNotification(isEnabled ? 'Высокий контраст включен' : 'Высокий контраст отключен');
}

function toggleLargeText() {
    document.documentElement.classList.toggle('large-text');
    const isEnabled = document.documentElement.classList.contains('large-text');
    localStorage.setItem('largeText', isEnabled);
    showNotification(isEnabled ? 'Крупный текст включен' : 'Крупный текст отключен');
}

// Main Dropdown functionality
function initializeMainDropdown() {
    const mainDropdown = document.getElementById('dropdown-jangarma');
    
    if (mainDropdown) {
        // Toggle dropdown on click
        mainDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMainDropdown();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (isMainDropdownOpen && !mainDropdown.contains(e.target)) {
                closeMainDropdown();
            }
        });
    }
}

function toggleMainDropdown() {
    isMainDropdownOpen = !isMainDropdownOpen;
    const mainDropdown = document.getElementById('dropdown-jangarma');
    
    if (isMainDropdownOpen) {
        mainDropdown.classList.add('open');
    } else {
        mainDropdown.classList.remove('open');
    }
}

function closeMainDropdown() {
    isMainDropdownOpen = false;
    const mainDropdown = document.getElementById('dropdown-jangarma');
    if (mainDropdown) {
        mainDropdown.classList.remove('open');
    }
}

// Language Selector functionality
function initializeLanguageSelector() {
    const languageSelector = document.getElementById('language-selector');
    const languageMenu = document.querySelector('.language-menu');
    
    if (languageSelector) {
        // Toggle dropdown on click
        languageSelector.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleLanguageDropdown();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (isLanguageDropdownOpen && !languageSelector.contains(e.target)) {
                closeLanguageDropdown();
            }
        });
        
        // Handle language selection
        const languageOptions = document.querySelectorAll('.language-menu a');
        languageOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                const selectedLang = this.getAttribute('data-lang');
                changeLanguage(selectedLang);
                closeLanguageDropdown();
            });
        });
    }
}

function toggleLanguageDropdown() {
    isLanguageDropdownOpen = !isLanguageDropdownOpen;
    const languageSelector = document.getElementById('language-selector');
    
    if (isLanguageDropdownOpen) {
        languageSelector.classList.add('open');
    } else {
        languageSelector.classList.remove('open');
    }
}

function closeLanguageDropdown() {
    isLanguageDropdownOpen = false;
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.classList.remove('open');
    }
}

function changeLanguage(lang) {
    // Update current language display
    const currentLanguageSpan = document.getElementById('current-language');
    const languageOptions = document.querySelectorAll('.language-menu a');
    
    // Remove active class from all options
    languageOptions.forEach(option => {
        option.classList.remove('active');
    });
    
    // Add active class to selected option
    const selectedOption = document.querySelector(`[data-lang="${lang}"]`);
    if (selectedOption) {
        selectedOption.classList.add('active');
    }
    
    // Update current language display
    const langCodes = {
        'ru': 'RUS',
        'uz': 'UZB',
        'kaa': 'KAA'
    };
    
    if (currentLanguageSpan && langCodes[lang]) {
        currentLanguageSpan.textContent = langCodes[lang];
    }
    
    // Show notification
    const langNames = {
        'ru': 'Русский',
        'uz': 'O\'zbek',
        'kaa': 'Karakalpak'
    };
    
    showLanguageNotification(`Язык изменен на ${langNames[lang]}`);
    
    // Store language preference
    localStorage.setItem('selectedLanguage', lang);
    
    // Redirect to change the language
    window.location.href = `/?lang=${lang}`;
}



function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '1000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Set background color based on type
    const colors = {
        success: '#007CB9',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    // Force set background color
    if (type === 'success') {
        notification.style.backgroundColor = '#007CB9';
        notification.style.setProperty('background-color', '#007CB9', 'important');
    } else {
        notification.style.backgroundColor = colors[type] || colors.info;
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Special function for language change notifications
function showLanguageNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification language-notification';
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
        background-color: #007CB9 !important;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Animation utilities
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.news-card, .program-card, .region-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Load saved preferences
function loadPreferences() {
    const highContrast = localStorage.getItem('highContrast') === 'true';
    const largeText = localStorage.getItem('largeText') === 'true';
    const selectedLanguage = localStorage.getItem('selectedLanguage') || 'uz';
    
    if (highContrast) {
        document.documentElement.classList.add('high-contrast');
    }
    
    if (largeText) {
        document.documentElement.classList.add('large-text');
    }
    
    // Set current language display
    const currentLanguageSpan = document.getElementById('current-language');
    const langCodes = {
        'ru': 'RUS',
        'uz': 'UZB',
        'kaa': 'KAA'
    };
    
    if (currentLanguageSpan && langCodes[selectedLanguage]) {
        currentLanguageSpan.textContent = langCodes[selectedLanguage];
    }
    
    // Set active language option
    const languageOptions = document.querySelectorAll('.language-menu a');
    languageOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-lang') === selectedLanguage) {
            option.classList.add('active');
        }
    });
}

// Initialize preferences on load
document.addEventListener('DOMContentLoaded', loadPreferences);

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Close mobile menu on desktop
    if (window.innerWidth > 768 && isMobileMenuOpen) {
        closeMobileMenu();
    }
}, 250));

// Handle scroll events
window.addEventListener('scroll', throttle(() => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    } else {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    }
}, 100));

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .notification {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    }
    
    .notification-success {
        background-color: #007CB9 !important;
    }
`;
document.head.appendChild(style);
