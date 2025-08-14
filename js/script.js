/**
 * ESCRITA MESTRA - JAVASCRIPT PRINCIPAL
 * Funcionalidades: Menu responsivo, rolagem suave, animações e formulário de contato
 */

// ===== CONFIGURAÇÕES GLOBAIS =====
const CONFIG = {
    scrollOffset: 80, // Offset para compensar o header fixo
    animationDelay: 100, // Delay entre animações em sequência
    formSubmitDelay: 2000 // Tempo de simulação de envio do formulário
};

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===== FUNÇÃO PARA ABRIR CHATBOT PARA ORÇAMENTO =====
function openChatbotForQuote() {
    // Verificar se o chatbot existe
    if (window.chatbotInstance) {
        window.chatbotInstance.openChatbot();
        // Definir o tipo de solicitação como "Orçamento"
        window.chatbotInstance.userData.tipoSolicitacao = 'Orçamento';
    }
}

function initializeApp() {
    console.log('🚀 Escrita Mestra - Site inicializado');
    
    // Inicializar funcionalidades
    initSmoothScrolling();
    initNavbarEffects();
    initAnimations();
    initContactForm();
    initMobileMenu();
    initScrollToTop();
    
    console.log('✅ Todas as funcionalidades carregadas');
}

// ===== ROLAGEM SUAVE =====
function initSmoothScrolling() {
    // Selecionar todos os links de âncora
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Verificar se é um link de âncora válido
            if (href === '#' || href === '#home') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calcular posição com offset
                const targetPosition = targetElement.offsetTop - CONFIG.scrollOffset;
                
                // Rolagem suave
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Fechar menu mobile se estiver aberto
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            }
        });
    });
}

// ===== EFEITOS DA NAVBAR =====
function initNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;
    
    // Efeito de scroll na navbar
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Destacar link ativo baseado na seção visível
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - CONFIG.scrollOffset - 50;
            const sectionHeight = section.offsetHeight;
            
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Se estiver no topo da página
        if (scrollTop < 100) {
            current = 'home';
        }
        
        // Atualizar links ativos
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===== ANIMAÇÕES DE ENTRADA =====
function initAnimations() {
    // Configurar Intersection Observer para animações
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animar elementos filhos com delay
                const children = entry.target.querySelectorAll('.card, .service-card, .link-card');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, index * CONFIG.animationDelay);
                });
            }
        });
    }, observerOptions);
    
    // Observar seções para animação
    const animatedSections = document.querySelectorAll('section');
    animatedSections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    // Observar cards individuais
    const cards = document.querySelectorAll('.card, .service-card, .link-card');
    cards.forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });
}

// ===== MENU MOBILE =====
function initMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (!navbarToggler || !navbarCollapse) return;
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
        const isClickInsideNav = navbarCollapse.contains(e.target) || navbarToggler.contains(e.target);
        
        if (!isClickInsideNav && navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });
    
    // Fechar menu ao redimensionar janela
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });
}

// ===== FORMULÁRIO DE CONTATO =====
function initContactForm() {
    // Newsletter Form Handling
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('newsletterEmail');
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            // Validate email
            if (!emailInput.value || !isValidEmail(emailInput.value)) {
                showNotification('Por favor, insira um e-mail válido.', 'error');
                return;
            }
            
            // Show loading state
            btnText.classList.add('d-none');
            btnLoading.classList.remove('d-none');
            submitBtn.disabled = true;
            
            // Simulate newsletter subscription
            setTimeout(() => {
                // Reset button state
                btnText.classList.remove('d-none');
                btnLoading.classList.add('d-none');
                submitBtn.disabled = false;
                
                // Show success message
                showNotification('Inscrição realizada com sucesso! Verifique seu e-mail.', 'success');
                
                // Reset form
                newsletterForm.reset();
                
                // Track event
                trackEvent('Newsletter', 'Subscribe', emailInput.value);
            }, 2000);
        });
    }

    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar formulário
        if (!validateForm(this)) {
            showFormMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        // Simular envio
        submitForm(this);
    });
    
    // Validação em tempo real
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Remover classe de erro ao digitar
            this.classList.remove('is-invalid');
        });
    });
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Verificar se campo obrigatório está preenchido
    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }
    
    // Validação específica por tipo
    if (value) {
        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                }
                break;
            case 'tel':
                const phoneRegex = /^[\d\s\(\)\+\-]{10,}$/;
                if (!phoneRegex.test(value)) {
                    isValid = false;
                }
                break;
        }
    }
    
    // Aplicar classes de validação
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
    }
    
    return isValid;
}

