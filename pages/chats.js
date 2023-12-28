import Layout from '../components/Layout';
import React, { useState, useEffect, Component } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import { useSession, signIn } from 'next-auth/react';
import EmojiPicker from 'emoji-picker-react';

const Chats = () => {
  useEffect(() => {
    // Lógica que se ejecutará después del montaje del componente
    updateuser();
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez al montar el componente

  const { data: session } = useSession();
  const manejarPresionarEnter = (event) => {
    if (event.key === 'Enter') {
      
      enviarMensaje();
      
    }
  };
  
  const [emojis, setEmojis] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleAddEmoji = (emoji) => {
    setInputValue(`${inputValue} ${emoji}`);
    setEmojis([...emojis, emoji]);
    setShowEmojiPicker(false); // Ocultar el EmojiPicker después de seleccionar un emoji
  };
  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prevShow) => !prevShow);
  };
  
  const [contactos1, setContactos1] = useState([]);
  const [contactos, setContactos] = useState([
    { user: null, fecha: null, mensajes: [{ tipomensaje: '', datemessage: '', content: '' }] },
  ]);
  const [webhookData, setWebhookData] = useState(null);
  const [mensajes1, setMensajes1] = useState([]);
  
     const handlePendientesClick = async () => {
      conection();
    try {
      const response = await fetch('https://appcenteryes.appcenteryes.com/db/obtener-mensajes');
      const responseChats = await fetch('https://appcenteryes.appcenteryes.com/db/obtener-chats');
      const responseUsers = await fetch('https://appcenteryes.appcenteryes.com/db/obtener-usuarios');
      // El usuario está autenticado, puedes acceder a la sesión
      
      if (!response.ok) {
          }
      const users = await responseUsers.json()
      const Id = users.filter(d => d.usuario == session.user.name)
      const dataChats =  await responseChats.json();
      const chatsPending = dataChats.filter(d=> d.status == 'pending')
      const withoutGest = chatsPending.filter(d => d.userId == Id[0].id )
      console.log(Id)
      const data = await response.json();
      setMensajes1(data);
      setContactos1(withoutGest);
    } catch (error) {
    
      // Puedes manejar el error según tus necesidades
    }
  };
  const handleEngestionClick = async () => {
    conection();
    try {
      const response = await fetch('https://appcenteryes.appcenteryes.com/db/obtener-mensajes');
      const responseChats = await fetch('https://appcenteryes.appcenteryes.com/db/obtener-chats');
      const responseUsers = await fetch('https://appcenteryes.appcenteryes.com/db/obtener-usuarios');
      // El usuario está autenticado, puedes acceder a la sesión
      
      if (!response.ok) {
   
      }
      const users = await responseUsers.json()
      const Id = users.filter(d => d.usuario == session.user.name)
      const dataChats =  await responseChats.json();
      const chatsPending = dataChats.filter(d=> d.status == 'in process')
      const withoutGest = chatsPending.filter(d => d.userId == Id[0].id )
      console.log(Id)
      const data = await response.json();
      setMensajes1(data);
      setContactos1(withoutGest);
    } catch (error) {
    
      // Puedes manejar el error según tus necesidades
    }
  };

  const [mensajes, setMensajes] = useState(
     [
      { numero: '', tipo: '', contenido: '', estado: '', date: ''},
    ]   
);

