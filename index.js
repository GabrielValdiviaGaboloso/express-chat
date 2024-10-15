const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const cors = require('cors');

const port = process.env.PORT || 3000;



// Configurar el socket
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  // Escuchar los mensajes entrantes del cliente
  socket.on('chat message', (msg) => {
    console.log('Mensaje recibido: ' + msg);
    io.emit('chat message', msg); // Emitir el mensaje a todos los usuarios conectados
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Configurar Express para servir los archivos del frontend (build de React)
app.use(cors({
    origin: 'https://express-chat-26up.onrender.com', // Reemplaza con la URL de tu frontend en Netlify
    methods: ['GET', 'POST'],
  }));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../chat-app-client/build', 'index.html'));
});

// Iniciar el servidor
// server.listen(3000, () => {
//   console.log('Servidor escuchando en http://localhost:3000');
// });

server.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });