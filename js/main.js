/**
 * Le Luc - Capitale de la Correspondance
 * JavaScript Principal - Version Sublimée
 * 
 * Fonctionnalités:
 * - Animation de chargement progressive
 * - Navigation fluide avec indicateur de progression
 * - Animations déclenchées par le scroll (Intersection Observer)
 * - Menu mobile responsive
 * - Gestion du thème et préférences utilisateur
 * - Effets de particules interactifs
 * - Accessibilité avancée
 */

class LeLucSite {
    constructor() {
        this.isLoaded = false;
        this.isMobile = window.innerWidth <= 768;
        this.scrollProgress = 0;
        this.activeSection = '';
        this.animations = new Map();
        
        // Éléments du DOM
        this.elements = {};
        
        // Configuration
        this.config = {
            loadingDuration: 3000,
            scrollThrottle: 16,
            intersectionThreshold: 0.3,
            particleCount: 10,
            animationDelay: 100
        };
        
        this.init();
    }

    /**
     * Initialisation du site
     */
    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.initializeLoading();
        this.initializeIntersectionObserver();
        this.initializeParticles();
        this.setupAccessibility();
        this.initializeTheme();
        
        console.log('🎨 Le Luc - Site initialisé avec succès');
    }

    /**
     * Cache des éléments DOM fréquemment utilisés
     */
    cacheElements() {
        this.elements = {
            // Navigation et structure
            loadingScreen: document.getElementById('loading-screen'),
            loadingProgress: document.querySelector('.loading-progress'),
            mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),
            mainNav: document.querySelector('.main-navigation'),
            navLinks: document.querySelectorAll('.nav-links a'),
            progressBar: document.querySelector('.progress-bar'),
            backToTop: document.getElementById('back-to-top'),
            
            // Contenu
            heroSection: document.querySelector('.hero-section'),
            contentSections: document.querySelectorAll('.content-section'),
            emotionAlcoves: document.querySelectorAll('.emotion-alcove'),
            visionCards: document.querySelectorAll('.vision-card'),
            
            // Éléments interactifs
            buttons: document.querySelectorAll('.btn'),
            emotionTags: document.querySelectorAll('.emotion-tag'),
            quotes: document.querySelectorAll('.main-quote')
        };
    }

    /**
     * Configuration des écouteurs d'événements
     */
    setupEventListeners() {
        // Événements de fenêtre
        window.addEventListener('load', () => this.handlePageLoad());
        window.addEventListener('scroll', () => this.throttle(this.handleScroll.bind(this), this.config.scrollThrottle));
        window.addEventListener('resize', () => this.handleResize());
        
        // Navigation
        if (this.elements.mobileMenuToggle) {
            this.elements.mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
        
        // Retour en haut
        if (this.elements.backToTop) {
            this.elements.backToTop.addEventListener('click', () => this.scrollToTop());
        }
        
        // Interactions avec les émotions
        this.elements.emotionAlcoves.forEach(alcove => {
            alcove.addEventListener('mouseenter', (e) => this.handleEmotionHover(e));
            alcove.addEventListener('click', (e) => this.handleEmotionClick(e));
        });
        
        // Cards interactives
        this.elements.visionCards.forEach(card => {
            card.addEventListener('click', (e) => this.handleCardClick(e));
        });
        
        // Gestion du clavier pour l'accessibilité
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Gestion des préférences utilisateur
        this.detectUserPreferences();
    }

    /**
     * Animation de chargement progressive
     */
    initializeLoading() {
        if (!this.elements.loadingScreen) return;
        
        // Animation de la barre de progression
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress > 100) progress = 100;
            
            if (this.elements.loadingProgress) {
                this.elements.loadingProgress.style.width = `${progress}%`;
            }
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                setTimeout(() => this.hideLoadingScreen(), 500);
            }
        }, 150);
    }

    /**
     * Masquage de l'écran de chargement
     */
    hideLoadingScreen() {
        if (this.elements.loadingScreen) {
            this.elements.loadingScreen.classList.add('hidden');
            
            setTimeout(() => {
                this.elements.loadingScreen.style.display = 'none';
                this.isLoaded = true;
                this.startMainAnimations();
            }, 500);
        }
    }

    /**
     * Démarrage des animations principales
     */
    startMainAnimations() {
        // Animation du titre héroïque
        this.animateHeroTitle();
        
        // Révélation progressive des sections
        this.revealSections();
        
        // Initialisation des particules
        this.startParticleAnimation();
        
        // Animation des quotes avec effet machine à écrire
        this.animateQuotes();
    }

    /**
     * Animation du titre principal
     */
    animateHeroTitle() {
        const titleElements = document.querySelectorAll('.hero-title > span');
        
        titleElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.animationDelay = `${index * 0.3}s`;
                element.classList.add('animate');
            }, index * 300);
        });
    }

    /**
     * Révélation progressive des sections
     */
    revealSections() {
        this.elements.contentSections.forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('revealed');
            }, index * 200);
        });
    }

    /**
     * Animation des citations avec effet machine à écrire
     */
    animateQuotes() {
        this.elements.quotes.forEach((quote, index) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            this.typewriterEffect(entry.target);
                        }, 500);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(quote);
        });
    }

    /**
     * Effet machine à écrire pour les citations
     */
    typewriterEffect(element) {
        const text = element.textContent;
        element.textContent = '';
        element.classList.add('typing');
        
        let i = 0;
        const typeInterval = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            
            if (i > text.length) {
                clearInterval(typeInterval);
                element.classList.remove('typing');
                element.classList.add('typed');
            }
        }, 50);
    }

    /**
     * Configuration de l'Intersection Observer pour les animations au scroll
     */
    initializeIntersectionObserver() {
        const observerOptions = {
            threshold: this.config.intersectionThreshold,
            rootMargin: '0px 0px -10% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observation des éléments à animer
        const elementsToObserve = document.querySelectorAll(`
            .vision-card,
            .gallery-card,
            .emotion-alcove,
            .timbre-type,
            .rue-card,
            .echange-card,
            .event-card,
            .animate-on-scroll
        `);

        elementsToObserve.forEach(element => {
            observer.observe(element);
        });
    }

    /**
     * Animation d'un élément spécifique
     */
    animateElement(element) {
        const animationType = element.dataset.animation || 'fadeInUp';
        const delay = element.dataset.delay || 0;
        
        setTimeout(() => {
            element.classList.add('animate', `animate-${animationType}`);
            
            // Animations spéciales pour certains types d'éléments
            if (element.classList.contains('emotion-alcove')) {
                this.animateEmotionAlcove(element);
            } else if (element.classList.contains('vision-card')) {
                this.animateVisionCard(element);
            }
        }, delay);
    }

    /**
     * Animation spécifique pour les alcôves d'émotions
     */
    animateEmotionAlcove(element) {
        const icon = element.querySelector('.emotion-icon');
        if (icon) {
            setTimeout(() => {
                icon.style.animation = 'gentlePulse 2s ease-in-out infinite';
            }, 500);
        }
    }

    /**
     * Animation spécifique pour les cartes de vision
     */
    animateVisionCard(element) {
        const icon = element.querySelector('.vision-icon');
        if (icon) {
            element.addEventListener('mouseenter', () => {
                icon.style.transform = 'rotate(360deg) scale(1.1)';
            });
            
            element.addEventListener('mouseleave', () => {
                icon.style.transform = 'rotate(0deg) scale(1)';
            });
        }
    }

    /**
     * Gestion du scroll avec indicateur de progression
     */
    handleScroll() {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Calcul du progrès
        this.scrollProgress = (scrollTop / documentHeight) * 100;
        
        // Mise à jour de la barre de progression
        if (this.elements.progressBar) {
            this.elements.progressBar.style.width = `${this.scrollProgress}%`;
        }
        
        // Affichage/masquage du bouton retour en haut
        this.toggleBackToTop();
        
        // Mise à jour de la section active
        this.updateActiveSection();
        
        // Effet parallaxe sur les éléments flottants
        this.updateParallaxElements(scrollTop);
    }

    /**
     * Mise à jour de la section active dans la navigation
     */
    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                if (this.activeSection !== id) {
                    this.activeSection = id;
                    this.updateNavActiveState(id);
                }
            }
        });
    }

    /**
     * Mise à jour de l'état actif dans la navigation
     */
    updateNavActiveState(activeId) {
        this.elements.navLinks.forEach(link => {
            link.classList.remove('active');
            
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Effet parallaxe sur les éléments flottants
     */
    updateParallaxElements(scrollTop) {
        const floatingElements = document.querySelectorAll('.floating-elements > div');
        
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    /**
     * Affichage/masquage du bouton retour en haut
     */
    toggleBackToTop() {
        if (!this.elements.backToTop) return;
        
        if (this.scrollProgress > 20) {
            this.elements.backToTop.classList.add('visible');
        } else {
            this.elements.backToTop.classList.remove('visible');
        }
    }

    /**
     * Retour en haut de page avec animation fluide
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    /**
     * Gestion des clics sur la navigation
     */
    handleNavClick(e) {
        e.preventDefault();
        
        const targetId = e.currentTarget.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Offset pour la nav fixe
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Fermer le menu mobile si ouvert
            if (this.isMobile) {
                this.closeMobileMenu();
            }
        }
    }

    /**
     * Gestion du menu mobile
     */
    toggleMobileMenu() {
        if (this.elements.mainNav && this.elements.mobileMenuToggle) {
            const isOpen = this.elements.mainNav.classList.contains('mobile-open');
            
            if (isOpen) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        }
    }

    /**
     * Ouverture du menu mobile
     */
    openMobileMenu() {
        this.elements.mainNav.classList.add('mobile-open');
        this.elements.mobileMenuToggle.classList.add('active');
        this.elements.mobileMenuToggle.setAttribute('aria-expanded', 'true');
        
        // Désactiver le scroll du body
        document.body.style.overflow = 'hidden';
    }

    /**
     * Fermeture du menu mobile
     */
    closeMobileMenu() {
        this.elements.mainNav.classList.remove('mobile-open');
        this.elements.mobileMenuToggle.classList.remove('active');
        this.elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        
        // Réactiver le scroll du body
        document.body.style.overflow = '';
    }

    /**
     * Gestion du hover sur les émotions
     */
    handleEmotionHover(e) {
        const emotion = e.currentTarget;
        const emotionType = this.getEmotionType(emotion);
        
        // Effet sonore léger (si activé)
        this.playEmotionSound(emotionType);
        
        // Animation du glow
        const glow = emotion.querySelector('.emotion-glow');
        if (glow) {
            glow.style.opacity = '0.2';
        }
    }

    /**
     * Gestion du clic sur les émotions
     */
    handleEmotionClick(e) {
        const emotion = e.currentTarget;
        const emotionType = this.getEmotionType(emotion);
        
        // Animation de "pulse"
        emotion.style.animation = 'gentlePulse 0.6s ease-in-out';
        
        setTimeout(() => {
            emotion.style.animation = '';
        }, 600);
        
        // Affichage d'informations sur l'émotion (optionnel)
        this.showEmotionInfo(emotionType);
    }

    /**
     * Détermination du type d'émotion
     */
    getEmotionType(element) {
        const classes = element.classList;
        
        if (classes.contains('amour')) return 'amour';
        if (classes.contains('rupture')) return 'rupture';
        if (classes.contains('naissance')) return 'naissance';
        if (classes.contains('nouvelles')) return 'nouvelles';
        
        return 'default';
    }

    /**
     * Son léger pour les interactions avec les émotions
     */
    playEmotionSound(emotionType) {
        // Implémentation future pour les effets sonores subtils
        // Cette fonctionnalité peut être activée selon les préférences utilisateur
    }

    /**
     * Affichage d'informations sur l'émotion sélectionnée
     */
    showEmotionInfo(emotionType) {
        const emotionData = {
            amour: {
                title: "L'Amour dans la Correspondance",
                description: "Découvrez comment l'amour s'exprime à travers les timbres et les lettres..."
            },
            rupture: {
                title: "Les Ruptures Épistolaires",
                description: "Explorez les lettres jamais envoyées et les silences postaux..."
            },
            naissance: {
                title: "Naissances et Fins de Vie",
                description: "Des faire-part aux derniers mots, toute une vie en correspondance..."
            },
            nouvelles: {
                title: "Nouvelles du Monde",
                description: "Les échos lointains et les correspondances internationales..."
            }
        };
        
        const info = emotionData[emotionType];
        if (info) {
            console.log(`🎭 ${info.title}: ${info.description}`);
            // Ici on pourrait afficher une modale ou un tooltip avec plus d'informations
        }
    }

    /**
     * Gestion des clics sur les cartes
     */
    handleCardClick(e) {
        const card = e.currentTarget;
        
        // Animation de feedback
        card.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
        
        // Ici on pourrait ajouter une navigation vers plus de détails
    }

    /**
     * Initialisation du système de particules
     */
    initializeParticles() {
        if (this.detectReducedMotion()) return;
        
        this.createParticleContainer();
        this.generateParticles();
    }

    /**
     * Création du conteneur de particules
     */
    createParticleContainer() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'letter-particles';
        document.body.appendChild(particlesContainer);
        
        this.elements.particlesContainer = particlesContainer;
    }

    /**
     * Génération des particules de lettres
     */
    generateParticles() {
        if (!this.elements.particlesContainer) return;
        
        const letters = ['A', 'M', 'O', 'U', 'R', '♥', '✉', '📮', '📝', '💌'];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'letter-particle';
            particle.textContent = letters[Math.floor(Math.random() * letters.length)];
            
            // Position aléatoire
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 20}s`;
            particle.style.animationDuration = `${15 + Math.random() * 10}s`;
            
            this.elements.particlesContainer.appendChild(particle);
        }
    }

    /**
     * Animation des particules
     */
    startParticleAnimation() {
        if (!this.elements.particlesContainer || this.detectReducedMotion()) return;
        
        const particles = this.elements.particlesContainer.querySelectorAll('.letter-particle');
        
        particles.forEach((particle, index) => {
            setTimeout(() => {
                particle.style.animationPlayState = 'running';
            }, index * 2000);
        });
    }

    /**
     * Gestion des événements clavier pour l'accessibilité
     */
    handleKeyDown(e) {
        // Échapper pour fermer le menu mobile
        if (e.key === 'Escape' && this.elements.mainNav.classList.contains('mobile-open')) {
            this.closeMobileMenu();
        }
        
        // Navigation au clavier
        if (e.key === 'Tab') {
            this.handleTabNavigation(e);
        }
    }

    /**
     * Gestion de la navigation au clavier
     */
    handleTabNavigation(e) {
        // Amélioration de l'accessibilité pour la navigation au clavier
        const focusableElements = document.querySelectorAll(`
            a[href], button, input, select, textarea, 
            [tabindex]:not([tabindex="-1"])
        `);
        
        // Logique pour une navigation au clavier fluide
    }

    /**
     * Configuration de l'accessibilité avancée
     */
    setupAccessibility() {
        // Ajout d'attributs ARIA dynamiques
        this.setupAriaLabels();
        
        // Gestion des préférences de mouvement réduit
        this.handleReducedMotion();
        
        // Configuration du contraste élevé
        this.setupHighContrast();
    }

    /**
     * Configuration des labels ARIA
     */
    setupAriaLabels() {
        // Mise à jour des labels pour les éléments interactifs
        this.elements.emotionAlcoves.forEach(alcove => {
            const emotionType = this.getEmotionType(alcove);
            alcove.setAttribute('aria-label', `Explorer l'émotion: ${emotionType}`);
            alcove.setAttribute('role', 'button');
            alcove.setAttribute('tabindex', '0');
        });
        
        // Navigation
        this.elements.navLinks.forEach(link => {
            const section = link.textContent.trim();
            link.setAttribute('aria-label', `Aller à la section ${section}`);
        });
    }

    /**
     * Gestion des mouvements réduits
     */
    handleReducedMotion() {
        if (this.detectReducedMotion()) {
            document.body.classList.add('reduced-motion');
            
            // Désactiver les animations des particules
            if (this.elements.particlesContainer) {
                this.elements.particlesContainer.style.display = 'none';
            }
        }
    }

    /**
     * Détection des préférences de mouvement réduit
     */
    detectReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * Configuration du mode contraste élevé
     */
    setupHighContrast() {
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast');
        }
    }

    /**
     * Détection des préférences utilisateur
     */
    detectUserPreferences() {
        // Thème sombre/clair
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        this.handleThemeChange(prefersDark.matches);
        
        prefersDark.addListener(e => this.handleThemeChange(e.matches));
        
        // Préférences de mouvement
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        prefersReducedMotion.addListener(() => this.handleReducedMotion());
    }

    /**
     * Gestion du changement de thème
     */
    handleThemeChange(isDark) {
        if (isDark) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    /**
     * Initialisation du système de thème
     */
    initializeTheme() {
        // Récupération des préférences sauvegardées
        const savedTheme = localStorage.getItem('leluc-theme');
        
        if (savedTheme) {
            document.body.classList.add(savedTheme);
        }
    }

    /**
     * Gestion du redimensionnement de la fenêtre
     */
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        // Fermer le menu mobile si on passe en desktop
        if (wasMobile && !this.isMobile) {
            this.closeMobileMenu();
        }
        
        // Recalculer les positions pour les animations
        this.recalculateAnimations();
    }

    /**
     * Recalcul des animations après redimensionnement
     */
    recalculateAnimations() {
        // Réinitialisation des observers si nécessaire
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
            this.initializeIntersectionObserver();
        }
    }

    /**
     * Gestion de la fin du chargement de la page
     */
    handlePageLoad() {
        // Initialisation finale après que toutes les ressources soient chargées
        this.finalizeInitialization();
    }

    /**
     * Finalisation de l'initialisation
     */
    finalizeInitialization() {
        // Activation des animations différées
        setTimeout(() => {
            document.body.classList.add('fully-loaded');
        }, 100);
        
        // Nettoyage des listeners temporaires
        this.cleanupTemporaryListeners();
        
        console.log('🚀 Le Luc - Initialisation complète terminée');
    }

    /**
     * Nettoyage des listeners temporaires
     */
    cleanupTemporaryListeners() {
        // Suppression des event listeners qui ne sont plus nécessaires
    }

    /**
     * Fonction throttle pour optimiser les performances
     */
    throttle(func, limit) {
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

    /**
     * Fonction debounce pour optimiser les performances
     */
    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    new LeLucSite();
});

// Initialisation de AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-quart',
            once: true,
            offset: 100,
            disable: function() {
                return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            }
        });
    }
});

// Gestion des erreurs JavaScript
window.addEventListener('error', (e) => {
    console.error('🚨 Erreur JavaScript:', e.error);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('📊 Temps de chargement:', Math.round(perfData.loadEventEnd - perfData.fetchStart), 'ms');
        }, 0);
    });
}