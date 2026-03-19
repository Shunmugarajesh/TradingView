const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: { origin: "*" }
})

let signals = []

// socket connection
io.on("connection", (socket)=>{
  console.log("Mobile connected")

  socket.emit("init", signals)
})

// webhook
app.post("/signal", (req,res)=>{

  const signal = req.body

  console.log("Signal received:", signal)

  signals.push(signal)

  io.emit("signal", signal)

  res.send({status:"ok"})
})

// health check
app.get("/", (req,res)=>{
  res.send("Server running")
})

server.listen(3000, ()=>{
  console.log("Server running on port 3000")
})