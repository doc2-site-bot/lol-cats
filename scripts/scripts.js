const variableMap = {
    year: new Date().getFullYear()
};

// Non LCP components
const lazyComponents = [
    'columns',
    'stories',
    'youtube',
    'contact'
];

// Build lazy component selector
let lazyComponentSel = lazyComponents.map(name => `web-${name}`);
// Add potential items
lazyComponentSel.forEach(name => lazyComponentSel.push(`${name}-item`));
lazyComponentSel = lazyComponentSel.join(',');

const loadLazyComponent = (component) => {
    const name = component.tagName.toLowerCase().replace('web-', '');
    const template = document.head.querySelector(`template[src*="${name}.js"]`);
    if (template) {
        const script = document.createElement('script');
        [...template.attributes].forEach( attr => { script.setAttribute(attr.nodeName ,attr.nodeValue) });
        document.head.append(script);
        template.remove();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Hydrate on user interaction
    let isHydrated = false;
    const hydrate = () => {
        if (!isHydrated) {
            document.body.querySelectorAll(lazyComponentSel).forEach((component) => {
                loadLazyComponent(component);
            });

            isHydrated = true;
        }
    };
    window.addEventListener('scroll', hydrate, { once: true, passive: true });
    window.addEventListener('mousemove', hydrate, { once: true, passive: true });
    window.addEventListener('touchmove', hydrate, { once: true, passive: true });
    window.addEventListener('keydown', hydrate, { once: true, passive: true });

    if (window.scrollY !== 0) {
        hydrate();
    }

    // Replace variables
    document.body.querySelectorAll('var').forEach((variable) => {
        const value = variableMap[variable.textContent];
        if (value) {
            variable.outerHTML = `<span>${value}</span>`
        }
    });

    const { pathname } = new URL(location.href);

    let oldPage = document.querySelector('header li a.current');
    let currentPage = document.querySelector(`header li a[href="${pathname}"]`);

    // Highlight current page in nav
    if (oldPage !== currentPage) {
        if (oldPage) {
            oldPage.classList.remove('current');
        }
        if (currentPage) {
            currentPage.classList.add('current');
        }
    }
});
