import Layout from '../components/Layout';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import { useSession, signIn, signOut } from "next-auth/react"
const Chats = () => {
  
  const socket = io('https://j068dv68-8080.use2.devtunnels.ms/');
  const [contactos, setContactos] = useState([
    { user: null, fecha: null, mensajes: [{ tipomensaje: '', datemessage: '', content: '' }] },
  ]);
  const [webhookData, setWebhookData] = useState(null);
  
  const [mensajes, setMensajes] = useState(
     [
      { numero: '', tipo: '', contenido: '', estado: '', date: '' },
    ]
   
);
  const [numeroEspecifico, setNumeroEspecifico] = useState(''); // Reemplaza esto con el número que necesites
  const [inputValue, setInputValue] = useState('')
// Combina los mensajes entrantes y salientes en una sola lista


 
  
  const [msg, setMsg] = useState([]);


  const handleCambio = (data) => {
    console.log('Información del webhook recibida:', data);
    
    const nuevosContactos = [
      ...contactos,
      {
        user: data.payload.source,
        fecha: new Date(data.timestamp).toLocaleString('es-ES', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          timeZoneName: 'short',
        }),
      },
    ];
    let fecha = new Date(data.timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    })
    const nuevoMensaje = {
      numero: data.payload.destination,
      tipo: 'message-event',
      contenido: inputValue,
      estado: data.payload.type,
      date: fecha

    };
    setMsg((prevMsg) => [...prevMsg, mensajes.inputValue]);
    const nuevoMensajeEntrante = {
      numero: data.payload.source,
      tipo: data.type,
      contenido: data.payload.payload.text,
      date: fecha,
    };
    if(data.payload.payload == undefined){
      setMensajes((prevMensajes) => [...prevMensajes, nuevoMensaje]);
    }
    else{
      setMensajes((prevMensajes)=>[...prevMensajes, nuevoMensajeEntrante]);
    }
    
    if (contactos.fecha !== nuevosContactos.fecha) {
      setContactos(nuevosContactos);
    }
    const cont = parseInt(msg.length);
    console.log(cont);
    const webhookText = data ? data.payload.payload.text : null;
    setWebhookData(webhookText);
    
  };

  useEffect(() => {
    socket.on('cambio', handleCambio);
    return () => {
      socket.off('cambio', handleCambio);
      socket.disconnect();
    };
  }, [contactos]);

  const enviarMensaje = async () => {
    
    if (!inputValue.trim()) {
      console.log('Mensaje vacío, no se enviará.');
      return;
    }
    

    try {
      const mensajeData = {
        channel: 'whatsapp',
        source: '5718848135',
        'src.name': 'Pb1yes',
        destination: numeroEspecifico,
        message: inputValue,
        disablePreview: true,
      };
      console.log(mensajes)
      setMsg((prevMsg) => [...prevMsg, inputValue]);
      
      setMensajes((prevMensajes) => (
        [
          ...prevMensajes,
          {
            numero: numeroEspecifico,
            tipo: 'message-event',
            contenido: inputValue,
            date: new Date().toLocaleString(),
          },
        ]
      ));
      const response = await fetch('https://j068dv68-8080.use2.devtunnels.ms/api/envios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(mensajeData).toString(),
      });
      
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('Respuesta del servidor:', responseData);
      
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  useEffect(() => {
    const apiUrl2 = 'https://j068dv68-8080.use2.devtunnels.ms/api/users';
    fetch(apiUrl2, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        const nuevosContactos = data.users.map((usuario) => ({
          user: usuario.countryCode + usuario.phoneCode,
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

        setContactos(nuevosContactos);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

      
  }, []);
 
  const renderMensajes = (mensajesOrdenados) => {
    console.log(mensajes)
    const mensajesConContenido = mensajesOrdenados.filter(
      mensaje => mensaje.contenido && mensaje.contenido.trim() !== ''
    );
  
    if (mensajesConContenido.length === 0) {
      return mensajesConContenido.map((mensaje, index) => (
        <div key={index} className={`mensaje ${mensaje.tipo}`}>
          <p>{inputValue}</p>
          <span>{mensaje.date}</span>
        </div>
      ));  
    }
  
    return mensajesConContenido.map((mensaje, index) => (
      <div key={index} className={`mensaje ${mensaje.tipo}`}>
        <p>{mensaje.contenido}</p>
        <span>{mensaje.numero}</span>
      </div>
    ));
  };  
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
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
          <ContainerBox>
            <p>  mensaje:{webhookData}</p>
            <div>
            <h2>Todos los mensajes</h2>
            {renderMensajes(mensajes)}

      
      <h2>Mensajes Ordenados para {numeroEspecifico}</h2>
      {(() => {

        // Filtra los mensajes por el número específico
        const mensajesFiltrados = mensajes.filter(
          (mensaje) => mensaje.numero === numeroEspecifico) ;
        // Ordena los mensajes por fecha de forma ascendente (de la más antigua a la más reciente)
        return mensajesFiltrados.map((mensaje, index) => (
          <div key={index} className={`mensaje ${mensaje.tipo}`}>
            <p>{mensaje.contenido}</p>
            <span>{mensaje.date}</span>
          </div>
        ));
      })()}
    </div>
 

            
          </ContainerBox>
          <InputContainer>
            <InputMensaje
              type="text"
              placeholder="Escribe un mensaje..."
              value={inputValue}
              onChange={(e) =>
                setInputValue(e.target.value)
              }
            />
            
          </InputContainer>
          <BotonEnviar onClick={enviarMensaje}>Enviar</BotonEnviar>
        </Box>
        <Box>
          <div className="chat-container">
            <ul>
              {contactos.map((contacto, index) => (
                <li key={index}>
                  <strong onClick={() => setNumeroEspecifico(contacto.user)}>Usuario:</strong> {contacto.user},{' '}
                  <strong>Fecha:</strong> {contacto.fecha}
                </li>
              ))}
            </ul>
          </div>
        </Box>
      </Container>
    </Layout>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
    )

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

const ContainerBox = styled.div`
  background-color: #f7f7f7;
  padding: 15px;
  border-radius: 10px;
  overflow-y: scroll;
  max-height: 400px;
`;

const p = styled.div`
  background-color: ${(props) => (props.tipo === 'message-event' ? '#6e6e6' : '#4caf50')};
  color: ${(props) => (props.tipo === 'message-event' ? 'black' : 'white')};
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 5px;
`;



const InputContainer = styled.div`
  margin-top: 15px;
  display: flex;
  align-items: center;
`;

const InputMensaje = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-right: 10px;
`;

const BotonEnviar = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

export default Chats;
