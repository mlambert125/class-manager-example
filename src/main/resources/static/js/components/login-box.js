import { session } from '../classroom-api-session.js';

/**
 * View HTML for this component
 */
const view = /*html*/`
<style>
    :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: 50px;
        padding: 3rem;
        box-shadow: 5px 5px 5px lightsteelblue;
        background-color: white;

        h1 {
            text-align: center;
            margin-top: 0;
            margin-bottom: 2rem;
        }
        .login-error {
            color: darkred;
            margin-bottom: 1rem;
        }
        form {
            width: 500px;
            display: flex;
            flex-direction: column;
            align-items: end;
            justify-content: end;

            label {
                display: grid;
                grid-template-columns: 1fr 2fr;
                align-items: end;
                margin-bottom: 1rem;
                width: 100%;

                input {
                    padding: 0.5rem;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    &:focus {
                        outline: 1px solid steelblue;
                    }
                }
            }

            button {
                width: 150px;
                cursor: pointer;
            }
        }
    }
</style>
<div>
    <h1>Login</h1>
    <span id="login-error"></span>
    <form id="login-form">
        <label>
            <span>Username:</span>
            <input type="text" name="username" required>
        </label>
        <label>
            <span>Password:</span>
            <input type="password" name="password" required>
        </label>
        <button type="submit">Login</button>
    </form>
</div>
`

/**
 * LoginBox component
 */
class LoginBox extends HTMLElement {
    /**
     * Constructor
     */
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = view;
    }

    /**
     * Connected callback
     */
    connectedCallback() {
        this.shadowRoot.getElementById('login-form').addEventListener('submit', event => {
            event.preventDefault();
            this.login();
        });
    }

    /**
     * Login
     * 
     * @returns {Promise<void>}
     */
    async login() {
        const username = 
            /** @type HTMLInputElement */
            (this.shadowRoot.getElementById('login-form').querySelector('input[name="username"]')).value;
        const password = 
            /** @type HTMLInputElement */
            (this.shadowRoot.getElementById('login-form').querySelector('input[name="password"]')).value;

        const success = await session.login(username, password);
        
        if (success) {
            this.dispatchEvent(new CustomEvent('login-success'));
        } else {
            this.shadowRoot.getElementById('login-error').textContent = 'Invalid username or password';
        }
    }
}

customElements.define('login-box', LoginBox);
