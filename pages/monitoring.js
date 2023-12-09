import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import io from 'socket.io-client';

// Defino el socket
const socket = io('https://3d29bmtd-8080.use2.devtunnels.ms/');

// Llama a los mensajes que entran en vivo
const MonitoringPage = () => {
  // Estado para almacenar los contactos y mensajes entrantes
  const [contactos, setContactos] = useState([]);
  const [nuevosMensajes, setNuevosMensajes] = useState([]);
  const [historialMensajes, setHistorialMensajes] = useState({});
  const [numeroSeleccionado, setNumeroSeleccionado] = useState(null);


  // Estado para almacenar el número entrante actual
  const [numeroActual, setNumeroActual] = useState(null);

  // Función para manejar el evento 'cambio' del socket
  const handleCambio = (data) => {
    // ... (tu lógica existente)

    // Actualizar el estado con el nuevo mensaje entrante
    const nuevoMensajeEntrante = {
      numeroEntrante: data.payload.source,
      tipo: data.type,
      contenido: data.payload.payload.text,
      date: new Date(data.timestamp).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
      }),
    };

    // Verificar si el número actual es diferente al nuevo número
    if (numeroActual !== nuevoMensajeEntrante.numeroEntrante) {
      // Actualizar el número actual
      setNumeroActual(nuevoMensajeEntrante.numeroEntrante);
    }

    setNuevosMensajes((prevMensajes) => [nuevoMensajeEntrante, ...prevMensajes]);

    // Agregar el encabezado al mensaje entrante
    console.log(`cliente: aca mensaje entrante - ${data.payload.payload.text}`);

    // Actualizar el historial de mensajes
    setHistorialMensajes((prevHistorial) => {
      const numero = nuevoMensajeEntrante.numeroEntrante;
      return {
        ...prevHistorial,
        [numero]: [...(prevHistorial[numero] || []), nuevoMensajeEntrante],
      };
    });

    // Guardar el mensaje en la base de datos MySQL
    const { numeroEntrante, tipo, contenido, date } = nuevoMensajeEntrante;

    const consultaSQL = 'INSERT INTO mensajes (numero, tipo, contenido, fecha) VALUES (?, ?, ?, ?)';
    promisePool.query(consultaSQL, [numeroEntrante, tipo, contenido, date])
      .then(([resultado]) => {
        console.log('Datos guardados en la base de datos:', resultado);
      })
      .catch((err) => {
        console.error('Error al guardar datos en la base de datos:', err);
      });
  };

  // Efecto para suscribirse y desuscribirse al evento 'cambio' del socket
  useEffect(() => {
    // Suscribirse al evento 'cambio'
    socket.on('cambio', handleCambio);

    // Desuscribirse cuando el componente se desmonta
    return () => {
      socket.off('cambio', handleCambio);
    };
  }, [contactos, numeroActual]); // Dependencia para evitar problemas con el cierre de useEffect

  return (
    <Layout>
      {numeroActual && (
        <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <p>Número actual: {numeroActual}</p>
        </div>
      )}

<p>Chats activos</p>
{/* Renderizar el estado actual de contactos */}
<ul>
  {contactos.map((contacto, index) => (
    <li key={index} onClick={() => setNumeroSeleccionado(contacto.user)}>
      {contacto.user}
    </li>
  ))}
</ul>

{numeroSeleccionado && (
  <div>
    <p>Historial de mensajes para {numeroSeleccionado}:</p>
    {historialMensajes[numeroSeleccionado] && (
      <div>
        {historialMensajes[numeroSeleccionado].map((mensaje, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <p>Contenido: {mensaje.contenido} - Fecha: {mensaje.date}</p>
          </div>
        ))}
      </div>
    )}
  </div>
)}

      {/* Renderizar los mensajes entrantes en tiempo real */}
      {nuevosMensajes.length > 0 && (
        <div>
          <p>Nuevos mensajes entrantes:</p>
          {nuevosMensajes.map((mensaje, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <p>Contenido: {mensaje.contenido} - Fecha: {mensaje.date}</p>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default MonitoringPage;