const [file, setFile] = useState(null);
const [url, setUrl] = useState('');
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Selecciona un archivo primero.');
      return;
    }

    const formData = new FormData();
    formData.append('archivo', file);

    try {
      const response = await fetch('https://3d29bmtd-8080.use2.devtunnels.ms/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        // Actualizar el mensajeData para incluir información del archivo
        const mensajeData = {
          channel: 'whatsapp',
          source: '5718848135',
          'src.name': 'Pb1yes',
          destination: numeroEspecifico,
          message: JSON.stringify({
            type: 'image', // Puedes ajustar esto según el tipo de archivo
            originalUrl: data.url, // URL generada después de la carga del archivo
            previewUrl: data.url, // Puedes ajustar esto según tus necesidades
            caption: 'Envío de imagen',
          }),
          disablePreview: true,
        };

        const responseEnvio = await fetch('https://appcenteryes.appcenteryes.com/w/api/envios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(mensajeData).toString(),
        });

        if (!responseEnvio.ok) {
     
        }

        const responseData = await responseEnvio.json();
        console.log('Respuesta del servidor:', responseData);

        const idMessage = responseData.messageId;

        const actualizarMensajeResponse = await fetch('https://appcenteryes.appcenteryes.com/db/mensajeenviado', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: mensajeData.message,
            idMessage,
          }),
        });

        if (actualizarMensajeResponse.ok) {
          const actualizarMensajeData = await actualizarMensajeResponse.json();
     
        } else {
    
          // Resto del código para guardar el mensaje en el servidor...
        }
      } else {
        alert(`Error al subir el archivo: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
    
    }
  };


  const [numeroEspecifico, setNumeroEspecifico] = useState('');
  const actualizarEstadoChat = async (estado) => {
    conection();
    try {
      const idChat2 = numeroEspecifico; // Asegúrate de obtener el idChat2 según tu lógica
      const nuevoEstado = 'in process'; // Asegúrate de obtener el nuevoEstado según tu lógica

      const response = await fetch('https://appcenteryes.appcenteryes.com/db/actualizar-estado-chat', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idChat2, nuevoEstado }), // Ajusta la estructura del cuerpo según tus necesidades
      });

      if (response.ok) {
        const resultado = await response.json();
        
        // Manejar la respuesta exitosa según tus necesidades
      } else if (response.status === 404) {
    
        // Manejar el caso de chat no encontrado según tus necesidades
      } else {
    
        // Manejar otros errores según tus necesidades
      }
    } catch (error) {
    
      // Manejar errores generales según tus necesidades
    }
  };
   // Reemplaza esto con el número que necesites
  const [inputValue, setInputValue] = useState('')
  const [msg, setMsg] = useState([]);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  
  
  const conection =()=> {
    const socket = io('https://appcenteryes.appcenteryes.com/w');
    socket.on( async(data) => {
    
    
    
        try {
          const response = await fetch('https://appcenteryes.appcenteryes.com/db/obtener-mensajes');
  
          if (!response.ok) {
           
          }
  
          const data1 = await response.json();
          setMensajes1(data1);
        } catch (error) {
          
          // Puedes manejar el error según tus necesidades
        }
      

  
         
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
    
    const webhookText = data ? data.payload.payload.text : null;
    setWebhookData(webhookText);
    
  }
  )
  }
  const enviarMensaje = async () => {
  
    if (!inputValue.trim()){
      
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
      
      setMsg((prevMsg) => [...prevMsg, inputValue]);
      
      setMensajes((prevMensajes) => (
        [
          ...prevMensajes,
          {
            numero: mensajeData.destination,
            tipo: 'message-event',
            contenido: mensajeData.message,
            date: new Date().toLocaleString(),
          },
        ]
      ));
      const response = await fetch('https://appcenteryes.appcenteryes.com/w/api/envios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(mensajeData).toString(),
      });
      
      if (!response.ok) {
              }
      const responseData = await response.json();
      
       // Escucha el evento 'cambio' para obtener el idMessage
      const idMessage = responseData.messageId;

      // Actualiza el mensaje en el servidor
      const actualizarMensajeResponse = await fetch('https://appcenteryes.appcenteryes.com/db/mensajeenviado', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: mensajeData.message,
          idMessage,
        }),
      });

      if (actualizarMensajeResponse.ok) {
        const actualizarMensajeData = actualizarMensajeResponse.json();
            } else {
        
          // Guarda el mensaje en el servidor
    const guardarMensajeResponse = await fetch('https://appcenteryes.appcenteryes.com/db/guardar-mensajes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: mensajeData.message,
        type_comunication: 'message-event', // Puedes ajustar este valor según tus necesidades
        status: 'sent', // Puedes ajustar este valor según tus necesidades
        number: numeroEspecifico,
        type_message: 'text',
        timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
        idMessage: idMessage // Puedes ajustar este valor según tus necesidades
      }),
    });
    
    if (guardarMensajeResponse.ok) {
      const guardarMensajeData = await guardarMensajeResponse.json();
          } else {
      
    }conection()
      }
    
      setInputValue('')
      
    } catch (error) {
      
    }
  };

  useEffect(() => {
    const apiUrl2 = "https://appcenteryes,appcenteryes.com/w/api/users";
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
        
      });  
  }, []);
  const updateuser = async () => {
    const usuario = session.user.name; // Reemplaza con el nombre de usuario que deseas actualizar
    const nuevoDato = 'Activo'; // Reemplaza con el nuevo valor que deseas asignar
  
    try {
      const response = await fetch('https://appcenteryes.appcenteryes.com/db/actualizar/usuario', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nuevoDato: nuevoDato,
          usuario: usuario
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
       // Aquí puedes manejar la respuesta del servidor
      } else {
        console.error('Error al actualizar el usuario:', response.statusText);
      }
      try {
        const response = await fetch('https://appcenteryes.appcenteryes.com/db/obtener-mensajes');

        if (!response.ok) {
          
        }

        const data1 = await response.json();
        setMensajes1(data1);
      } catch (error) {
        
        // Puedes manejar el error según tus necesidades
      }
    
    } catch (error) {
      
    }
  };
  if(session){
  return (
  <>
    
      <Layout>
      <p>Bienvenido, {session.user.type_user}!</p>        
      <Box  onLoad={updateuser()}>
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
  // Filtra los mensajes por el número específico y contenido no vacío
  const mensajesFiltrados = mensajes1
    .filter((mensaje) => mensaje.number === numeroEspecifico && mensaje.content && mensaje.content.trim() !== '')
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // Ordena los mensajes por fecha

  // Mapea y renderiza los mensajes ordenados
  return mensajesFiltrados.map((mensaje, index) => (
    <div
      key={index}
      className={`mensaje ${mensaje.type_message} ${
        mensaje.type_comunication === 'message-event' ? 'bg-white text-right' : 'bg-green-500 text-left'
      } p-4 mb-4`}
    >
      {mensaje.type_message === 'image' ? (
        <img src={mensaje.content} alt="Imagen" className="w-full" />
      ) : mensaje.type_message === 'audio' ? (
        <audio controls>
          <source src={mensaje.content} type="audio/mp3" />
          Tu navegador no soporta el elemento de audio.
        </audio>
      ) : mensaje.type_message === 'sticker' ? (
        <img src={mensaje.content} alt="Sticker" className="w-20" />
      ) : mensaje.type_message === 'video' ? (
        <video controls className="w-full">
          <source src={mensaje.content} type="video/mp4" />
          Tu navegador no soporta el elemento de video.
        </video>
      ) : mensaje.type_message === 'file' ? (
        <a href={mensaje.content} target="_blank" rel="noopener noreferrer" className="text-blue-500">
          Descargar documento
        </a>
      ) : (
        <>
          <p className="mb-2">{mensaje.content && mensaje.content.trim()}</p>
          <span className="text-gray-500">{mensaje.timestamp}</span>
        </>
      )}
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
              onKeyDown={manejarPresionarEnter}
              onChange={(e) =>
                setInputValue(e.target.value)
              }
            />
             <button onClick={toggleEmojiPicker}>😊</button>
          </InputContainer>
          {showEmojiPicker && (
          <EmojiPicker
            onEmojiClick={(emoji) => handleAddEmoji(emoji.emoji)}
            disableAutoFocus
          />
        )}
          <BotonEnviar onClick={enviarMensaje} >Enviar</BotonEnviar>
          <button onClick={actualizarEstadoChat} >Gestionar</button><button >Cerrar</button>
          <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir Archivo</button>
    </div>
        </Box>
        <Box>
        
          <div className="chat-container">
            <ul>
              {contactos1.map((contacto, index) => (
                <li key={index}>
                  
                  <CustomButton onClick={() => setNumeroEspecifico(contacto.idChat2)}>Usuario:{contacto.idChat2}</CustomButton>
                   
                </li>
              ))}
            </ul>
          </div>
        </Box>
      </Container>
    </Layout>
      </>
  )}
  return (
    <>
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="mb-4">Not signed in</p>
      <button
        onClick={() => signIn()}
        className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
      >
        Sign in
      </button>
    </div>
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
  scroll-behavior: smooth;
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
