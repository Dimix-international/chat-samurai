import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const cors = require('cors');
const app = express();//приложение

app.options('*', cors())

const httpServer = createServer(app);//сервер
const socket = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: 'GET,POST,PUT,DELETE',
        credentials:true
    }
});//socket

const messages = [
    {
        message: 'Hi Dima!! =)',
        id: 'fe3432',
        user: {id: 'sdsds33', name: 'Victor'}
    },
    {
        message: 'Hi Victor',
        id: 'fe3232wds32',
        user: {id: 'scsc3434', name: 'Dima'}
    },
    {
        message: 'Hi Vika eee!',
        id: 'fe3232wds32',
        user: {id: 'scsc3434', name: 'Dima'}
    },
    {
        message: 'Hi Vika eee!',
        id: 'fe3232wds32',
        user: {id: 'scsc3434', name: 'Dima'}
    },
]

app.get('/', (req, res) => {
    res.send('Hello it is WS server'); //создали endpoint
})

socket.on("connection", (socketChannel) => {
    // socket подписался на событие connection, и когда оно произойдет выполняется этот код

    //socketChannel - сокет канал с конкретным пользователем
    // дальнейшие подписки идут на него
    socketChannel.on("client-message-sent", (message:string) => {
        // socket подписался на событие client-message-sent, и когда оно произойдет выполняется этот код
        console.log(message)
    });

    //пользователь connected, пришелем ему те сообщения которые у нас уже есть messages[]
    socketChannel.emit('init-messages-published', messages);

    console.log(' a user connected')
});


const PORT = process.env.PORT || 4009;

httpServer.listen(PORT, () =>{
    console.log(`listening => http://localhost:${PORT}`)
});
