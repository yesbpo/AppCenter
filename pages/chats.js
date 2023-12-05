import React, { useState, useEffect } from 'react'; 
import Layout from '../components/Layout';
import styled from 'styled-components';
import axios from 'axios'; // Importa axios aquíimport io from 'socket.io-client';
import MiComponente from '../components/websocket';
import io from 'socket.io-client';
const Chat = () => {
  
  const [mensajes, setMensajes] = useState({
    mensajeSaliente: [
      {numeroDestino:'',tipo: '', contenido:''}],
    mensajesEntrantes: [
      {numeroEntrante:'', tipo: '', contenido:'' }
      ],
    inputValue: '',
  });
  const [contactos, setContactos] = useState([{user: null, fecha:null}]);
  const [webhookData, setWebhookData] = useState(null);
  const [num, setNum] =useState(null)  
  useEffect(() => {
    // En tu aplicación de React
const socket = io('https://3d29bmtd-8080.use2.devtunnels.ms/');


    // Escuchar el evento 'cambio' y actualizar el estado del componente
socket.on('cambio', data => {
  console.log('Información del webhook recibida:', data);
  const nuevosContactos = [...contactos,  {
    
    user: data.payload.source,
    fecha: new Date(data.timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    
  })}];

  // Establece el estado de los contactos
  if (contactos.fecha !== nuevosContactos.fecha) {
    setContactos(nuevosContactos);
  }
;
  // Verificar si data.payload existe antes de acceder a data.payload.payload.text
  const webhookText = data ? data.payload.payload.text : null;
  const webhookNum = data ? data.payload.sender.phone : null;
  // Llamar a setWebhookData con el texto del webhook solo si existe
  setWebhookData(webhookText);
  setNum(webhookNum)
});


    // Limpiar el evento al desmontar el componente
    return () => {
      socket.disconnect();
    };
  }, []);


  const enviarMensaje = () => {
    if (!mensajes.inputValue.trim()) {
      console.log('Mensaje vacío, no se enviará.');
      return;
    }

    // Lógica para enviar el mensaje
    const apiKey = '6ovjpik6ouhlyoalchzu4r2csmeqwlbg';

    const data = {
      message: {
        type: 'text',
        text: mensajes.inputValue,
      },
      channel: 'whatsapp',
      'src.name': 'Pb1yes',
      destination: '573124228889',
      source: '5718848135',
    };
    const nuevoMensaje = {
      numeroDestino: '123456789', // Ingresa el número de destino
      tipo: 'saliente',
      contenido: mensajes.inputValue,
    };

    setMensajes((prevMensajes) => ({
      ...prevMensajes,
      mensajeSaliente: [...prevMensajes.mensajeSaliente, nuevoMensaje],
      inputValue: '', // Limpia el valor de entrada después de enviar
    }));

    axios.post('https://api.gupshup.io/sm/api/v1/msg', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json',
        'apikey': apiKey,
      },
    })
    .then(response => {
      // Manejar la respuesta aquí
      console.log(response.data);
    })
    .catch(error => {
      // Manejar errores aquí
      console.error('Error:', error);
    });
  };
// usuarios
useEffect(() => {
  const apiUrl2 = 'https://3d29bmtd-8080.use2.devtunnels.ms/api/users';
    fetch(apiUrl2, {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => {
      // Procesa los datos y configura los contactos
    const nuevosContactos = data.users.map((usuario) => ({
      user: usuario.phoneCode,
      fecha: new Date(usuario.lastMessageTimeStamp).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
      }),
    }));

    // Establece el estado de los contactos
    setContactos(nuevosContactos);
  
      
  })
  .catch(error => {
    console.error('Error:', error);
  });
  }, []);   
return (
    <Layout>
      
      <Box>
        <ButtonContainer>
          <CustomButton onClick={() => console.log('Activos')}>Activos</CustomButton>
          <CustomButton onClick={() => console.log('Pendientes')}>Pendientes</CustomButton>
          <CustomButton onClick={() => console.log('Cerrados')}>Cerrados</CustomButton>
          <CustomButton onClick={() => console.log('Agregar Número')}>Agregar Número</CustomButton>
        </ButtonContainer>
      </Box>

      <Container>
        <Box>
         
          <div className="chat-container">
        
      <p> Numero: {num} mensaje:{webhookData}</p>
      {/* Mostrar mensajes entrantes */}
      {mensajes.mensajesEntrantes.map((mensaje, index) => (
        <div key={index} className="mensaje entrante">
          {mensaje.contenido}
        </div>
      ))}

      {/* Mostrar mensajes salientes */}
      {mensajes.mensajeSaliente.map((mensaje, index) => (
        <div key={index} className="mensaje saliente">
          {mensaje.contenido}
        </div>
      ))}

      {/* Input para enviar mensajes */}
      
    </div>
          
        </Box>

        <Box>
          <div className="chat-container">
            <ul>
            {contactos.map((contacto, index) => (
          <li key={index}>
            <strong>Usuario:</strong> {contacto.user}, <strong>Fecha:</strong> {contacto.fecha}
          </li>
        ))}
            </ul>
            
          </div>
        </Box>
      </Container>

      <Box>
        <div className="input-container">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={mensajes.inputValue}
            onChange={(e) => setMensajes(prevState => ({ ...prevState, inputValue: e.target.value }))}
          />
          <button onClick={enviarMensaje}>Enviar</button>
        </div>
      </Box>
    </Layout>
  );
};

const Box = styled.div`
  padding: 30px;
  margin: 30px;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`;

const CustomButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;

  &:hover {
    background-color: #45a049;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Container = styled.div`
  display: flex;
  gap: 20px;
`;

export default Chat;
