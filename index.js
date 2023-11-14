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


    
    const updateScore = (player) => {
        player.score += 1
        player.display.textContent = `Score: ${player.score}`;
        console.log('hello i am here updating the score')
        console.log(player.name, player.score)
        setTimeout(() => {
            gameBoard.clearBoard()
        }, 500)
        gameBoard.reset = 'on'
    }



    return {
        player1,
        player2,
        score,
        player1Score,
        player2Score,
        updateScore
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
        item.addEventListener('click', () => player.playTurn(item));
    }


    return {createCell};
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
        if(allEqual([gameBoard.board[0], gameBoard.board[4], gameBoard.board[8]]) && gameBoard.board[0] == game.player1.marker||
            allEqual([gameBoard.board[2], gameBoard.board[4], gameBoard.board[6]]) && gameBoard.board[2] == game.player1.marker)
            {
            game.updateScore(game.player1)
            } else if(allEqual([gameBoard.board[0], gameBoard.board[4], gameBoard.board[8]]) && gameBoard.board[0] == game.player2.marker||
        allEqual([gameBoard.board[2], gameBoard.board[4], gameBoard.board[6]]) && gameBoard.board[2] == game.player2.marker){
            game.updateScore(game.player2)
        }
        
        // Check Horizontals & Verticals

        let horizonCheck = [...gameBoard.board]
        let vertCheck = [...gameBoard.board]
        let newBoard;
        let newBoard2;
 
        for(let i=1; i<4; i++) {
            newBoard = horizonCheck.splice(0, 3);
            if(allEqual(newBoard) && newBoard[0] == game.player1.marker){
                console.log('OMG YOU WON')
                game.updateScore(game.player1)
            } else if (allEqual(newBoard) && newBoard[0] == game.player2.marker) {
                console.log('ah nah player 2 won')
                game.updateScore(game.player2)
            }
        }
        for(let i=0; i<3; i++) {
            newBoard2 = vertCheck.splice(0,1);
            if(allEqual([gameBoard.board[i+3], gameBoard.board[i+6], newBoard2[0]]) && newBoard2[0] == game.player1.marker){
                game.updateScore(game.player1)
                console.log('you won papa')
            } else if(allEqual([gameBoard.board[i+3], gameBoard.board[i+6], newBoard2[0]]) && newBoard2[0] == game.player2.marker){
                console.log('player 2 wins')
                game.updateScore(game.player2)
            }
        }
        
    }

    const clearBoard = () => {
        const cells = document.querySelectorAll('.cell');
        gameBoard.board = [0,1,2,3,4,5,6,7,8]
        gameBoardCopy = [...gameBoard.board]
        cells.forEach((cell) => {
            cell.classList.remove('x');
            cell.classList.remove('o');
            newValue = gameBoardCopy.splice(0, 1)
            cell.value = newValue[0];
        })

    }
    
    return {
            board,
            movesCheck,
            checkForWinner,
            clearBoard,
            reset
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
                        getComputerChoice(item)
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