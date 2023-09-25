import './card.scss';

class Card {
  constructor(parentEl, data) {
    this.parentEl = parentEl;
    this.data = data;

    this.bindToDOM = this.bindToDOM.bind(this);
  }

  markUp() {
    return `
      <div class="card__header">
        <h3 class="card__title">${this.data.title}</h3>
        <span class="card__delete">&#10006;</span>
      </div>
      <p class="card__text">${this.data.text}</p>
    `;
  }

  bindToDOM(onMouseDown) {
    this.element = document.createElement('div');
    this.element.classList.add('card');
    this.element.dataset.id = this.data.id;
    this.element.innerHTML = this.markUp();

    this.parentEl.insertAdjacentElement('beforeend', this.element);
    this.element.addEventListener('mousedown', onMouseDown);
  }
}

export default Card;
