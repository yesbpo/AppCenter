import Layout from '../components/Layout';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import { useSession } from 'next-auth/react';
import EmojiPicker from 'emoji-picker-react';
import { Pendientes } from '../components/Pendientes';
const Chats = () => {
  const { data: session } = useSession()
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiClick = (_, emojiObject) => {
    setInputValue((prevValue) => prevValue + emojiObject.target);
    console.log(emojiObject.target.src)
  };
  const toggleEmojiPicker = () => {
    
    setShowEmojiPicker((prevShow) => !prevShow);
  };
  const socket = io('https://3d29bmtd-8080.use2.devtunnels.ms/');
  const [contactos, setContactos] = useState([
    { user: null, fecha: null, mensajes: [{ tipomensaje: '', datemessage: '', content: '' }] },
  ]);
  const [webhookData, setWebhookData] = useState(null);
  const [mensajes, setMensajes] = useState(
     [
      { numero: '', tipo: '', contenido: '', estado: '', date: ''},
    ]   
);
    
  const [mostrarPendientes, setMostrarPendientes] = useState(false);
  const [mostrarEngestion, setMostrarEngestion] = useState(false);
  const handlePendientesClick = () => {
    setMostrarPendientes(true);
  };
  const handleEngestionClick = () => {
    setMostrarEngestion(true);
  };
  const [numeroEspecifico, setNumeroEspecifico] = useState('');
   // Reemplaza esto con el número que necesites
  const [inputValue, setInputValue] = useState('')
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const response = await fetch('https://3d29bmtd-8080.use2.devtunnels.ms/api/envios', {
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
    const apiUrl2 = "https://3d29bmtd-8080.use2.devtunnels.ms/api/users";
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
  const actualizarUsuario = async () => {
    const url = 'https://3d29bmtd-8080.use2.devtunnels.ms/actualizarUsuario'; // Asegúrate de que la URL sea correcta
  
    const usuario = session.user.name; // Reemplaza con el nombre de usuario que deseas actualizar
    const nuevoDato = 'Activo'; // Reemplaza con el nuevo valor que deseas asignar
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: usuario,
          nuevoDato: nuevoDato,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data); // Aquí puedes manejar la respuesta del servidor
      } else {
        console.error('Error al actualizar el usuario:', response.statusText);
      }
    } catch (error) {
      console.error('Error de red:', error.message);
    }
  };
  
  
  
  
  return (
  <>
    Signed in as {session.user.name} <br />
      <Layout>
        <Box onLoad={actualizarUsuario()}>
        <ButtonContainer>
          <CustomButton onClick={handleEngestionClick}>En gestion</CustomButton>
           {/* Mostrar Activos si 'mostrarActivos' es true */}
          <CustomButton onClick={handlePendientesClick}>Pendientes</CustomButton>
          <CustomButton onClick={() => console.log('Cerrados')}>Cerrados</CustomButton>
          <CustomButton onClick={() => console.log('Agregar Número')}>Agregar Número</CustomButton>
        </ButtonContainer>
      </Box>
      <Container>
        <Box>
          
          <ContainerBox>
            
            <div>
            

      
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
             <button onClick={toggleEmojiPicker}>😊</button>
          </InputContainer>
          {showEmojiPicker && (
        <EmojiPicker onEmojiClick={handleEmojiClick} />
      )}
          <BotonEnviar onClick={enviarMensaje}>Enviar</BotonEnviar>
        </Box>
        <Box>
        {mostrarPendientes && <Pendientes mensajes={mensajes} acivarengestion={mostrarEngestion} />}
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
