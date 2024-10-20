const { WebSocketServer } = require("ws");
const GameManager = require("./GameManager");

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  //   ws.on("message", function message(data) {
  //     console.log("received: %s", data);
  //   });

  gameManager.addUser(ws);

  ws.on("disconnect", () => {
    // user disconnect
    gameManager.removeUser(ws);
  });

  ws.send("something");
});
