import Component from "../../scripts/component.js";

window.customElements.define('web-blog', class extends Component {
    constructor() {
        super();

        const toc = [...this.querySelectorAll('h2')].map((heading) => {
            return `<li><a href="#${heading.id}">${heading.textContent}</a></li>`;
        }).join('');

        const author = document.head.querySelector('meta[name="published-by"]').content;
        const date = document.head.querySelector('meta[name="published-at"]').content;

        this.querySelector('[slot="toc"] ul').innerHTML = toc;
        this.querySelector('[slot="share"] p').textContent = `Published by ${author} - ${new Date(date).toLocaleDateString()}`;
    }
});
