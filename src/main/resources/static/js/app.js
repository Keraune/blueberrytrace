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

const initializeProductionTables = (scope = document) => {
    const normalize = value => (value || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    scope.querySelectorAll('[data-table-search]').forEach(input => {
        if (input.dataset.tableSearchReady === 'true') {
            return;
        }
        input.dataset.tableSearchReady = 'true';
        const tableSelector = input.getAttribute('data-table-search');
        const table = document.querySelector(tableSelector);
        if (!table) {
            return;
        }

        const applySearch = () => {
            const term = normalize(input.value);
            table.querySelectorAll('tbody tr').forEach(row => {
                const matchesText = normalize(row.textContent).includes(term);
                const activeStatus = table.dataset.activeStatus || '';
                const matchesStatus = !activeStatus || normalize(row.dataset.status) === normalize(activeStatus);
                row.hidden = !(matchesText && matchesStatus);
            });
        };

        input.addEventListener('input', applySearch);
        applySearch();
    });

    scope.querySelectorAll('[data-table-filter]').forEach(group => {
        if (group.dataset.tableFilterReady === 'true') {
            return;
        }
        group.dataset.tableFilterReady = 'true';
        const table = document.querySelector(group.getAttribute('data-table-filter'));
        if (!table) {
            return;
        }

        group.querySelectorAll('[data-status-filter]').forEach(button => {
            button.addEventListener('click', () => {
                group.querySelectorAll('[data-status-filter]').forEach(item => item.classList.remove('active'));
                button.classList.add('active');
                table.dataset.activeStatus = button.getAttribute('data-status-filter') || '';
                const linkedSearch = document.querySelector(`[data-table-search="#${table.id}"]`);
                linkedSearch?.dispatchEvent(new Event('input', { bubbles: true }));
                if (!linkedSearch) {
                    table.querySelectorAll('tbody tr').forEach(row => {
                        const activeStatus = table.dataset.activeStatus || '';
                        row.hidden = activeStatus && normalize(row.dataset.status) !== normalize(activeStatus);
                    });
                }
            });
        });
    });
};

document.addEventListener('DOMContentLoaded', () => initializeProductionTables(document));
document.body?.addEventListener('htmx:afterSwap', event => initializeProductionTables(event.detail.target || document));

const showHtmxErrorToast = message => {
    document.querySelectorAll('.htmx-error-toast').forEach(item => item.remove());
    const toast = document.createElement('div');
    toast.className = 'htmx-error-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(() => {
        toast.classList.add('is-hiding');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 3600);
};

const restoreSubmitButtons = (scope = document) => {
    scope.querySelectorAll('button.is-loading').forEach(button => {
        button.classList.remove('is-loading');
        if (button.dataset.originalText) {
            button.textContent = button.dataset.originalText;
            delete button.dataset.originalText;
        }
    });
};

document.body?.addEventListener('htmx:afterRequest', event => {
    document.body.classList.remove('htmx-busy');
    restoreSubmitButtons(event.detail.elt || document);
});

document.body?.addEventListener('htmx:responseError', () => {
    document.body.classList.remove('htmx-busy');
    showHtmxErrorToast('No se pudo actualizar la vista. Verifica la conexión o intenta nuevamente.');
});

document.body?.addEventListener('htmx:sendError', () => {
    document.body.classList.remove('htmx-busy');
    showHtmxErrorToast('No se pudo enviar la solicitud. Intenta nuevamente.');
});

document.body?.addEventListener('htmx:afterSwap', event => {
    const target = event.detail.target;
    const moduleContent = target?.id === 'module-content' ? target : target?.querySelector?.('#module-content');
    if (moduleContent) {
        const alert = moduleContent.querySelector('.lote-alert');
        const invalidField = moduleContent.querySelector('.field-error:not(:empty)');
        if (alert || invalidField) {
            moduleContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
});
