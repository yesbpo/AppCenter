import React, { useState, useEffect } from 'react'; 
import Layout from '../components/Layout';
import styled from 'styled-components';
import axios from 'axios'; // Importa axios aquí

const Chat = (props) => {
  const [messages, setMessages] = useState([
    { tipo: 'texto', contenido: 'Hola, ¿cómo estás?' },
    { tipo: 'imagen', contenido: 'url_de_la_imagen' },
    { tipo: 'audio', contenido: 'url_del_audio' },
    { tipo: 'video', contenido: 'url_del_video' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [apiResponse, setApiResponse] = useState(null);

  // Define la función handleInputChange
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Define la función ResCha
  const ResCha = () => {
    const apiKey = '6ovjpik6ouhlyoalchzu4r2csmeqwlbg';

    const data = {
      message: {
        type: 'text',
        text: 'Hola, este es un mensaje normal',
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

//Llamar a los registros
useEffect(() => {
  const apiKey = '6ovjpik6ouhlyoalchzu4r2csmeqwlbg'; // Reemplaza 'API' con tu clave API

  axios.get('https://api.gupshup.io/sm/api/v1/users/Pb1yes?maxResult=1000', {
    headers: {
      'apikey': apiKey,
    },
  })
    .then(response => {
      // Almacena la respuesta en el estado local
      setApiResponse(response.data);
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
            {messages.map((mensaje, index) => (
              <div key={index} className="mensaje">
                {mensaje.tipo === 'texto' && <p>{mensaje.contenido}</p>}
                {mensaje.tipo === 'imagen' && <img src={mensaje.contenido} alt="Imagen" />}
                {mensaje.tipo === 'video' && <video src={mensaje.contenido} controls />}
                {mensaje.tipo === 'audio' && <audio src={mensaje.contenido} controls />}
              </div>
            ))}
          </div>
        </Box>

    
        <Box>
          <div className="chat-container">
            {/* Muestra la respuesta de la API en la interfaz */}
            {apiResponse && (
              <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
            )}
          </div>
        </Box>
      </Container>

      <Box>
        <div className="input-container">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={inputValue}
            onChange={handleInputChange}
          />
          <button onClick={ResCha}>Enviar</button>
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
