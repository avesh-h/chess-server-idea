const Game = require("./Game");

module.exports = class GameManager {
  #pendingUser = null;
  #users = [];

  constructor() {
    this.games = [];
    this.users = this.#users;
    this.pendingUser = this.#pendingUser;
  }

  addUser(socket) {
    this.#users.push(socket);
    this.#addUserHandler(socket);
  }

  removeUser(socket) {
    // Remove user for left the game
    this.#users.filter((u) => u !== socket);
  }

  #addUserHandler(socket) {
    socket.on("message", (msg) => {
      const message = JSON.parse(msg.toString());
      if (message.type === "init_game") {
        if (this.#pendingUser) {
          // to check if some other user already waiting someone to join then start the game with new user
          const game = new Game(this.#pendingUser, socket);
          this.games.push(game);
          this.#pendingUser = null;
        } else {
          this.#pendingUser = socket;
        }
      }
      // If user make move
      if (message.type === "move") {
        const game = this.games.find(
          (g) => g.player1 === socket || g.player2 === socket
        );
        if (game) {
          game.makeMove(socket, message.move);
        }
      }
    });
  }
};