function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Estado de loading
    submitBtn.disabled = true;
    btnText.classList.add('d-none');
    btnLoading.classList.remove('d-none');
    
    // Simular envio (substituir por integração real)
    setTimeout(() => {
        // Resetar botão
        submitBtn.disabled = false;
        btnText.classList.remove('d-none');
        btnLoading.classList.add('d-none');
        
        // Mostrar mensagem de sucesso
        showFormMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        
        // Limpar formulário
        form.reset();
        
        // Remover classes de validação
        const formFields = form.querySelectorAll('.form-control, .form-select');
        formFields.forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });
        
    }, CONFIG.formSubmitDelay);
}

function showFormMessage(message, type) {
    // Remover mensagem anterior se existir
    const existingAlert = document.querySelector('.form-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Criar nova mensagem
    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
    const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
    
    const alertHTML = `
        <div class="alert ${alertClass} alert-dismissible fade show form-alert mt-3" role="alert">
            <i class="fas ${iconClass} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    // Inserir mensagem após o formulário
    const contactForm = document.getElementById('contactForm');
    contactForm.insertAdjacentHTML('afterend', alertHTML);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        const alert = document.querySelector('.form-alert');
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000);
}

// ===== BOTÃO VOLTAR AO TOPO =====
function initScrollToTop() {
    // Criar botão se não existir
    let scrollTopBtn = document.getElementById('scrollTopBtn');
    
    if (!scrollTopBtn) {
        scrollTopBtn = document.createElement('button');
        scrollTopBtn.id = 'scrollTopBtn';
        scrollTopBtn.className = 'btn btn-primary position-fixed';
        scrollTopBtn.style.cssText = `
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollTopBtn.title = 'Voltar ao topo';
        
        document.body.appendChild(scrollTopBtn);
    }
    
    // Mostrar/ocultar botão baseado no scroll
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    
    // Ação do botão
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== UTILITÁRIOS =====

// Debounce para otimizar eventos de scroll/resize
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

// Throttle para eventos frequentes
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

// Detectar dispositivo móvel
function isMobile() {
    return window.innerWidth <= 768;
}

// Detectar se elemento está visível na viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification messages
function showNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification-toast');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification-toast alert ${type === 'success' ? 'alert-success' : 'alert-danger'} position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
    notification.innerHTML = `
        <i class="fas ${iconClass} me-2"></i>
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// ===== TRATAMENTO DE ERROS =====
window.addEventListener('error', function(e) {
    console.error('❌ Erro JavaScript:', e.error);
});

// ===== PERFORMANCE =====

// Otimizar eventos de scroll
const optimizedScrollHandler = throttle(function() {
    // Handlers de scroll otimizados já implementados acima
}, 16); // ~60fps

// Preload de recursos críticos
function preloadCriticalResources() {
    const criticalImages = [
        // Adicionar URLs de imagens críticas aqui
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// ===== ANALYTICS E TRACKING (OPCIONAL) =====
function trackEvent(category, action, label) {
    // Implementar tracking de eventos aqui
    // Exemplo: Google Analytics, Facebook Pixel, etc.
    console.log('📊 Event tracked:', { category, action, label });
}

// Rastrear cliques em botões importantes
document.addEventListener('click', function(e) {
    const target = e.target.closest('a, button');
    
    if (target) {
        // WhatsApp
        if (target.href && target.href.includes('whatsapp')) {
            trackEvent('Contact', 'WhatsApp Click', 'Header/Footer');
        }
        
        // Links externos
        if (target.href && target.target === '_blank') {
            trackEvent('External Link', 'Click', target.href);
        }
        
        // Formulário
        if (target.type === 'submit') {
            trackEvent('Form', 'Submit Attempt', 'Contact Form');
        }
    }
});

// ===== ACESSIBILIDADE =====

// Melhorar navegação por teclado
document.addEventListener('keydown', function(e) {
    // ESC para fechar menu mobile
    if (e.key === 'Escape') {
        const navbarCollapse = document.querySelector('.navbar-collapse.show');
        if (navbarCollapse) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    }
});

// Anunciar mudanças para leitores de tela
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// CHATBOT 
class Chatbot {
    constructor() {
        this.currentStep = 0;
        this.userData = {
            nome: '',
            email: '',
            telefone: '',
            tipoSolicitacao: '',
            mensagem: ''
        };
        this.steps = [
            {
                question: 'Olá! 👋 Bem-vindo(a) ao atendimento da Escrita Mestra! Para começar, qual é o seu nome completo?',
                field: 'nome',
                type: 'text'
            },
            {
                question: function() {
                    return `Prazer em conhecê-lo(a), ${this.userData.nome}! Agora, qual é o seu e-mail?`;
                },
                field: 'email',
                type: 'email'
            },
            {
                question: 'Perfeito! Qual é o seu telefone/WhatsApp?',
                field: 'telefone',
                type: 'tel'
            },
            {
                question: 'Ótimo! Agora me diga, qual é o tipo da sua solicitação?',
                field: 'tipoSolicitacao',
                type: 'options',
                options: ['Dúvida', 'Orçamento', 'Suporte', 'Outro']
            },
            {
                question: 'Por último, descreva detalhadamente sua solicitação ou dúvida:',
                field: 'mensagem',
                type: 'textarea'
            }
        ];
        this.init();
    }

    init() {
        this.bindEvents();
        this.addBotMessage(this.steps[0].question);
        this.showInput();
    }

    bindEvents() {
        const chatbotIcon = document.getElementById('chatbot-icon');
        const chatbotClose = document.getElementById('chatbot-close');
        const chatbotSend = document.getElementById('chatbot-send');
        const chatbotInput = document.getElementById('chatbot-input');

        chatbotIcon.addEventListener('click', () => this.toggleChatbot());
        chatbotClose.addEventListener('click', () => this.closeChatbot());
        chatbotSend.addEventListener('click', () => this.sendMessage());
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    toggleChatbot() {
        const chatbotWindow = document.getElementById('chatbot-window');
        const isVisible = chatbotWindow.style.display === 'flex';
        
        if (isVisible) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }

    openChatbot() {
        const chatbotWindow = document.getElementById('chatbot-window');
        chatbotWindow.style.display = 'flex';
        document.getElementById('chatbot-input').focus();
    }

    closeChatbot() {
        const chatbotWindow = document.getElementById('chatbot-window');
        chatbotWindow.style.display = 'none';
    }

    addBotMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chatbot-message bot';
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = message;
        
        messageDiv.appendChild(bubble);
        messagesContainer.appendChild(messageDiv);
        
        this.scrollToBottom();
    }

    addUserMessage(message) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chatbot-message user';
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = message;
        
        messageDiv.appendChild(bubble);
        messagesContainer.appendChild(messageDiv);
        
        this.scrollToBottom();
    }

    showInput() {
        const currentStepData = this.steps[this.currentStep];
        const inputContainer = document.getElementById('chatbot-input-container');
        
        if (currentStepData.type === 'options') {
            this.showOptions(currentStepData.options);
            inputContainer.style.display = 'none';
        } else {
            inputContainer.style.display = 'flex';
            const input = document.getElementById('chatbot-input');
            input.type = currentStepData.type === 'email' ? 'email' : 
                       currentStepData.type === 'tel' ? 'tel' : 'text';
            input.placeholder = this.getPlaceholder(currentStepData.type);
            input.focus();
        }
    }

    showOptions(options) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'chatbot-options';
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'chatbot-option';
            button.textContent = option;
            button.addEventListener('click', () => this.selectOption(option));
            optionsDiv.appendChild(button);
        });
        
        messagesContainer.appendChild(optionsDiv);
        this.scrollToBottom();
    }

    selectOption(option) {
        this.addUserMessage(option);
        this.processAnswer(option);
        
        // Remove options after selection
        const options = document.querySelector('.chatbot-options');
        if (options) {
            options.remove();
        }
    }

    getPlaceholder(type) {
        switch (type) {
            case 'email':
                return 'seu@email.com';
            case 'tel':
                return '(00) 00000-0000';
            case 'textarea':
                return 'Descreva sua solicitação...';
            default:
                return 'Digite sua resposta...';
        }
    }

    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        if (!this.validateInput(message)) {
            this.addBotMessage('Por favor, verifique se as informações estão corretas e tente novamente.');
            return;
        }
        
        this.addUserMessage(message);
        this.processAnswer(message);
        input.value = '';
    }

    validateInput(message) {
        const currentStepData = this.steps[this.currentStep];
        
        switch (currentStepData.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(message);
            case 'tel':
                const phoneRegex = /^[\d\s\(\)\-\+]{10,}$/;
                return phoneRegex.test(message);
            default:
                return message.length >= 2;
        }
    }

    processAnswer(answer) {
        const currentStepData = this.steps[this.currentStep];
        this.userData[currentStepData.field] = answer;
        
        this.currentStep++;
        
        if (this.currentStep < this.steps.length) {
            setTimeout(() => {
                const nextStep = this.steps[this.currentStep];
                const question = typeof nextStep.question === 'function' 
                    ? nextStep.question.call(this) 
                    : nextStep.question;
                this.addBotMessage(question);
                this.showInput();
            }, 1000);
        } else {
            this.finishConversation();
        }
    }

    finishConversation() {
        setTimeout(() => {
            this.addBotMessage('Perfeito! Recebi todas as informações. Vou redirecionar você para o WhatsApp com sua mensagem já preenchida. 📱');
            
            setTimeout(() => {
                this.redirectToWhatsApp();
            }, 2000);
        }, 1000);
    }

    redirectToWhatsApp() {
        const message = this.formatWhatsAppMessage();
        const phoneNumber = '5583993193241';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
        
        // Reset chatbot after redirect
        setTimeout(() => {
            this.resetChatbot();
        }, 1000);
    }

    formatWhatsAppMessage() {
        return `*SOLICITAÇÃO - ESCRITA MESTRA*\n\n` +
               `*Nome:* ${this.userData.nome}\n` +
               `*E-mail:* ${this.userData.email}\n` +
               `*Telefone:* ${this.userData.telefone}\n` +
               `*Tipo de Solicitação:* ${this.userData.tipoSolicitacao}\n\n` +
               `*Mensagem:*\n${this.userData.mensagem}\n\n` +
               `_Mensagem enviada através do site escritamestra.com_`;
    }

    resetChatbot() {
        this.currentStep = 0;
        this.userData = {
            nome: '',
            email: '',
            telefone: '',
            tipoSolicitacao: '',
            mensagem: ''
        };
        
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.innerHTML = '';
        
        this.addBotMessage(this.steps[0].question);
        this.showInput();
        this.closeChatbot();
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatbotInstance = new Chatbot();
});

console.log('🎉 Escrita Mestra - JavaScript carregado com sucesso!');
console.log('🤖 Chatbot inicializado com sucesso!');