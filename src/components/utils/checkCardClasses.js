/**
 * функция проверяет наличие у элемента классов карточки для осуществления drag 'n' drop
 * @param element элемент на котором сработало событие 'mousedown'
 * @returns элемент card если это карточка, false если не карточка, или элемент удаления карточки
 */
function checkCardClasses(element) {
  switch (true) {
    case element.classList.contains('card__delete'):
      return false;
    case element.classList.contains('card'):
      return element;
    case element.classList.contains('card__header'):
      return element.parentElement;
    case element.classList.contains('card__title'):
      return element.parentElement.parentElement;
    case element.classList.contains('card__text'):
      return element.parentElement;
    default:
      return false;
  }
}

export default checkCardClasses;
