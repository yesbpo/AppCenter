import React, { useEffect, useState } from 'react';

const MensajesComponent = () => {
  const [mensajes1, setMensajes1] = useState([]);
  useEffect(() => {
    const obtenerMensajes = async () => {
      try {
        const response = await fetch('http://localhost:3001/obtener-mensajes');

        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setMensajes1(data);
      } catch (error) {
        console.error('Error al obtener mensajes:', error);
        // Puedes manejar el error según tus necesidades
      }
    };

    obtenerMensajes();
  }, []); // El segundo argumento del useEffect es un array de dependencias, en este caso, está vacío para que se ejecute solo una vez al montar el componente.

  return (
    <div>
      <h2>Mensajes:</h2>
      <ul>
        {mensajes1.map((mensaje) => (
          <li key={mensaje.id}>{mensaje.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default MensajesComponent;