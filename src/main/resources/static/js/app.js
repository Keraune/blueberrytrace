document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-ready');

    document.querySelectorAll('.panel-card, .metric-card, .landing-content, .landing-card, .dark-module-card, .dark-info-card, .dark-step, .floating-card').forEach((el, i) => {
        el.style.animationDelay = `${i * 45}ms`;
        el.classList.add('fade-up-in');
    });

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const id = link.getAttribute('href');
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => el.classList.add('hovered-ui'));
        el.addEventListener('mouseleave', () => el.classList.remove('hovered-ui'));
    });
});
