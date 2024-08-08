import Component from "../../scripts/component.js";

window.customElements.define('web-contact', class extends Component {
    constructor() {
        super();
    }

    connectedCallback() {
        const [spreadsheetId, sheetId] = this.getAttribute('submissions').split('/').slice(-2);

        const form = this.shadowRoot.querySelector('form');
        const button = form.querySelector('button');

        form.onsubmit = async (event) => {
            event.preventDefault();

            button.disabled = true;

            const formData = new FormData(form);
            const req = await fetch(`https://api.doc2.site/v1/spreadsheets/${spreadsheetId}/${sheetId}`, {
                headers: {
                    'content-type': 'application/json'
                },
                method: 'PATCH',
                body: JSON.stringify({
                    'cf-turnstile-response': formData.get('cf-turnstile-response'),
                    operation: 'append',
                    rows: [{
                        name: formData.get('name'),
                        submission: formData.get('submission'),
                        date: new Date().toISOString()
                    }]
                }),
            });

            if (req.ok) {
                form.querySelector('div:last-of-type').hidden = false;
            }
            else {
                button.disabled = false;
            }
        }

        window.onloadTurnstileCallback = function () {
            window.turnstile.render('.cf-turnstile', {
                callback: function(token) {
                    form.insertAdjacentHTML('beforeend', `<input type="hidden" name="cf-turnstile-response" value="${token}"/>`);
                },
            });
        };

        // Load turnstile
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onloadTurnstileCallback';
        document.head.append(script);
    }
});
