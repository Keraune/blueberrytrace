const getCsrfHeaders = () => {
    const token = document.querySelector('meta[name="_csrf"]')?.getAttribute('content');
    const header = document.querySelector('meta[name="_csrf_header"]')?.getAttribute('content');
    return token && header ? { [header]: token } : {};
};

const initializeBlueberryTraceUi = (scope = document) => {
    document.body.classList.add('page-ready');

    const animatedSelectors = [
        '.panel-card',
        '.metric-card',
        '.stat-card',
        '.kpi-card',
        '.analytics-card',
        '.dashboard-hero-copy',
        '.dashboard-hero-panel',
        '.production-kpi-card',
        '.production-chart-card',
        '.page-heading',
        '.landing-hero-copy',
        '.landing-hero-side',
        '.landing-section-dark',
        '.auth-clean-card',
        '.executive-hero',
        '.section-ribbon'
    ];

    scope.querySelectorAll(animatedSelectors.join(',')).forEach((el, index) => {
        if (el.dataset.uiAnimated === 'true') {
            return;
        }
        el.dataset.uiAnimated = 'true';
        el.style.animationDelay = `${Math.min(index * 28, 520)}ms`;
        el.classList.add('fade-up-in');
    });

    scope.querySelectorAll('a[href^="#"]').forEach(link => {
        if (link.dataset.smoothScrollReady === 'true') {
            return;
        }
        link.dataset.smoothScrollReady = 'true';
        link.addEventListener('click', event => {
            const id = link.getAttribute('href');
            const target = document.querySelector(id);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    const accountMenu = document.querySelector('[data-account-menu]');
    const accountToggle = document.querySelector('[data-account-toggle]');

    if (accountMenu && accountToggle && accountMenu.dataset.accountReady !== 'true') {
        accountMenu.dataset.accountReady = 'true';
        const closeMenu = () => accountMenu.classList.remove('open');
        const toggleMenu = event => {
            event.stopPropagation();
            accountMenu.classList.toggle('open');
        };

        accountToggle.addEventListener('click', toggleMenu);
        document.addEventListener('click', event => {
            if (!accountMenu.contains(event.target)) {
                closeMenu();
            }
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                closeMenu();
            }
        });
    }

    const moduleSearch = document.querySelector('[data-module-search]');
    const moduleItems = Array.from(document.querySelectorAll('[data-module-item]'));

    if (moduleSearch && moduleItems.length && moduleSearch.dataset.moduleSearchReady !== 'true') {
        moduleSearch.dataset.moduleSearchReady = 'true';
        moduleSearch.addEventListener('input', () => {
            const term = moduleSearch.value.trim().toLowerCase();
            moduleItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(term) ? '' : 'none';
            });
        });

        document.addEventListener('keydown', event => {
            const isMac = navigator.platform.toUpperCase().includes('MAC');
            const shortcutPressed = (isMac ? event.metaKey : event.ctrlKey) && event.key.toLowerCase() === 'k';
            if (shortcutPressed) {
                event.preventDefault();
                moduleSearch.focus();
                moduleSearch.select();
            }
        });
    }

    scope.querySelectorAll('.primary-btn, .ghost-btn, .table-link, .table-action-btn, .module-tile-grid a, .quick-grid a').forEach(button => {
        if (button.dataset.rippleReady === 'true') {
            return;
        }
        button.dataset.rippleReady = 'true';
        button.classList.add('ripple-ready');
        button.addEventListener('click', event => {
            const rect = button.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ui-ripple';
            ripple.style.left = `${event.clientX - rect.left}px`;
            ripple.style.top = `${event.clientY - rect.top}px`;
            button.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });

    scope.querySelectorAll('form').forEach(form => {
        if (form.dataset.submitStateReady === 'true') {
            return;
        }
        form.dataset.submitStateReady = 'true';
        form.addEventListener('submit', () => {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton && !submitButton.dataset.keepText) {
                submitButton.dataset.originalText = submitButton.textContent.trim();
                submitButton.classList.add('is-loading');
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initializeBlueberryTraceUi(document);
});

document.body?.addEventListener('htmx:configRequest', event => {
    Object.assign(event.detail.headers, getCsrfHeaders());
});

document.body?.addEventListener('htmx:beforeRequest', () => {
    document.body.classList.add('htmx-busy');
});

document.body?.addEventListener('htmx:afterRequest', () => {
    document.body.classList.remove('htmx-busy');
});

document.body?.addEventListener('htmx:afterSwap', event => {
    initializeBlueberryTraceUi(event.detail.target || document);
});
