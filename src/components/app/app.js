import './app.scss';
import Board from '../board/Board';

const mainSection = document.querySelector('main');

const board = new Board(mainSection);
board.bindToDOM();
