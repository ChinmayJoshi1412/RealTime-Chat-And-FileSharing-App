import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io';
import cors from 'cors';
import 'dotenv/config'
const app = express();
const server = createServer(app);
const io = new Server(server,{
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

server.listen(process.env.PORT,()=>{
    console.log(`Listening for messages on port ${process.env.PORT}`);
})

io.on('connection',(socket)=>{
    console.log('a user connected');
    socket.on('join',({name,chatroom})=>{
        console.log(`${name} joined chatroom: ${chatroom}`);
        socket.join(chatroom); 
    })
    socket.on('chat',(val)=>{
        const {msg,name,chatroom} = val;
        console.log(`Message received ${msg} by ${name} in ${chatroom}`);
        io.to(chatroom).emit('chat',{msg:msg,name:name});
    })
    socket.on('file-upload', (data) => {
        console.log('File received');
        const {fileName, fileData,name,chatroom} = data;
        io.to(chatroom).emit('file-received', { fileName, fileData,name,chatroom },()=>console.log('File sent'));
    });
    socket.on('disconnect',()=>{
        console.log('user disconnected');
    })
})