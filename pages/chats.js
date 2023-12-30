import Layout from '../components/Layout';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import { useSession, signIn } from 'next-auth/react';
import EmojiPicker from 'emoji-picker-react';

const Chats = () => {
  const [statuschats, setStatuschats] = useState('')
  const containerRef = useRef(null);

  // Función para mantener el scroll en la parte inferior
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  // Efecto para ajustar el scroll cada vez que cambia el contenido de los mensajes
  
  useEffect(() => {
    scrollToBottom();
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
      setStatuschats('Pendientes')
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
    setStatuschats('En gestion')
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
  // Ejemplo de consumo de la ruta con JavaScript y fetch
const actualizarEstadoChatCerrados = async () => {
  conection();
const idChat2 = numeroEspecifico;
const nuevoEstado = 'closed';
const nuevoUserId = 0;

  try {
    const response = await fetch('https://appcenteryes.appcenteryes.com/db/actualizar-estado-chat', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idChat2: idChat2,
        nuevoEstado: nuevoEstado,
        nuevoUserId: nuevoUserId, // Puedes omitir esto si no deseas actualizar userId
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
    } else {
      console.error('Error en la solicitud:', response.statusText);
    }
  } catch (error) {
    console.error('Error de red:', error);
  }
};



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
  return (
    <>
      {session ? (
        <Layout className='big-box'>
          <Box className='estados' onLoad={updateuser()}>
            {/* ... (Contenido del componente Box) */}
          </Box>
          <Container>
            <Box className='container-messages'>
              {/* ... (Contenido del componente Box con la clase container-messages) */}
            </Box>
            <Box className='box-number-list'>
              {/* ... (Contenido del componente Box con la clase box-number-list) */}
            </Box>
          </Container>
        </Layout>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="mb-4">Not signed in</p>
          <button
            onClick={() => signIn()}
            className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
          >
            Sign in
          </button>
        </div>
      )}
    </>
  );
};

const Box = styled.div`
  padding: 30px;
  margin: 30px;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

  &.estados {
    /* Estilos específicos para la clase 'estados' */
  }

  &.container-messages {
    /* Estilos específicos para la clase 'container-messages' */
  }

  &.box-number-list {
    /* Estilos específicos para la clase 'box-number-list' */
  }
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
`;

// ... (Otros estilos según sea necesario)

export default Chats;