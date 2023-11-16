// Game Module
const game = (function() {
    
    function Player(name, score, marker, display) {
        this.name = name;
        this.score = score;
        this.marker = marker;
        this.display = display;
    }

    let score
    let player1Score = document.querySelector('.player1Score');
    let player2Score = document.querySelector('.player2Score');
    let player1 = new Player('Player1', 0, null, player1Score)
    let player2  = new Player('Player2', 0, null, player2Score)
    const startOverBtn = document.querySelector('.startOver');
    const changeNameBtn = document.querySelector('.changeName');
    const changeNameInput = document.querySelector('.changeNameInput');
    const player1Name = document.querySelector('.player1Name');
    const form = document.querySelector('form')
    const winnerDisplay = document.querySelector('.winnerDisplay')


    
    const updateScore = (player) => {
        player.score += 1
        player.display.textContent = `Score: ${player.score}`;

        // setTimeout(() => {
        //     gameBoard.clearBoard()
        // }, 500)

    }

    const startOver = () => {
        gameBoard.clearBoard();
        game.player1.score = 0;
        game.player2.score = 0;
        game.player1.display.textContent = `Score: ${game.player1.score}`
        game.player2.display.textContent = `Score: ${game.player2.score}`
        form.classList.add('hidden');
    }
    startOverBtn.addEventListener('click', () => { startOver() })

    const changeName = () =>{
        game.player1.name = changeNameInput.value;
        player1Name.textContent = game.player1.name;
        changeNameInput.textContent = 'enter new name'
        changeNameInput.value = ''
        form.classList.add('hidden');
    }
    changeNameBtn.addEventListener('click', () => {
        form.classList.remove('hidden');
    })
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        changeName() 
    })

    const hideComponents = () => {
        form.classList.add('hidden')
        winnerDisplay.classList.add('hidden')
    }


    return {
        player1,
        player2,
        score,
        player1Score,
        player2Score,
        updateScore,
        hideComponents
    }

}())


// Cell Module
const cell = (function(){

    
    const container = document.querySelector('.container')

    const createCell = (index) => {
        const item = document.createElement('div');
        item.classList.add('cell');
        container.append(item);
        item.value = index;
        item.addEventListener('click', () => { game.hideComponents(), player.playTurn(item) });
    }

    const addWinnerClass = (cell, player) => {
        if(player == 'player1'){
            cell.classList.add('winner');
        } else if (player === 'player2'){
            cell.classList.add('loser')
        }
    }

    const winnerCell = (row, col, player) => {

        const diagonalOne = [gameBoard.board[0], gameBoard.board[4], gameBoard.board[8]];
        const diagonalTwo = [gameBoard.board[2], gameBoard.board[4], gameBoard.board[6]];
        const cells = document.querySelectorAll('.cell');


        if(gameBoard.allEqual(diagonalOne) && diagonalOne[0] == game.player1.marker || gameBoard.allEqual(diagonalOne) && diagonalOne[0] == game.player2.marker) {
            for(let i=0; i<=cells.length; i++){
                if(i == 0 || i == 4 || i == 8) { addWinnerClass(cells[i], player), gameBoard.showHidden() }
            }
        } 
        if(gameBoard.allEqual(diagonalTwo) && diagonalTwo[0] == game.player1.marker || gameBoard.allEqual(diagonalTwo) && diagonalTwo[0] == game.player2.marker) {
            for(let i=0; i<=cells.length; i++){
                if(i == 2 || i == 4 || i == 6) { addWinnerClass(cells[i], player), gameBoard.showHidden() }
            }
        }

        for(let i=0; i<cells.length; i++) {
            if(typeof row === 'number'){
                if(i == row || i == row + 1 || i == row + 2 ) { addWinnerClass(cells[i], player), gameBoard.showHidden()}
            } else  if(typeof col === 'number'){
                if(i == col || i == col + 3 || i == col + 6) { addWinnerClass(cells[i], player), gameBoard.showHidden() }
            }
        }
    }


    return {
        createCell,
        winnerCell
    };
 }())


