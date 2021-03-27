const initialState = {
  players: ["X", "O"],
  board: [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],
  winner: '',
};

let currentGameState

let currentPlayer;

function buildInitialState() {
  resetGame()
  renderState();
  requestPlayerName()
}

function resetGame() {
  currentGameState = JSON.parse(JSON.stringify(initialState))
  currentPlayer = initialState.players[1]
}

// function to get player name
function requestPlayerName() {
  const newPlayerOneDisplay = $('<div class="player_1"></div>')
  let playerNameOne
  $(".players").on("input", "#player_1", function (event) {
    event.preventDefault();
    playerNameOne = $("#player_1").val();
  });
  // make box disappear
  $(".players").on("submit", "#player-one-form", function (event) {
    event.preventDefault();
    
      // removes the box
      $("#player-one-form").remove();
      $('.players').prepend(newPlayerOneDisplay.text(playerNameOne + " = X"));
  });

  const newPlayerTwoDisplay = $('<div class="player_2"></div>')
  let playerNameTwo
  $(".players").on("input", "#player_2", function (event) {
    event.preventDefault();
    playerNameTwo = $("#player_2").val();
  });
  // make box disappear
  $(".players").on("submit", "#player-two-form", function (event) {
    event.preventDefault();
    
      // removes the box
      $("#player-two-form").remove();
      $('.players').append(newPlayerTwoDisplay.text(playerNameTwo + " = O"));
  });
}

function buildPlayerForms() {
  if ($('.player_1').length) {
    $('.player_1').remove()
    $('.players').prepend('<form id="player-one-form"><input id="player_1" type="text"/><button>Save Name</button></form>')
  }

  if ($('.player_2').length) {
    $('.player_2').remove()
    $('.players').append('<form id="player-two-form"><input id="player_2" type="text"/><button>Save Name</button></form>')
  }
}

function renderState() {
  const app = $("#app");
  $("#app").empty();
  currentGameState.board.forEach(function (row, rowIndex) {
    row.forEach(function (tile, tileIndex) {
      const tileElement = $(
        `<button class="tile" data-row="${rowIndex}" data-tile="${tileIndex}">${tile}</button>`
      );
      app.append(tileElement);
    });
  });
}

function playersSwitch() {
  let playerOne = currentGameState.players[0];
  let playerTwo = currentGameState.players[1];
  if (currentPlayer === playerOne) {
    currentPlayer = playerTwo;
    $('.player_2').removeClass('active')
    $('.player_1').addClass('active')
  } else {
    currentPlayer = playerOne;
    $('.player_1').removeClass('active')
    $('.player_2').addClass('active')
  }
  return currentPlayer;
}

function checkWinner(currentPlayer) {
  const tileOne = currentGameState.board[0][0];
  const tileTwo = currentGameState.board[0][1];
  const tileThree = currentGameState.board[0][2];
  const tileFour = currentGameState.board[1][0];
  const tileFive = currentGameState.board[1][1];
  const tileSix = currentGameState.board[1][2];
  const tileSeven = currentGameState.board[2][0];
  const tileEight = currentGameState.board[2][1];
  const tileNine = currentGameState.board[2][2];
  let winningMatches = [
    [tileOne, tileTwo, tileThree],
    [tileFour, tileFive, tileSix],
    [tileSeven, tileEight, tileNine],
    [tileOne, tileFour, tileSeven],
    [tileTwo, tileFive, tileEight],
    [tileThree, tileSix, tileNine],
    [tileOne, tileFive, tileNine],
    [tileThree, tileFive, tileSeven],
  ];
  // console.log(winningMatches);
  winningMatches.forEach(function(match) {
    const selectedPlayer = match.filter(function (playerSelected) {
      return playerSelected === currentPlayer
    })

    if (selectedPlayer.length === 3) {
      currentGameState.winner = currentPlayer
    }
  })


  if (currentGameState.winner) {
    $('.player_2').removeClass('active')
  $('.player_1').removeClass('active')
    $('.tile').attr("disabled", "disabled")
    return $(".holdWinner").append($(`<div class="winner">THE WINNER IS ${currentGameState.winner}!!</div>`));
  }
  const isCatsGame = currentGameState.board.filter(function(row) {
    return row[0] != "" && row[1] != "" && row[2] != ""
  })
  if (isCatsGame.length === 3) {
    $('.player_2').removeClass('active')
  $('.player_1').removeClass('active')
    $('.tile').attr("disabled", "disabled")
    return $(".holdWinner").append($(`<div class="winner">CATS GAME!!</div>`));
  }
}

// maybe a dozen or so helper functions for tiny pieces of the interface

// listeners
function ontileClick() {
  if ($(this).text() === "") {
    const row = $(this).data("row");
    const tile = $(this).data("tile");
    const currentPlayer = playersSwitch();
    currentGameState.board[row][tile] = currentPlayer
    renderState()
    checkWinner(currentPlayer)
  }
}


$('.reset').click(function() {
  resetGame()
  $('.winner').remove()
  $('.player_2').removeClass('active')
  $('.player_1').removeClass('active')
  buildPlayerForms()
  renderState()

})

$("#app").on("click", '.tile', ontileClick); // etc

buildInitialState()
