(() => {
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function createForm() {
    const form = document.createElement('form');
    const input = document.createElement('input');
    const button = document.createElement('button');

    input.classList.add('input');
    button.classList.add('start-game');

    button.innerHTML = 'Начать игру';
    input.placeholder = 'Введите кол-во карточек';
    button.disabled = true;

    input.addEventListener('input', () => {
      if (input.value) button.disabled = false;
      else button.disabled = true;
    });

    form.append(input);
    form.append(button);

    return {
      form,
      input,
      button,
    };
  }

  function createBoard() {
    const board = document.createElement('ul');
    board.classList.add('board');

    return board;
  }

  function open(card) {
    card.textContent = card.dataset.number;
  }

  function close(card) {
    card.textContent = '';
  }

  function createCards(n) {
    const cards = [];
    let cardContent = 1;
    for (let i = 0; i < n; i++) {
      const card = document.createElement('li');
      card.classList.add('card');
      card.setAttribute('data-number', cardContent);

      cardContent++;
      if (cardContent > (n / 2)) cardContent = 1;

      cards.push(card);
    }

    return cards;
  }

  function createGame() {
    const startScreen = document.getElementById('screen-1');
    const gameScreen = document.getElementById('screen-2');
    const form = createForm(startScreen);
    const board = createBoard();

    startScreen.append(form.form);

    form.form.addEventListener('submit', (e) => {
      e.preventDefault();
      startScreen.classList.add('up');

      // eslint-disable-next-line prefer-const
      let cardsCount = 4 ** 2;
      if (Number(form.input.value) % 2 === 0 && Number(form.input.value) <= 10) {
        cardsCount = Number(form.input.value) ** 2;
      }
      // eslint-disable-next-line max-len
      const cardSize = (board.clientWidth - 15 * Math.sqrt(cardsCount) - 40) / Math.sqrt(cardsCount);
      const cardsArray = createCards(cardsCount);

      shuffle(cardsArray);

      for (const card of cardsArray) {
        card.style.width = `${cardSize}px`;
        card.style.height = `${cardSize}px`;
        board.append(card);
      }
    });

    let hasFlippedCard = false;
    let firstCard;
    let secondCard;
    let lockBoard = false;
    board.onclick = function (event) {
      if (event.target.tagName !== 'LI') return;
      if (lockBoard) return;

      if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = event.target;
        open(firstCard);
        return;
      }

      secondCard = event.target;
      open(secondCard);
      hasFlippedCard = false;

      if (firstCard.dataset.number !== secondCard.dataset.number) {
        lockBoard = true;
        setTimeout(() => {
          close(firstCard);
          close(secondCard);
          lockBoard = false;
        }, 1000);
      }
    };

    gameScreen.append(board);
  }

  window.createGame = createGame;
})();