// GameBoard Module
const gameBoard = (function() {

    let board = []
    let reset = '';
    for (let i = 0; i < 9; i++) {
            board[i] = i;
            cell.createCell(i)
      }

      const markers = document.querySelectorAll('.markerBtn');
      const markerWrapper = document.querySelector('.markerWrapper');
      markers.forEach((marker) => {
          marker.addEventListener('click', () => player.chooseMarker(marker, markerWrapper))
      })

    
    const movesCheck = () => {
        const openSpaces = gameBoard.board.filter((space) => {
            return typeof space === 'number'
        })
        console.log(openSpaces, 'Open Spaces')
        if(openSpaces.length == 1) {
            setTimeout(() => {
                alert('no more moves babe')
                gameBoard.clearBoard()
            }, 500)
        } else {
            
        }
    }

    const allEqual = arr => arr.every(val => val === arr[0]);


    const checkForWinner = (item) => {
        let diagonalOne;
        let diagonalTwo;
        diagonalOne = [gameBoard.board[0], gameBoard.board[4], gameBoard.board[8]];
        diagonalTwo = [gameBoard.board[2], gameBoard.board[4], gameBoard.board[6]];
        console.log(diagonalOne, 'diagonal one')
        console.log(gameBoard.board);
        if(allEqual(diagonalOne) && board[0] == game.player1.marker || allEqual(diagonalTwo) && gameBoard.board[2] == game.player1.marker){
            cell.winnerCell('', '', 'player1');
            game.updateScore(game.player1)
            gameBoard.reset = 'on'
            diagonalOne = []
            diagonalTwo = []
            } else if(allEqual(diagonalOne) && board[0] == game.player2.marker ||  allEqual(diagonalTwo) && gameBoard.board[2] == game.player2.marker){
            game.updateScore(game.player2) 
            cell.winnerCell('', '', 'player2')
            gameBoard.reset = 'on'
            // Dont forget to add a loser class or like a red outline or something adjacent of winnerCell()
        }

        console.log(diagonalOne, 'twice')
        
        // Check Horizontals & Verticals

        let horizonCheck = [...gameBoard.board]
        let vertCheck = [...gameBoard.board]
        let newBoard;
        let newBoard2;
 
        for(let i=0; i<7; i+=3) {
            newBoard = horizonCheck.splice(0, 3);
            if(allEqual(newBoard) && newBoard[0] == game.player1.marker){
                console.log('OMG YOU WON')
                game.updateScore(game.player1)
                cell.winnerCell(i, '', 'player1')
                gameBoard.reset = 'on';
                return
            } else if (allEqual(newBoard) && newBoard[0] == game.player2.marker) {
                console.log('ah nah player 2 won')
                game.updateScore(game.player2)
                cell.winnerCell(i, '', 'player2')
                gameBoard.reset = 'on'
                return
            }
        }
        for(let i=0; i<3; i++) {
            newBoard2 = vertCheck.splice(0,1);
            if(allEqual([gameBoard.board[i+3], gameBoard.board[i+6], newBoard2[0]]) && newBoard2[0] == game.player1.marker){
                game.updateScore(game.player1)
                console.log('you won papa')
                cell.winnerCell('', i, 'player1');
                gameBoard.reset = 'on'
            } else if(allEqual([gameBoard.board[i+3], gameBoard.board[i+6], newBoard2[0]]) && newBoard2[0] == game.player2.marker){
                console.log('player 2 wins')
                cell.winnerCell('', i, 'player2')
                game.updateScore(game.player2)
                gameBoard.reset = 'on'
            }
        }
        
    }

    const winnerDisplay = document.querySelector('.winnerDisplay')
    const nextMatch = document.querySelector('.match');
    nextMatch.addEventListener('click', () => {
        clearBoard();
    })

    const clearBoard = () => {
        reset = ''
        const cells = document.querySelectorAll('.cell');
        gameBoard.board = [0,1,2,3,4,5,6,7,8]
        gameBoardCopy = [...gameBoard.board]
        cells.forEach((cell) => {
            cell.classList.remove('x');
            cell.classList.remove('o');
            cell.classList.remove('winner')
            cell.classList.remove('loser')
            newValue = gameBoardCopy.splice(0, 1)
            cell.value = newValue[0];
            nextMatch.classList.add('hidden')
            winnerDisplay.classList.add('hidden')
        })

    }

    const showHidden = () => {
        nextMatch.classList.remove('hidden');
        winnerDisplay.classList.remove('hidden');
    }
    
    return {
            board,
            movesCheck,
            checkForWinner,
            clearBoard,
            reset,
            allEqual,
            showHidden
            };
})();


// Player Module 
const player = (function() {

 
    const chooseMarker = (marker, markerWrapper) => {
        if(marker.value == 'x'){
            game.player1.marker = marker.value
            game.player2.marker = 'o'
        } else if(marker.value == 'o') {
            game.player1.marker = marker.value;
            game.player2.marker = 'x';
        }
        console.log(`Okay, you've chosen ${game.player1.marker}`);
        console.log(`Computron picks ${game.player2.marker}`);
        markerWrapper.classList.add('hidden');
    }
    
    const getComputerChoice = (item) => {
        // console.log('computron is thinking...')
        const choice = Math.floor(Math.random() * 10);
        const cells = document.querySelectorAll('.cell');

        if(gameBoard.board.includes(choice)) {
            for(let cell of cells){
                if(cell.value == choice) {
                    gameBoard.board.splice(cell.value, 1, game.player2.marker)
                    cell.value = game.player2.marker;
                    cell.classList.add(`${game.player2.marker}`)
                    gameBoard.checkForWinner();
                    gameBoard.movesCheck();
                    break
                } 
            }
        } else {
                getComputerChoice();
            }        
    }

    const playTurn = (item) => {
        if(item.value == game.player1.marker || item.value == game.player2.marker){
            alert('pick another spot nerd');
        } else if(item.value != game.player2.marker) {
            gameBoard.reset = ''
                for(let num of gameBoard.board) {
                if(num == item.value) {
                    item.value = num;
                    gameBoard.board.splice(num, 1, game.player1.marker)
                    item.classList.add(`${game.player1.marker}`)
                    item.value = game.player1.marker;
                    gameBoard.checkForWinner(item);
                    console.log(gameBoard.reset)
                    if(!gameBoard.reset){
                        setTimeout(() => {
                            getComputerChoice(item)
                        }, 500)

                    }
                    break
                }
            }
            }
        }




    return {
        playTurn,
        chooseMarker
    }
}())