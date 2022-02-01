import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();//приложение
const httpServer = createServer(app);//сервер
const socket = new Server(httpServer, {
    cors: {
        origin: "https://localhost:3000"
    }
});//socket

app.get('/', (req, res) => {
    res.send('Hello it is WS server'); //создали endpoint
})

socket.on("connection", (connection) => {
    // socket подписался на событие connection, и когда оно произойдет выполняется этот код
    console.log(' a user connected')
});

const PORT = process.env.PORT || 3009;

httpServer.listen(PORT, () =>{
    console.log('listening 3009...')
});