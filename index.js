const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose'); // Importar mongoose
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000; // Usa el puerto asignado por Render

// Conectar a MongoDB Atlas
const mongoURI = 'mongodb+srv://gaboangel123:7FgfNTYmdlJKQHcg@cluster-chat-react.re8rl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-chat-react'; // Cambia esto
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Definir el esquema y modelo de mensaje
const messageSchema = new mongoose.Schema({
  content: String,
  timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.model('Message', messageSchema);

// Middleware para permitir CORS
app.use(cors({
    origin: 'https://prueba-chat.netlify.app', // Reemplaza con la URL de tu frontend en Netlify
    methods: ['GET', 'POST'],
}));

// Obtener mensajes almacenados al cargar la página
app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 }); // Ordenar por fecha
    res.json(messages);
  } catch (error) {
    res.status(500).send('Error al obtener mensajes');
  }
});

// Configurar el socket
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  // Emitir mensajes existentes a los nuevos usuarios
  Message.find().sort({ timestamp: 1 }).then(messages => {
    socket.emit('load messages', messages);
  });

  // Escuchar los mensajes entrantes del cliente
  socket.on('chat message', async (msg) => {
    console.log('Mensaje recibido: ' + msg);
    
    // Guardar el mensaje en la base de datos
    const newMessage = new Message({ content: msg });
    await newMessage.save();

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
