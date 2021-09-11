import getStorage from './storage.js'

const DOM = {
    box: document.getElementsByClassName('box'),
playerSelected: document.querySelectorAll('.scoreContainer button'),
changePlayed: document.querySelector('.boxContainer'),
turn: document.querySelector('.turnBox span'),
winsX: document.querySelector('.winsX'),
winsCircle: document.querySelector('.winsCircle'),

score: { winsX: 0, winsCircle: 0 },

player: 'x',
isWinIdentifier: false,

isSelectedFirstPlayer: false,
}

function changeIcon(index) {
    if ((box[index].classList[1] || isWinIdentifier)) return;

    if (!isSelectedFirstPlayer) {
        alert('Clique na pontuação para escolher que inicia a partida');
        return
    }

    if (player === 'x') {
        box[index].classList.add('circle');
        player = 'circle';
        turn.classList.add('turnX');
        turn.classList.remove('turnCircle');
    } else {
        box[index].classList.add('x');
        player = 'x';
        turn.classList.add('turnCircle');
        turn.classList.remove('turnX');
    }

    changePlayed.classList.toggle('boxColor');

    isWin();
}

function isWin() {
    const myBoxes = [];
    let move = 0;

    for (let i = 0; i < box.length; i++) {
        myBoxes.push(box[i].classList[1]);

        if (box[i].classList[1]) {
            move++;
        }
    }

    function verify(n1, n2, n3) {
        const isWinner = (
            (myBoxes[n1] === myBoxes[n2])
            && myBoxes[n2] === myBoxes[n3]
            && myBoxes[n2]
        ) && !isWinIdentifier

        if (isWinner) {
            isWinIdentifier = true;

            // Formato do localStorage = "wins" / {winsX: 0, winsCircle: 0}
            if (player === 'x') {
                score.winsX++;

                localStorage.setItem('wins', JSON.stringify({ x: score.winsX, circle: score.winsCircle }));

                winsX.textContent = score.winsX;
            } else {
                score.winsCircle++;

                localStorage.setItem('wins', JSON.stringify({ x: score.winsX, circle: score.winsCircle }));

                winsCircle.textContent = score.winsCircle;
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

    if (move === 9 && !isWinIdentifier) {
        alert('Velha!');
    }
}

function initialPlayer(indexButton) {
    // Caso o usuário não tenha escolhido o primeiro jogador nada acontece no game
    if (isSelectedFirstPlayer) return;

    playerSelected[indexButton].classList.add('first');

    // Confirmarção para saber se usuário já escolheu o primeiro player
    isSelectedFirstPlayer = true;

    // Alternando o player inicial
    if (playerSelected[indexButton].classList[0] === 'scoreX') {
        player = 'circle';
        turn.classList.add('turnX');
        turn.classList.remove('turnCircle');
        changePlayed.classList.add('boxColor');
    } else {
        player = 'x'
        turn.classList.add('turnCircle');
        turn.classList.remove('turnX');
        changePlayed.classList.remove('boxColor');
    }

    // Removendo classes de botões inativos
    for (let i = 0; i < playerSelected.length; i++) {
        if (i !== indexButton) {
            playerSelected[i].classList.remove('first');
        }
    }
}

window.onload = () => {
    for (let i = 0; i < box.length; i++) {
        box[i].addEventListener('click', () => changeIcon(i));

        if (i < playerSelected.length) {
            playerSelected[i].addEventListener('click', () => initialPlayer(i));
        }
    }

    // Buscando valores no localStorage
    const { x, circle } = getStorage('wins', { x: 0, circle: 0 });

    score.winsX = +x;
    score.winsCircle = +circle;

    winsX.textContent = x
    winsCircle.textContent = circle
}