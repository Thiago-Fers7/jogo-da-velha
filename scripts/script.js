import getStorage from './storage.js'

const DOM = {
    box: document.getElementsByClassName('box'),
    playerSelected: document.querySelectorAll('.scoreContainer button'),
    changePlayed: document.querySelector('.boxContainer'),
    turn: document.querySelector('.turnBox span'),
    winsX: document.querySelector('.winsX'),
    winsCircle: document.querySelector('.winsCircle'),
    modalNotify: document.querySelector('.modalNotifyContainer'),


    player: 'x',
    isWinIdentifier: false,

    isSelectedFirstPlayer: false,
}
const score = { winsX: 0, winsCircle: 0 }

function changeIcon(index) {
    if ((DOM.box[index].classList[1] || DOM.isWinIdentifier)) return;

    if (!DOM.isSelectedFirstPlayer) {
        alert('Clique na pontuação para escolher que inicia a partida');
        return
    }

    if (DOM.player === 'x') {
        DOM.box[index].classList.add('circle');
        DOM.player = 'circle';
        DOM.turn.classList.add('turnX');
        DOM.turn.classList.remove('turnCircle');
    } else {
        DOM.box[index].classList.add('x');
        DOM.player = 'x';
        DOM.turn.classList.add('turnCircle');
        DOM.turn.classList.remove('turnX');
    }

    DOM.changePlayed.classList.toggle('boxColor');

    isWin();
}

function isWin() {
    const myBoxes = [];
    let move = 0;

    for (let i = 0; i < DOM.box.length; i++) {
        myBoxes.push(DOM.box[i].classList[1]);

        if (DOM.box[i].classList[1]) {
            move++;
        }
    }

    function verify(n1, n2, n3) {
        const isWinner = (
            (myBoxes[n1] === myBoxes[n2])
            && myBoxes[n2] === myBoxes[n3]
            && myBoxes[n2]
        ) && !DOM.isWinIdentifier

        if (isWinner) {
            DOM.isWinIdentifier = true;

            // Formato do localStorage = "wins" / {winsX: 0, winsCircle: 0}
            if (DOM.player === 'x') {
                score.winsX++;

                localStorage.setItem('wins', JSON.stringify({ x: score.winsX, circle: score.winsCircle }));

                DOM.winsX.textContent = score.winsX;


                DOM.modalNotify.classList.add('active')
            } else {
                score.winsCircle++;

                localStorage.setItem('wins', JSON.stringify({ x: score.winsX, circle: score.winsCircle }));

                DOM.winsCircle.textContent = score.winsCircle;
                DOM.modalNotify.classList.add('active')
            }
        }
    }

    verify(0, 1, 2);
    verify(0, 4, 8);
    verify(0, 3, 6);

    verify(1, 4, 7);
    verify(2, 5, 8);
    verify(2, 4, 6);
    verify(3, 4, 5);
    verify(6, 7, 8);

    if (move === 9 && !DOM.isWinIdentifier) {
        alert('Velha!');
    }
}

function initialPlayer(indexButton) {
    // Caso o usuário não tenha escolhido o primeiro jogador nada acontece no game
    if (DOM.isSelectedFirstPlayer) return;

    DOM.playerSelected[indexButton].classList.add('first');

    // Confirmarção para saber se usuário já escolheu o primeiro player
    DOM.isSelectedFirstPlayer = true;

    // Alternando o player inicial
    if (DOM.playerSelected[indexButton].classList[0] === 'scoreX') {
        DOM.player = 'circle';
        DOM.turn.classList.add('turnX');
        DOM.turn.classList.remove('turnCircle');
        DOM.changePlayed.classList.add('boxColor');
    } else {
        DOM.player = 'x'
        DOM.turn.classList.add('turnCircle');
        DOM.turn.classList.remove('turnX');
        DOM.changePlayed.classList.remove('boxColor');
    }

    // Removendo classes de botões inativos
    for (let i = 0; i < DOM.playerSelected.length; i++) {
        if (i !== indexButton) {
            DOM.playerSelected[i].classList.remove('first');
        }
    }
}

window.onload = () => {
    for (let i = 0; i < DOM.box.length; i++) {
        DOM.box[i].addEventListener('click', () => changeIcon(i));

        if (i < DOM.playerSelected.length) {
            DOM.playerSelected[i].addEventListener('click', () => initialPlayer(i));
        }
    }

    // Buscando valores no localStorage
    const { x, circle } = getStorage('wins', { x: 0, circle: 0 });

    score.winsX = +x;
    score.winsCircle = +circle;

    DOM.winsX.textContent = x
    DOM.winsCircle.textContent = circle
}