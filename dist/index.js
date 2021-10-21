var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var import_http = __toModule(require("http"));
var import_socket = __toModule(require("socket.io"));
var import_express = __toModule(require("express"));
var import_cors = __toModule(require("cors"));
var import_Game = __toModule(require("./Game"));
var import_Utils = __toModule(require("./Utils"));
var import_config = __toModule(require("dotenv/config"));
const app = (0, import_express.default)();
const server = (0, import_http.createServer)(app);
const io = new import_socket.Server(server, {
  cors: {
    origin: process.env.ORIGIN,
    methods: "GET",
    optionsSuccessStatus: 200
  },
  transports: ["websocket"]
});
app.use(import_express.default.static(__dirname + "/public"));
app.use(import_express.default.json());
app.use(import_express.default.urlencoded({ extended: true }));
app.use((0, import_cors.default)({
  origin: process.env.ORIGIN,
  methods: "GET",
  optionsSuccessStatus: 200
}));
server.listen(process.env.PORT, () => {
  console.log("Listening to port:", process.env.PORT);
});
const games = [];
const takenUsername = [];
app.get("/is-username-taken", (req, res) => {
  res.json(takenUsername.includes(req.query.username));
});
io.on("connection", (socket) => {
  if (!import_Utils.default.isSocketValid(socket))
    return socket.disconnect(true);
  takenUsername.push(socket.handshake.query.username);
  socket.on("disconnect", () => takenUsername.splice(takenUsername.indexOf(socket.handshake.query.username), 1));
  const requestJoinGameListener = (gameId) => {
    let game = games.find((g) => g.getId() === gameId);
    if (!game) {
      game = new import_Game.default(gameId);
      games.push(game);
    }
    game.join(socket.handshake.query.username, socket);
    game.on("start", () => {
      socket.removeListener("player-start", playerStartListener);
      socket.removeListener("request-join-game", requestJoinGameListener);
    });
    game.on("stop", () => {
      games.splice(games.indexOf(game), 1);
      socket.once("request-join-game", requestJoinGameListener);
    });
    socket.on("leave-game", () => {
      game.leave(socket.handshake.query.username);
      socket.once("request-join-game", requestJoinGameListener);
    });
    socket.on("disconnect", () => {
      game.leave(socket.handshake.query.username);
    });
    const playerStartListener = () => {
      if (game.canStart()) {
        socket.removeListener("player-start", playerStartListener);
        game.start();
      }
    };
    socket.once("player-start", playerStartListener);
  };
  socket.once("request-join-game", requestJoinGameListener);
});
