import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();//приложение
const httpServer = createServer(app);//сервер
const io = new Server(httpServer, { /* options */ });//socket

app.get('/', (req, res) => {
    res.send('Hello it is WS server'); //создали endpoint
})

io.on("connection", (socket) => {
    // ...
});

httpServer.listen(3009, () =>{
    console.log('listening 3009...')
});