!function(){"use strict";var t={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let e;const s=new Uint8Array(16);function n(){if(!e&&(e="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!e))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return e(s)}const a=[];for(let t=0;t<256;++t)a.push((t+256).toString(16).slice(1));var i=function(e,s,i){if(t.randomUUID&&!s&&!e)return t.randomUUID();const r=(e=e||{}).random||(e.rng||n)();if(r[6]=15&r[6]|64,r[8]=63&r[8]|128,s){i=i||0;for(let t=0;t<16;++t)s[i+t]=r[t];return s}return function(t,e=0){return a[t[e+0]]+a[t[e+1]]+a[t[e+2]]+a[t[e+3]]+"-"+a[t[e+4]]+a[t[e+5]]+"-"+a[t[e+6]]+a[t[e+7]]+"-"+a[t[e+8]]+a[t[e+9]]+"-"+a[t[e+10]]+a[t[e+11]]+a[t[e+12]]+a[t[e+13]]+a[t[e+14]]+a[t[e+15]]}(r)},r=class{constructor(t,e){this.parentEl=t,this.data=e,this.bindToDOM=this.bindToDOM.bind(this)}markUp(){return`\n      <div class="card__header">\n        <h3 class="card__title">${this.data.title}</h3>\n        <span class="card__delete">&#10006;</span>\n      </div>\n      <p class="card__text">${this.data.text}</p>\n    `}bindToDOM(t){this.element=document.createElement("div"),this.element.classList.add("card"),this.element.dataset.id=this.data.id,this.element.innerHTML=this.markUp(),this.parentEl.insertAdjacentElement("beforeend",this.element),this.element.addEventListener("mousedown",t)}};function d(){for(var t=arguments.length,e=new Array(t),s=0;s<t;s++)e[s]=arguments[s];const n=JSON.stringify({...e});localStorage.setItem("planningBoard",n)}class o{constructor(t,e){this.parentEl=t,this.board=e,this.bindToDOM=this.bindToDOM.bind(this),this.onSubmit=this.onSubmit.bind(this),this.onClose=this.onClose.bind(this)}static get markUp(){return'\n      <input class="add-card__input add-card__input-title" type="text" name="title"\n        placeholder="Заголовок напишите здесь...">\n      <textarea class="add-card__input add-card__input-text" type="text" rows="3" name="text"\n        placeholder="Текст будет здесь..."></textarea>\n      <div class="add-card__btn-block">\n        <input class="add-card__submit" type="submit" value="Готово">\n        <input class="add-card__close" type="button" value="&#10006;">\n      </div>\n    '}bindToDOM(){this.element=document.createElement("form"),this.element.classList.add("add-card"),this.element.innerHTML=o.markUp,this.parentEl.insertAdjacentElement("beforeend",this.element),this.element.querySelector(".add-card__submit").addEventListener("click",this.onSubmit),this.element.querySelector(".add-card__close").addEventListener("click",this.onClose)}onSubmit(t){t.preventDefault();const e=Object.fromEntries(new FormData(this.element).entries());e.id=i();const{list:s}=this.parentEl.dataset;this.board[`${s}`].push(e);const n=new r(this.parentEl,e);this.element.remove(),n.bindToDOM(this.board.onMouseDown),this.board.isCreating=!1,d(this.board.todo,this.board.progress,this.board.done)}onClose(t){t.preventDefault(),this.element.remove(),this.board.isCreating=!1}}var l=o,h=function(t){switch(!0){case t.classList.contains("card__delete"):return!1;case t.classList.contains("card"):return t;case t.classList.contains("card__header"):return t.parentElement;case t.classList.contains("card__title"):return t.parentElement.parentElement;case t.classList.contains("card__text"):return t.parentElement;default:return!1}};class c{constructor(t){this.parentEl=t,this.todo=[],this.progress=[],this.done=[],this.draggableElement=null,this.shadowCard=null,this.shadowCardNameList=null,this.draggableElementNameList=null,this.isCreating=!1,this.bindToDOM=this.bindToDOM.bind(this),this.setShadowElement=this.setShadowElement.bind(this),this.onCreateCard=this.onCreateCard.bind(this),this.onDeleteCard=this.onDeleteCard.bind(this),this.onLoadCardsFromStorage=this.onLoadCardsFromStorage.bind(this),this.onMouseDown=this.onMouseDown.bind(this),this.onMouseUp=this.onMouseUp.bind(this),this.onMouseMove=this.onMouseMove.bind(this)}static get markUp(){return'\n    <div class="board__col">\n        <h2 class="board__col-title board__col-title_todo">Планы</h2>\n        <div class="board__col-list" data-list="todo"></div>\n        <button class="board__col-btn">&#10010; Добавить карточку</button>\n      </div>\n      <div class="board__col">\n        <h2 class="board__col-title board__col-title_progress">В процессе</h2>\n        <div class="board__col-list" data-list="progress"></div>\n        <button class="board__col-btn">&#10010; Добавить карточку</button>\n      </div>\n      <div class="board__col">\n        <h2 class="board__col-title board__col-title_done">Завершено</h2>\n        <div class="board__col-list" data-list="done"></div>\n        <button class="board__col-btn">&#10010; Добавить карточку</button>\n      </div>\n    '}bindToDOM(){this.element=document.createElement("div"),this.element.classList.add("board"),this.element.innerHTML=c.markUp,this.parentEl.appendChild(this.element),this.element.querySelectorAll(".board__col-btn").forEach((t=>{t.addEventListener("click",this.onCreateCard)})),this.allLists=this.element.querySelectorAll(".board__col-list"),this.allLists.forEach((t=>t.addEventListener("click",this.onDeleteCard))),this.onLoadCardsFromStorage()}onCreateCard(t){this.isCreating||(new l(t.target.previousElementSibling,this).bindToDOM(),t.target.previousElementSibling.scrollTop=1e9,this.isCreating=!0)}onDeleteCard(t){if(t.target.classList.contains("card__delete")){const e=t.target.parentElement.parentElement,{id:s}=e.dataset,n=t.currentTarget.dataset.list;this[`${n}`]=this[`${n}`].filter((t=>t.id!==s)),e.remove(),d(this.todo,this.progress,this.done)}}onLoadCardsFromStorage(){try{const t=function(){let t;try{if(t=localStorage.getItem("planningBoard"),t)return JSON.parse(t)}catch{throw new Error("No saved data")}return t}();t&&this.allLists.forEach(((e,s)=>{t[s].length>0&&(t[s].forEach((t=>{new r(e,t).bindToDOM(this.onMouseDown)})),this[`${e.dataset.list}`]=t[s])}))}catch{}}setShadowElement(t,e){this.shadowCard=document.createElement("div"),this.shadowCard.classList.add("shadow-card"),this.shadowCard.style.width=`${t}px`,this.shadowCard.style.height=`${e}px`,this.siblingOfDraggableElement?this.siblingOfDraggableElement.insertAdjacentElement("afterend",this.shadowCard):this.draggableElement.parentElement.insertAdjacentElement("afterbegin",this.shadowCard)}onMouseDown(t){if(t.preventDefault(),!1===h(t.target))return;this.draggableElement=h(t.target),this.draggableElementNameList=this.draggableElement.parentElement.dataset.list,this.siblingOfDraggableElement=this.draggableElement.previousElementSibling;const e=this.draggableElement.offsetWidth,s=this.draggableElement.offsetHeight;this.draggableElement.style.width=`${e}px`,this.draggableElement.style.height=`${s}px`;const{top:n,left:a}=this.draggableElement.getBoundingClientRect();this.cursorInCardY=t.clientY-n,this.cursorInCardX=t.clientX-a,this.draggableElement.classList.add("dragged"),this.setShadowElement(e,s),this.shadowCardNameList=this.shadowCard.parentElement.dataset.list,this.draggableElement.style.top=t.clientY-this.cursorInCardY+"px",this.draggableElement.style.left=t.clientX-this.cursorInCardX+"px",document.documentElement.addEventListener("mouseup",this.onMouseUp),document.documentElement.addEventListener("mousemove",this.onMouseMove)}onMouseUp(){const t=JSON.parse(JSON.stringify(this[`${this.draggableElementNameList}`].filter((t=>t.id===this.draggableElement.dataset.id))[0]));this[`${this.draggableElementNameList}`]=this[`${this.draggableElementNameList}`].filter((t=>t.id!==this.draggableElement.dataset.id));const e=Array.from(this.shadowCard.parentElement.children).findIndex((t=>t===this.shadowCard));this[`${this.shadowCardNameList}`].splice(e,0,t),this.shadowCard.insertAdjacentElement("beforebegin",this.draggableElement),this.draggableElement.classList.remove("dragged"),this.draggableElement=null,this.shadowCard.remove(),this.shadowCardNameList=null,this.draggableElementNameList=null,d(this.todo,this.progress,this.done),document.documentElement.removeEventListener("mouseup",this.onMouseUp),document.documentElement.removeEventListener("mousemove",this.onMouseMove)}onMouseMove(t){this.draggableElement.style.top=t.clientY-this.cursorInCardY+"px",this.draggableElement.style.left=t.clientX-this.cursorInCardX+"px";const e=document.elementsFromPoint(t.clientX,t.clientY);if(!e.filter((t=>t.classList.contains("shadow-card")))[0]){if(e.filter((t=>t.classList.contains("card")&&!t.classList.contains("dragged")))[0]){const s=e.filter((t=>t.classList.contains("card")&&!t.classList.contains("dragged")))[0],{offsetTop:n}=s,a=s.offsetHeight;return this.shadowCard.remove(),t.clientY<n+a/2?s.insertAdjacentElement("beforebegin",this.shadowCard):s.insertAdjacentElement("afterend",this.shadowCard),void(this.shadowCardNameList=this.shadowCard.parentElement.dataset.list)}if(e.filter((t=>t.classList.contains("board__col")))[0]){const t=e.filter((t=>t.classList.contains("board__col")))[0].children[1];1===t.children.length&&(t.children[0],this.draggableElement),this.shadowCard.remove(),t.insertAdjacentElement("afterbegin",this.shadowCard),this.shadowCardNameList=this.shadowCard.parentElement.dataset.list}}}}new c(document.querySelector("main")).bindToDOM()}();