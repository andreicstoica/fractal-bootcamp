import express from "express";
import ViteExpress from "vite-express";
//import { MemoryTicTacToeApi } from './src/api.ts'
import { DbTicTacToeApi } from './src/db/db'

const app = express();
app.use(express.json())

const api = new DbTicTacToeApi()

app.get("/message", (_, res) => res.send("Hello from express!"));

app.post("/api/game", async (req, res) => {
  const game = await api.createGame(req.body.startingPlayer)
  res.json(game)
})

app.get("/api/games", async (req, res) => {
  const games = await api.getGames()
  console.log(games);
  res.json(games)
})

app.get("/api/game/:id", async (req, res) => {
  const game = await api.getGame(req.params.id)
  res.json(game)
})

app.post("/api/game/:id/move", async (req, res) => {
  //console.log('test?');
  const game = await api.makeMove(req.params.id, req.body.coords)
  res.json(game)
})

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));