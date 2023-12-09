const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://3d29bmtd-8080.use2.devtunnels.ms", // Reemplaza con tu dominio
    methods: ["GET", "POST"]
  }
});
const port = 3001;

// Middleware para parsear el cuerpo de la solicitud como JSON
app.use(express.json());
// Ejemplo de configuración en Express
app.use((req, res, next) => {
  // Configuración de CORS en tu servidor WebSocket
res.header('Access-Control-Allow-Origin', '*');

  res.header('Access-Control-Allow-Methods', 'ALL');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Ruta para recibir solicitudes
const tata = app.all('/api/index', async (req, res) => {
  const userAgent = req.get('User-Agent');

  // Verifica si la solicitud es del User-Agent específico
  if (userAgent) {
    try {
      // Procesa la solicitud de manera asíncrona aquí
     var data = req.body;
      await processAsync(data);

      // Emitir el evento a través de Socket.IO para notificar cambios en tiempo real
      io.emit('cambio', data);
      console.log(data)
      // Acknowledge la recepción de manera síncrona e inmediata
      res.status(200).end();
      return data
    } catch (error) {
      // Maneja cualquier error durante el procesamiento asíncrono
      console.error('Error durante el procesamiento asíncrono:', error);
      res.status(500).send('Error interno del servidor.');
    }
    
  } else {
    // La solicitud no proviene de Gupshup, responde con un error
    res.status(403).send('Acceso no autorizado.');
  }
  console.log("paso" + data)
  return data
}
);

// Función asíncrona para procesar la solicitud
async function processAsync(datas) {
  // Implementa lógica de procesamiento asíncrono aquí
  // Puedes realizar operaciones de larga duración, como llamadas a bases de datos, envío de correos electrónicos, etc.
}

// Configuración de Socket.IO
io.on('connection', (socket) => {
  console.log('Cliente conectado');

  // Manejar la desconexión del cliente
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Iniciar el servidor
server.listen(port, () => {
  console.log(`Servidor y Socket.IO escuchando en http://localhost:${tata.data}`);
});
