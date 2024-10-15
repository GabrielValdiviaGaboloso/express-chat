const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuración de CORS para permitir peticiones desde tu frontend
app.use(cors({
  origin: 'https://prueba-chat.netlify.app', // URL del frontend en Netlify
  methods: ['GET', 'POST'],
}));

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

// Iniciar el servidor
server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
