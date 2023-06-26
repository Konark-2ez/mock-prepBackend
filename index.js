const express = require("express")
const { connection } = require("./config/db")
const cors = require("cors")
require("dotenv").config()
const app = express()
const{ Server} = require("socket.io")

const http = require("http")

app.use(express.json())
app.use(cors())
const {userRouter} = require("./routes/user.route")
const server = http.createServer(app)
//const io = socketio(server)
app.use("/user",userRouter)








server.listen(process.env.PORT,async()=>{
    try {
        await connection
        console.log("Connected to DB")
    } catch (error) {
        console.log(error)
    }
    console.log("Connected to Server at port")
})
let count=0
const socketServer = new Server(server)
socketServer.on("connection",(socket)=>{
    count++
    socketServer.emit("newUser",count)
    socket.on("message",(msg)=>{
        socketServer.emit("message",msg)
    })
    socket.on("disconnect",(msg)=>{
        count--
      
    })
})