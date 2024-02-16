document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const flagsLeft = document.querySelector('#flag-left');
    const result = document.querySelector('#result');
    const width = 10;
    let bombAmount = 20;
    let squares = [];
    let isGameOver = false;
    let flags = 0;

    let timer;
    let longpress = false;
    const delay = 500; // tiempo en milisegundos

    //Create Board
    function createBoard() {

        flagsLeft.innerHTML = bombAmount;
        //get shuffled game array with random bombs
        const bombArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width * width - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombArray);
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.id = i;
            square.classList.add(shuffledArray[i]);
            grid.appendChild(square);
            squares.push(square);
            //normal click
            square.addEventListener('click', (e) => {
                click(square);
            });

            //ctrl and left click
            square.addEventListener('contextmenu', (e) => {
                addFlag(square);
            });

            //mobile controls

            square.addEventListener('touchstart', (e) => {
                e.preventDefault();
                longpress = false;
                timer = setTimeout(() => {
                    longpress = true;
                    addFlag(square);
                }, delay);
            });

            square.addEventListener('touchend', (e) => {
                e.preventDefault();
                clearTimeout(timer);
                if (!longpress) {
                    click(square);
                }
            });

        }

        //add numbers
        for (let i = 0; i < squares.length; i++) {
            let total = 0;
            const isLeftEdge = (i % width === 0);
            const isRightEdge = (i % width === width - 1);

            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) {
                    total++;
                }
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) {
                    total++;
                }

                if (i > 10 && squares[i - width].classList.contains('bomb')) {
                    total++;
                }
                if (i > 11 && !isLeftEdge && squares[i - width - 1].classList.contains('bomb')) {
                    total++;
                }
                if (i < 99 & !isRightEdge && squares[i + 1].classList.contains('bomb')) {
                    total++;
                }
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) {
                    total++;
                }
                if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) {
                    total++;
                }
                if (i < 89 && squares[i + width].classList.contains('bomb')) {
                    total++;
                }
                squares[i].setAttribute('data', total);
            }
        }
    }

    function setMobile() {
        let instructions = document.querySelector('.mobile_instructions');
        instructions.style.display = 'none';

        if (detectarMovil()) {
            instructions.style.display = 'block';
        }
    }

    function detectarMovil() {
        let isMobile = false;
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;

        // Dispositivos móviles
        if (/android/i.test(userAgent)) {
            isMobile = true;
        }

        // iOS
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            isMobile = true;
        }

        return isMobile;
    }

    setMobile();
    createBoard();

    //add Flag with rigth click
    function addFlag(square) {
        if (isGameOver) return;
        if (!square.classList.contains('checked') &&
            (flags < bombAmount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag');
                flags++;
                square.innerHTML = '🏴'
                flagsLeft.innerHTML = bombAmount - flags;
                checkForWin();
            } else {
                square.classList.remove('flag');
                flags--;
                square.innerHTML = ''
                flagsLeft.innerHTML = bombAmount - flags;

            }
        }

    }

    function click(square) {
        console.log(square);
        if (isGameOver || square.classList.contains('checked') ||
            square.classList.contains('flag')) return;

        if (square.classList.contains('bomb')) {
            gameOver();
        } else {
            let total = square.getAttribute('data');
            if (total != 0) {
                if (total == 1) {
                    square.classList.add('one');
                }
                if (total == 2) {
                    square.classList.add('two');
                }
                if (total == 3) {
                    square.classList.add('three');
                }
                if (total == 4) {
                    square.classList.add('four');
                }
                square.innerHTML = total;
                return;
            }
            checkSquare(square);
        }
        square.classList.add('checked');
    }

    function gameOver() {
        result.innerHTML = 'BOOM! Game Over';
        isGameOver = true;
        //show all bombs
        squares.forEach((square) => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣'
                square.classList.remove('bomb');
                square.classList.add('checked');
            }
        })
    }

    //check neighbouring squares once square is clicked
    function checkSquare(square) {
        const curentId = square.id;
        const isLeftEdge = (curentId % width === 0);
        const isRightEdge = (curentId % width === width - 1);

        setTimeout(() => {
            if (curentId > 0 && !isLeftEdge) {
                const newId = parseInt(curentId) - 1;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (curentId > 9 && !isRightEdge) {
                const newId = parseInt(curentId) + 1 - width;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (curentId > 10) {
                const newId = parseInt(curentId) - width;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (curentId > 11 && !isLeftEdge) {
                const newId = parseInt(curentId) - 1 - width;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (curentId < 98 && !isRightEdge) {
                const newId = curentId + 1;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (curentId < 90 && !isLeftEdge) {
                const newId = parseInt(curentId) - 1 + width;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (curentId < 88 && !isRightEdge) {
                const newId = parseInt(curentId) + 1 + width;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (curentId < 89) {
                const newId = parseInt(curentId) + width;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

        }, 10);
    }

    function checkForWin() {
        let matches = 0;
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') &&
                squares[i].classList.contains('bomb')) {
                matches++;
            }
            if (matches === bombAmount) {
                result.innerHTML = 'YOU WIN !!!';
                isGameOver = true;

            }
        }
    }
})