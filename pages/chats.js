import Layout from '../components/Layout';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import { useSession, signIn } from 'next-auth/react';
import EmojiPicker from 'emoji-picker-react';
import { PaperAirplaneIcon, PaperClipIcon, UserGroupIcon } from '@heroicons/react/solid';
import AddNumber from '../components/AddNumber';
const Chats = () => {
  const [showPopup, setShowPopup] = useState(false);

  // Función para abrir la ventana emergente
  const openPopup = () => {
    setShowPopup(true);
  };

  // Función para cerrar la ventana emergente
  const closePopup = () => {
    setShowPopup(false);
  };
  //logica agregar numero 
 
const [numericInputValue, setNumericInputValue] = useState('');
const [templates, setTemplates] = useState([]);
const [selectedTemplateId, setSelectedTemplateId] = useState('');
const [templateParams, setTemplateParams] = useState({}); // Nuevo estado para los parámetros
const [error, setError] = useState(null);
function contarOcurrencias(texto, patron) {
 const regex = new RegExp(patron, 'g');
 const coincidencias = texto.match(regex);
 const componentes = Array.from({ length: coincidencias }, (v, index) => index);
 
 return coincidencias ? coincidencias : 0;
}


// GET TEMPLATES
useEffect(() => {
 // Traer las plantillas al cargar el componente
 const fetchTemplates = async () => {
   try {
     // Utilizar el servidor proxy en lugar de la URL directa
     const response = await fetch('https://appcenteryes.appcenteryes.com/w/gupshup-templates');

     if (!response.ok) {
       throw new Error(HTTP `error! Status: ${response.status}`);
     }

     const data = await response.json();

     if (data.status === "success") {
       const processedTemplates = data.templates.map(template => ({
         id: template.id, // Asegúrate de incluir el ID
         category: template.category,
         createdOn: template.createdOn,
         data: template.data,
         elementName: template.elementName,
         languageCode: template.languageCode,
         status: template.status,
         templateType: template.templateType,
         modifiedOn: template.modifiedOn,
         params: template.params || [], // Asegúrate de que tu plantilla tenga una propiedad params
       }));

       setTemplates(processedTemplates);
     } else {
       setError(`Error: ${data.message}`);
     }
   } catch (error) {
     setError(Fetch `error: ${error.message}`);
   }
 };

 fetchTemplates();
}, []);
const handleParamChange = (param, value) => {
 setTemplateParams((prevParams) => {
   const updatedParams = {
     ...prevParams,
     [param]: value,
   };
   console.log('Updated Params:', updatedParams);
   return updatedParams;
 });
};

const handleTemplateChange = (event) => {
 const selectedTemplateId = event.target.value;
 setSelectedTemplateId(selectedTemplateId);
};

const enviarSolicitud = async () => {
 if (!selectedTemplateId) {
   console.error('Error: No se ha seleccionado ninguna plantilla.');
   return;
 }

 const selectedTemplate = templates.find((template) => template.id === selectedTemplateId);

 if (!selectedTemplate) {
   console.error('Error: No se encontró la plantilla seleccionada.');
   return;
 }

 const url = 'https://api.gupshup.io/wa/api/v1/template/msg';
 const apiKey = '6ovjpik6ouhlyoalchzu4r2csmeqwlbg';

 const data = new URLSearchParams();
 data.append('channel', 'whatsapp');
 data.append('source', '573202482534');
 data.append('destination', numericInputValue);
 data.append('src.name', 'YESVARIOS');
 data.append('template', JSON.stringify({
   id: selectedTemplate.id,
   params: Object.values(templateParams) || [] // Asegúrate de que tu plantilla tenga una propiedad params
 }));

 try {
   const response = await fetch(url, {
     method: 'POST',
     headers: {
       'Cache-Control': 'no-cache',
       'Content-Type': 'application/x-www-form-urlencoded',
       'apikey': apiKey,
       'cache-control': 'no-cache',
     },
     body: data,
   });

   const responseData = await response.json();
   console.log('Respuesta:', templateParams);
 } catch (error) {
   console.error('Error al enviar la solicitud:', error);
 }
};

const handleNumericInputChange = (value) => {
 // Permite solo números y limita a 10 caracteres
 const newValue = value.replace(/[^0-9]/g, '').slice(0, 10);
 setNumericInputValue(newValue);
 console.log('Valor numérico ingresado:', newValue);
};

const handleAgregarNumeroClick = () => {
 // Llamamos a la función enviarSolicitud al hacer clic en el botón
 enviarSolicitud();
};
  // logica chats
  const [statuschats, setStatuschats] = useState('')
  const containerRef = useRef(null);
  const [pendientes, setPendientes] = useState('');
  const [engestion, setEngestion] = useState('');
  
  // Función para mantener el scroll en la parte inferior
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  // Efecto para ajustar el scroll cada vez que cambia el contenido de los mensajes
  
  useEffect(() => {
    scrollToBottom();
    
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
      setPendientes(withoutGest.length)
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
      setEngestion(withoutGest.length)
    } catch (error) {
    
      // Puedes manejar el error según tus necesidades
    }
  };

  const [mensajes, setMensajes] = useState(
     [
      { numero: '', tipo: '', contenido: '', estado: '', date: ''},
    ]   
);

const [file, setFile] = useState('');

const fileInputRef = useRef(null);

const handleButtonClick = () => {
  // Simular clic en el input de archivo cuando se hace clic en el botón
  fileInputRef.current.click();
};

const handleFileChange = (e) => {
  // Manejar el cambio de archivo aquí
  setFile(e.target.files[0]);
  console.log('Archivo seleccionado:', file.name);
};

  // Llamada a la función
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
          
            // Se ejecutará cada vez que el componente se monte o actualice
            const audioElement = new Audio('https://appcenteryes.appcenteryes.com/w/uploads/short-success-sound-glockenspiel-treasure-video-game-6346.mp3');
          
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
    if (file) {
     
      try {
        const formData = new FormData();
        formData.append('archivo', file);

        const response = await fetch('https://appcenteryes.appcenteryes.com/w/subir-archivo', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }
        else{
          const base = "https://appcenteryes.appcenteryes.com"

          const responseData = await response.json();

        if (responseData.url) {
          alert(`El archivo se cargó correctamente. URL: ${responseData.url}`);
        } else {
          throw new Error('No se recibió una URL del servidor.');
        }
          const fechaActual = new Date();
          const options = { timeZone: 'America/Bogota', hour12: false };
          const anio = fechaActual.getFullYear();
          const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
          const dia = fechaActual.getDate().toString().padStart(2, '0');
          const hora = fechaActual.getHours().toString().padStart(2, '0');
          const minutos = fechaActual.getMinutes().toString().padStart(2, '0');
          const segundos = fechaActual.getSeconds().toString().padStart(2, '0');
          const documentUrl = responseData.url;
          const cleanedType = file.type.includes('application')
          ? 'file'
          :  file.type.replace(/^(image|video)\/(.+)$/, '$1');
          let tipoadjunto;
          switch (cleanedType) {
            case 'file':
              // Lógica para el tipo 'file'
              tipoadjunto = {
                type: cleanedType,
                url: base + documentUrl,
                filename: file, 
              };
              break;
            
            case 'video':
              // Lógica para el tipo 'video'
              tipoadjunto = {
                type: 'video',
                url: base + documentUrl,
                caption: inputValue,
              };
              break;
          
            case 'image':
              // Lógica para el tipo 'image'
              tipoadjunto = {
                type: 'image',
                originalUrl: base + documentUrl,
                previewUrl: base + documentUrl,
                caption: inputValue,
              };
              break;
              case 'audio':
              // Lógica para el tipo 'image'
              tipoadjunto = {
                type: 'audio',
                originalUrl: base + documentUrl,
                previewUrl: base + documentUrl,
                caption: inputValue,
              };
              break;
            default:
              // Lógica para otros tipos, si es necesario
              tipoadjunto = null;
              break;
          }
          
         // Preparar datos del mensaje
        const mensajeData = {
          channel: 'whatsapp',
          source: '573202482534',
          'src.name': 'YESVARIOS',
          destination: numeroEspecifico,
          message: JSON.stringify(tipoadjunto),
          disablePreview: true,
        };
        // Enviar mensaje a través de la API de envíos
        const envioResponse = await fetch('https://appcenteryes.appcenteryes.com/w/api/envios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(mensajeData).toString(),
        });
        if (!envioResponse.ok) {
          throw new Error(`Error al enviar el mensaje: ${envioResponse.status} ${envioResponse.statusText}`);
        }
        
        const envioData = await envioResponse.json();
        console.log('Respuesta del servidor de envíos:',documentUrl );
        const idMessage = envioData.messageId;
        // Actualizar el mensaje enviado en el servidor
        const guardarMensajeResponse = await fetch('https://appcenteryes.appcenteryes.com/db/guardar-mensajes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: {file: base + documentUrl,  text: mensajeData.message.caption},
          type_comunication: 'message-event', // Puedes ajustar este valor según tus necesidades
          status: 'sent', // Puedes ajustar este valor según tus necesidades
          number: numeroEspecifico,
          type_message: cleanedType,
          timestamp: `${anio}-${mes}-${dia} ${hora}:${minutos}:${segundos}`,
          idMessage: idMessage // Puedes ajustar este valor según tus necesidades
        }),
      });
      if (guardarMensajeResponse.ok) {
        const guardarMensajeData = await guardarMensajeResponse.json();
        console.log(guardarMensajeData)
        setInputValue('')
        setFile('')
      } else { 
      }
        
        }
        
      } catch (error) {
        console.error('Error al subir el archivo:', error.message);
        setInputValue('')
      }
    } else{
    if (!inputValue.trim()){
      
      return;
    }
    try {
      const mensajeData = {
        channel: 'whatsapp',
        source: '3202482534',
        'src.name': 'YESVARIOS',
        destination: numeroEspecifico,
        message: inputValue,
        disablePreview: true,
      };
      
      setMsg((prevMsg) => [...prevMsg, inputValue]);
      const fechaActual = new Date();
const options = { timeZone: 'America/Bogota', hour12: false };
const anio = fechaActual.getFullYear();
const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
const dia = fechaActual.getDate().toString().padStart(2, '0');
const hora = fechaActual.getHours().toString().padStart(2, '0');
const minutos = fechaActual.getMinutes().toString().padStart(2, '0');
const segundos = fechaActual.getSeconds().toString().padStart(2, '0');
      setMensajes((prevMensajes) => (
        [
          ...prevMensajes,
          {
            numero: mensajeData.destination,
            tipo: 'message-event',
            contenido: mensajeData.message,
            date: `${anio}-${mes}-${dia} ${hora}:${minutos}:${segundos}`,
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
        content: inputValue,
        type_comunication: 'message-event', // Puedes ajustar este valor según tus necesidades
        status: 'sent', // Puedes ajustar este valor según tus necesidades
        number: numeroEspecifico,
        type_message: 'text',
        timestamp: `${anio}-${mes}-${dia} ${hora}:${minutos}:${segundos}`,
        idMessage: idMessage // Puedes ajustar este valor según tus necesidades
      }),
    });
    
    if (guardarMensajeResponse.ok) {
      const guardarMensajeData = await guardarMensajeResponse.json();
      console.log(guardarMensajeData)
      setInputValue('')
          } else {
      
    }conection()
      }
    
      
      
    } catch (error) {
      
    }
  };

  
  };
  const updateuser = async () => {
    const usuario = session.user.name; // Reemplaza con el nombre de usuario que deseas actualizar
    const nuevoDato = 'Activo'; // Reemplaza con el nuevo valor que deseas asignar
    
      try {
        const response = await fetch('https://appcenteryes.appcenteryes.com/db/obtener-mensajes');

        if (!response.ok) {
          
        }

        const data1 = await response.json();
        setMensajes1(data1);
      } catch (error) {
        
        // Puedes manejar el error según tus necesidades
      }
    
  }
  
  function limpiarLink(dataString) {
    const match = dataString.match(/"file":"([^"]*)"/);
    return match ? match[1] : null;
  }
  
  if(session){
    return (
    <>
     {showPopup &&  <div className="fixed inset-0 flex items-center justify-center">
      
    <div className="bg-black bg-opacity-50 " ></div>
    <div className="bg-white p-6 rounded shadow-lg w-96">
    <button
        onClick={closePopup}
        className="mb-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Cerrar
      </button>

      <label htmlFor="destinationInput" className="block text-sm font-medium text-gray-700">
        Número de destino (máximo 10 dígitos):
      </label>
      <input
        type="text"
        id="destinationInput"
        value={numericInputValue}
        onChange={(e) => handleNumericInputChange(e.target.value)}
        className="mt-1 p-2 border border-gray-300 rounded-md"
      />
      <button
        onClick={handleAgregarNumeroClick}
        className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Agregar Número
      </button>

      <h2 className="mt-4 text-lg font-semibold">Plantillas:</h2>
      <select
        value={selectedTemplateId}
        onChange={handleTemplateChange}
        className="mt-1 p-2 border border-gray-300 rounded-md"
      >
        <option value="" disabled>Select a template</option>
        {templates.map((template) => (
         
          <option key={template.id} value={template.id}>
            {template.data}{contarOcurrencias(template.data, '{{.*?}}')}
          </option>
        ))}
      </select>

      {templates.map(
        (template) =>
          template.id === selectedTemplateId &&
          template.params && (
            <div key={template.id} className="mt-4">
              <h3 className="text-lg font-semibold">Parámetros:</h3>
              {contarOcurrencias(template.data, '{{.*?}}').length > 0 && contarOcurrencias(template.data, '{{.*?}}').map((param) => (
                <div key={param} className="mt-2">
                  <label htmlFor={param} className="block text-sm font-medium text-gray-700">
                    {param}:
                  </label>
                  <input
                    type="text"
                    id={param}
                    onChange={(e) => handleParamChange(param, e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>
          )
      )}
    </div>
  </div>}
        <Layout className='big-box'>
                
        <Box className='estados' onLoad={updateuser()}>
          <ButtonContainer>
            <CustomButton onClick={handleEngestionClick}>{"En gestion: "+engestion}</CustomButton>
             {/* Mostrar Activos si 'mostrarActivos' es true */}
            <CustomButton onClick={handlePendientesClick}>{"Pendientes: "+pendientes}</CustomButton>
            <CustomButton onClick={openPopup}>Agregar Número</CustomButton>
          </ButtonContainer>
        </Box>
        <Container>
        <Box className='container-messages w-50vw h-40vh flex'>
  {/* Contenedor del chat */}
  
  <div className='chat-container '>
    <Box className="bg-primary">
    <h2 className='text-white'>Chat {numeroEspecifico}</h2>
    <BotonEnviar onClick={actualizarEstadoChat}>Gestionar</BotonEnviar>
    <BotonEnviar onClick={actualizarEstadoChatCerrados}>Cerrar</BotonEnviar>
    <ContainerBox ref={containerRef} className='bg-primary'>
      <div className='message-list '>
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
                mensaje.type_comunication === 'message-event' ? 'bg-white text-right shadow-lg p-4 bg-gray rounded-md' : 'bg-green text-left shadow-lg p-4 bg-gray rounded-md'
              } p-4 mb-4`}
            > 
        
              { mensaje.type_message === 'image'  ? (
                <img src={limpiarLink(mensaje.content) || mensaje.content}  alt="Imagen" className="w-15vw shadow-md p-4 bg-gray rounded-md" />
              ) :mensaje.type_message === 'image' ? (
                <img src={limpiarLink(mensaje.content)} alt="Imagen" className="w-15vw" />
              ): mensaje.type_message === 'audio' ? (
                <audio controls>
                  <source src={mensaje.content} type="audio/mp3" />
                  Tu navegador no soporta el elemento de audio.
                </audio>
              ) : mensaje.type_message === 'sticker' ? (
                <img src={mensaje.content} alt="Sticker" className="w-15vw" />
              ) : mensaje.type_message === 'video' ? (
                <video controls className="w-15vw">
                  <source src={limpiarLink(mensaje.content)||mensaje.content} type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
              ) : mensaje.type_message === 'file' ? (
                <a href={ limpiarLink(mensaje.content)||mensaje.content} target="_blank" rel="noopener noreferrer" className="text-blue">
                  Descargar documento
                </a>
              ) : (
                <>
                  <p className="mb-2">{mensaje.content && mensaje.content.trim()}</p>
                  <span >{mensaje.status +" "+ mensaje.timestamp}</span>
                </>
              )}
              
            </div>
          ));
        })()}
      </div>
      
    </ContainerBox >
    {/* Contenedor de entrada y botones */}
    <div className='input-container'>
      <InputContainer className='input-box'>
        <InputMensaje
          type="text"
          placeholder="Escribe un mensaje..."
          value={inputValue}
          onKeyDown={manejarPresionarEnter}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <BotonEnviar onClick={enviarMensaje}><PaperAirplaneIcon className="h-5 w-5" /></BotonEnviar>
        <button onClick={toggleEmojiPicker}>😊</button>
        <label className="custom-file-input-label" onClick={handleButtonClick}>
      <PaperClipIcon className="w-5 h-10 mr-2" />{file.name }
      </label>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
         // Puedes ajustar las extensiones permitidas
      />
      
        
      </InputContainer>
      {showEmojiPicker && (
        <EmojiPicker
          onEmojiClick={(emoji) => handleAddEmoji(emoji.emoji)}
          disableAutoFocus
        />
      )}
    </div>

    </Box>
    
    {/* Botones de acción */}
    <div className='action-buttons'>
      
      
      <div>
      <div>
      
      
    </div> 
       
 
      </div>
    </div>
  </div>

  {/* Contenedor de contactos */}
  <ContainerBox >
  <Box className='bg-blue-900'>
    <div className="contact-list-container">
      <h1>{statuschats}</h1>
      <ul>
        {contactos1.map((contacto, index) => (
          <li key={index}>
            <CustomButton onClick={() => setNumeroEspecifico(contacto.idChat2)}>
              <UserGroupIcon className="w-5 h-10"/> {contacto.idChat2}
            </CustomButton>
          </li>
        ))}
      </ul>
    </div>
  </Box>
  </ContainerBox>
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
max-height: 300px;
max-width: 500px;
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
  