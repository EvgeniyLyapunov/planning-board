import { v4 as uuidv4 } from 'uuid';
import Card from '../card/Card';
import { saveData } from '../utils/storage';

import './create-card.scss';

class CreateCard {
  constructor(parentEl, board) {
    this.parentEl = parentEl;
    this.board = board;

    this.bindToDOM = this.bindToDOM.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  static get markUp() {
    return `
      <input class="add-card__input add-card__input-title" type="text" name="title"
        placeholder="Заголовок напишите здесь...">
      <textarea class="add-card__input add-card__input-text" type="text" rows="3" name="text"
        placeholder="Текст будет здесь..."></textarea>
      <div class="add-card__btn-block">
        <input class="add-card__submit" type="submit" value="Готово">
        <input class="add-card__close" type="button" value="&#10006;">
      </div>
    `;
  }

  bindToDOM() {
    this.element = document.createElement('form');
    this.element.classList.add('add-card');
    this.element.innerHTML = CreateCard.markUp;
    this.parentEl.insertAdjacentElement('beforeend', this.element);

    const submitBtn = this.element.querySelector('.add-card__submit');
    submitBtn.addEventListener('click', this.onSubmit);
    const closeBtn = this.element.querySelector('.add-card__close');
    closeBtn.addEventListener('click', this.onClose);
  }

  onSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this.element).entries());
    data.id = uuidv4();
    const { list } = this.parentEl.dataset;
    this.board[`${list}`].push(data);

    const card = new Card(this.parentEl, data);
    this.element.remove();
    card.bindToDOM(this.board.onMouseDown);
    this.board.isCreating = false;
    saveData(this.board.todo, this.board.progress, this.board.done);
  }

  onClose(e) {
    e.preventDefault();
    this.element.remove();
    this.board.isCreating = false;
  }
}

export default CreateCard;
