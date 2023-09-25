import CreateCard from '../create-card/CreateCard';
import Card from '../card/Card';
import checkCardClasses from '../utils/checkCardClasses';
import { saveData, loadData } from '../utils/storage';

import './board.scss';

class Board {
  constructor(parentEl) {
    this.parentEl = parentEl;

    this.todo = [];
    this.progress = [];
    this.done = [];

    this.draggableElement = null;
    this.shadowCard = null;
    this.shadowCardNameList = null;
    this.draggableElementNameList = null;

    this.isCreating = false;

    this.bindToDOM = this.bindToDOM.bind(this);
    this.setShadowElement = this.setShadowElement.bind(this);
    this.onCreateCard = this.onCreateCard.bind(this);
    this.onDeleteCard = this.onDeleteCard.bind(this);
    this.onLoadCardsFromStorage = this.onLoadCardsFromStorage.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  static get markUp() {
    return `
    <div class="board__col">
        <h2 class="board__col-title board__col-title_todo">Планы</h2>
        <div class="board__col-list" data-list="todo"></div>
        <button class="board__col-btn">&#10010; Добавить карточку</button>
      </div>
      <div class="board__col">
        <h2 class="board__col-title board__col-title_progress">В процессе</h2>
        <div class="board__col-list" data-list="progress"></div>
        <button class="board__col-btn">&#10010; Добавить карточку</button>
      </div>
      <div class="board__col">
        <h2 class="board__col-title board__col-title_done">Завершено</h2>
        <div class="board__col-list" data-list="done"></div>
        <button class="board__col-btn">&#10010; Добавить карточку</button>
      </div>
    `;
  }

  bindToDOM() {
    this.element = document.createElement('div');
    this.element.classList.add('board');
    this.element.innerHTML = Board.markUp;

    this.parentEl.appendChild(this.element);

    const buttons = this.element.querySelectorAll('.board__col-btn');
    buttons.forEach((button) => {
      button.addEventListener('click', this.onCreateCard);
    });

    this.allLists = this.element.querySelectorAll('.board__col-list');
    this.allLists.forEach((list) => list.addEventListener('click', this.onDeleteCard));

    this.onLoadCardsFromStorage();
  }

  onCreateCard(e) {
    if (!this.isCreating) {
      const form = new CreateCard(e.target.previousElementSibling, this);
      form.bindToDOM();
      e.target.previousElementSibling.scrollTop = 1e9;
      this.isCreating = true;
    }
  }

  onDeleteCard(e) {
    if (e.target.classList.contains('card__delete')) {
      const card = e.target.parentElement.parentElement;
      const { id } = card.dataset;
      const columnList = e.currentTarget.dataset.list;
      this[`${columnList}`] = this[`${columnList}`].filter(
        (item) => item.id !== id,
      );
      card.remove();
      saveData(this.todo, this.progress, this.done);
    }
  }

  onLoadCardsFromStorage() {
    try {
      const data = loadData();
      if (data) {
        this.allLists.forEach((listElement, i) => {
          if (data[i].length > 0) {
            data[i].forEach((item) => {
              const card = new Card(listElement, item);
              card.bindToDOM(this.onMouseDown);
            });
            const listName = listElement.dataset.list;
            this[`${listName}`] = data[i];
          }
        });
      }
    } catch {
      // ignore
    }
  }

  setShadowElement(width, height) {
    this.shadowCard = document.createElement('div');
    this.shadowCard.classList.add('shadow-card');
    this.shadowCard.style.width = `${width}px`;
    this.shadowCard.style.height = `${height}px`;

    if (this.siblingOfDraggableElement) {
      this.siblingOfDraggableElement.insertAdjacentElement(
        'afterend',
        this.shadowCard,
      );
    } else {
      this.draggableElement.parentElement.insertAdjacentElement(
        'afterbegin',
        this.shadowCard,
      );
    }
  }

  onMouseDown(e) {
    e.preventDefault();
    if (checkCardClasses(e.target) === false) {
      return;
    }
    this.draggableElement = checkCardClasses(e.target);
    this.draggableElementNameList = this.draggableElement.parentElement.dataset.list;

    this.siblingOfDraggableElement = this.draggableElement.previousElementSibling;

    const cardWidth = this.draggableElement.offsetWidth;
    const cardHeight = this.draggableElement.offsetHeight;
    this.draggableElement.style.width = `${cardWidth}px`;
    this.draggableElement.style.height = `${cardHeight}px`;

    const { top, left } = this.draggableElement.getBoundingClientRect();
    this.cursorInCardY = e.clientY - top;
    this.cursorInCardX = e.clientX - left;

    this.draggableElement.classList.add('dragged');
    this.setShadowElement(cardWidth, cardHeight);
    this.shadowCardNameList = this.shadowCard.parentElement.dataset.list;

    this.draggableElement.style.top = `${e.clientY - this.cursorInCardY}px`;
    this.draggableElement.style.left = `${e.clientX - this.cursorInCardX}px`;

    document.documentElement.addEventListener('mouseup', this.onMouseUp);
    document.documentElement.addEventListener('mousemove', this.onMouseMove);
  }

  onMouseUp() {
    const draggableObj = JSON.parse(
      JSON.stringify(
        this[`${this.draggableElementNameList}`].filter(
          (item) => item.id === this.draggableElement.dataset.id,
        )[0],
      ),
    );

    this[`${this.draggableElementNameList}`] = this[
      `${this.draggableElementNameList}`
    ].filter((item) => item.id !== this.draggableElement.dataset.id);

    const order = Array.from(this.shadowCard.parentElement.children).findIndex(
      (i) => i === this.shadowCard,
    );

    this[`${this.shadowCardNameList}`].splice(order, 0, draggableObj);

    this.shadowCard.insertAdjacentElement('beforebegin', this.draggableElement);
    this.draggableElement.classList.remove('dragged');
    this.draggableElement = null;
    this.shadowCard.remove();
    this.shadowCardNameList = null;
    this.draggableElementNameList = null;

    saveData(this.todo, this.progress, this.done);

    document.documentElement.removeEventListener('mouseup', this.onMouseUp);
    document.documentElement.removeEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove(e) {
    this.draggableElement.style.top = `${e.clientY - this.cursorInCardY}px`;
    this.draggableElement.style.left = `${e.clientX - this.cursorInCardX}px`;

    // массив элементов под курсором
    const el = document.elementsFromPoint(e.clientX, e.clientY);

    // под курсором тень карты - выход
    if (el.filter((i) => i.classList.contains('shadow-card'))[0]) {
      return;
    }

    // под курсором карта
    if (
      el.filter(
        (item) => item.classList.contains('card') && !item.classList.contains('dragged'),
      )[0]
    ) {
      const card = el.filter(
        (item) => item.classList.contains('card') && !item.classList.contains('dragged'),
      )[0];

      const { offsetTop } = card;
      const heightCard = card.offsetHeight;
      this.shadowCard.remove();

      // перенос тени карты на новую позицию
      if (e.clientY < offsetTop + heightCard / 2) {
        card.insertAdjacentElement('beforebegin', this.shadowCard);
      } else {
        card.insertAdjacentElement('afterend', this.shadowCard);
      }
      this.shadowCardNameList = this.shadowCard.parentElement.dataset.list;

      return;
    }

    // курсор над колонкой в которой нет карт, над изначальной, над любой
    if (el.filter((item) => item.classList.contains('board__col'))[0]) {
      const list = el.filter((item) => item.classList.contains('board__col'))[0]
        .children[1];
      if (
        list.children.length === 1
        && list.children[0] === this.draggableElement
      ) {
        this.shadowCard.remove();
        list.insertAdjacentElement('afterbegin', this.shadowCard);
        this.shadowCardNameList = this.shadowCard.parentElement.dataset.list;
      } else {
        this.shadowCard.remove();
        list.insertAdjacentElement('afterbegin', this.shadowCard);
        this.shadowCardNameList = this.shadowCard.parentElement.dataset.list;
      }
    }
  }
}

export default Board;
