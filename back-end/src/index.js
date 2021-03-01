require('./db/mongoose')
const express = require('express')
const port = process.env.PORT || 3000
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server,{
  cors:{
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
})
const userRoute=require('./routers/user')
const chatRoute=require('./routers/chat')(io)
const companyRoute=require('./routers/company')(io)
const rateRouter = require('./routers/rate')
const cors = require('cors')
app.use(express.json())
// app.use(chatRoute)
app.use(cors())
app.use(userRoute)
app.use(companyRoute)
app.use(rateRouter)
app.use(chatRoute)

server.listen(port,function(){
    console.log(`server running at port ${port}`)
})

const connectMe = io.of('/connectMe');
connectMe.on('connection', (socket) => {
  console.log('user connected');

  // socket.on('new-message', (message) => {
  //   console.log(message,'asd');
  //   socket.broadcast.emit('new-message',message)
  //   // sendMe(message)
  // });
  socket.on('chat-started', (socketId) => {
    console.log(socketId,'start');
    socket.broadcast.to(socketId).emit('new-message',{message:'started',customer:5})
    // sendMe(message)
  });
})
// io.on('connection', (socket) => {
//   console.log('user connected');

//   socket.on('new-message', (message) => {
//     console.log(message);
//     socket.broadcast.emit('new-message',message)
//     sendMe(message)
//   });
// });

function sendMe(socketId){
  // console.log(socketId,io.sockets.sockets);
  io.to(socketId).emit('new-message',"message")
}