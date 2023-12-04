import React, { useState, useEffect } from 'react'; 
import Layout from '../components/Layout';
import styled from 'styled-components';
import axios from 'axios'; // Importa axios aquíimport io from 'socket.io-client';
import MiComponente from '../components/websocket';

const Chat = () => {
  const [chatState, setChatState] = useState({
    mensaje: '',
    messages: [
      { tipo: 'texto', contenido: 'Hola, ¿cómo estás?' },
      { tipo: 'imagen', contenido: 'url_de_la_imagen' },
      { tipo: 'audio', contenido: 'url_del_audio' },
      { tipo: 'video', contenido: 'url_del_video' },
    ],
    inputValue: '',
  });
  const [contactos, setContactos] = useState([]);
 

  const enviarMensaje = () => {
    if (!chatState.inputValue.trim()) {
      console.log('Mensaje vacío, no se enviará.');
      return;
    }

    // Lógica para enviar el mensaje
    const apiKey = '6ovjpik6ouhlyoalchzu4r2csmeqwlbg';

    const data = {
      message: {
        type: 'text',
        text: chatState.inputValue,
      },
      channel: 'whatsapp',
      'src.name': 'Pb1yes',
      destination: '573124228889',
      source: '5718848135',
    };

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
    setContactos(data.users);
    console.log(data)
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
      <div className="message-list">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              sendMessage(e.target.value);
              e.target.value = '';
            }
          }}
        />
      </div>
    </div>
          
        </Box>

        <Box>
          <div className="chat-container">
            <ul>
            {contactos.map((elemento) => (
          <li key={elemento.id}>{elemento.phoneCode}</li>
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
            value={chatState.inputValue}
            onChange={(e) => setChatState(prevState => ({ ...prevState, inputValue: e.target.value }))}
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
