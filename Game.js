const { Chess } = require("chess.js");

module.exports = class Game {
  #moves = [];
  #moveCount = 0;

  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.moves = this.#moves;
    this.startTime = new Date();
    this.player1.send(
      JSON.stringify({ type: "init_game", payload: { color: "white" } })
    );
    this.player2.send(
      JSON.stringify({ type: "init_game", payload: { color: "black" } })
    );
  }

  makeMove(socket, move) {
    //Validation with zod is it valid move
    if (this.#moveCount % 2 === 0 && socket !== this.player1) {
      // if the total numbers of move is odd then player2 turn to make move instead of player 1
      return;
    }
    if (this.#moveCount % 2 !== 0 && socket !== this.player2) {
      return;
    }

    //Update the board
    //push the move
    try {
      this.board.move(move);
    } catch (error) {
      console.log("errrrrrrrrr", error);
      return;
    }

    //check if the game is over like checkmate
    if (this.board.isGameOver()) {
      // let both player know game is over
      this.player1.send(
        JSON.stringify({
          type: "game_over",
          payload: {
            winner: this.board.turn() === "w" ? "white" : "black",
          },
        })
      );
      this.player2.send(
        JSON.stringify({
          type: "game_over",
          payload: {
            winner: this.board.turn() === "w" ? "white" : "black",
          },
        })
      );
      return;
    }
    //if game is not over
    // send updated board to the both user.
    if (this.#moveCount % 2 === 0) {
      // let player2 know that player1 make move
      this.player2.send(
        JSON.stringify({
          type: "move",
          payload: move,
        })
      );
    } else {
      //let player1 know that player2 make move
      this.player1.send(JSON.stringify({ type: "move", payload: move }));
    }
    this.#moveCount++;
  }
};
