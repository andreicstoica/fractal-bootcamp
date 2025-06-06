import express from "express"
import { DbTicTacToeApi } from './src/db/db'
import cors from "cors"
import { Server } from "socket.io"
import { Game } from "./src/game/game";

const app = express();
app.use(cors({
  origin: "*",
  methods: ['GET', 'POST']
}))
app.use(express.json())

const api = new DbTicTacToeApi()

const makeRoomId = (game: Game) => `game-${game.id}`

const PORT = parseInt(process.env.PORT || "3000");
const server = app.listen(PORT, () => console.log("Server is listening on http://localhost:3000"))

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  console.log(`a user connected: ${socket.id}!!! LFG`)

  socket.on('join-game', async (gameId: string) => {
    const foundGame = await api.getGame(gameId)

    if (!foundGame) {
      throw new Error('No found game at that ID :(')
    }

    const roomId = makeRoomId(foundGame)
    socket.join(roomId) // using makeRoomId to just create a string based on game id from db that socket joins
    io.to(roomId).emit('user-joined', socket.id)
  })
})

app.get("/message", (_, res) => res.send("Hello from express!"));

app.post("/api/game", async (req, res) => {
  const game = await api.createGame(req.body.startingPlayer)
  res.json(game)
})

app.get("/api/games", async (_, res) => {
  const games = await api.getGames()
  res.json(games)
})

app.get("/api/game/:id", async (req, res) => {
  const game = await api.getGame(req.params.id)
  res.json(game)
})

app.post("/api/game/:id/move", async (req, res) => {
  const game = await api.makeMove(req.params.id, req.body.coords)
  io.to(makeRoomId(game)).emit('game-updated', game)
  res.json(game)
})