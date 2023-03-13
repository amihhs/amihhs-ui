export class Button extends HTMLButtonElement {
  constructor() {
    super()
  }
}

customElements.define('amihhs-button', Button, { extends: 'button' })
