import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const MiComponente = () => {
  const [webhookData, setWebhookData] = useState(null);
    
  useEffect(() => {
    // En tu aplicación de React
const socket = io('https://3d29bmtd-8080.use2.devtunnels.ms/');


    // Escuchar el evento 'cambio' y actualizar el estado del componente
socket.on('cambio', data => {
  console.log('Información del webhook recibida:', data);

  // Verificar si data.payload existe antes de acceder a data.payload.payload.text
  const webhookText = data ? data.payload.payload.text : null;

  // Llamar a setWebhookData con el texto del webhook solo si existe
  setWebhookData(webhookText);
});


    // Limpiar el evento al desmontar el componente
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      {webhookData ? (
        <p>Información del webhook: {webhookData}</p>
      ) : (
        <p>Esperando información del webhook...</p>
      )}
    </div>
  );
};

export default MiComponente;
