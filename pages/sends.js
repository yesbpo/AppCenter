import React, { useState, useEffect } from 'react';
import Layout from "../components/Layout";
import styled from "styled-components";
import * as XLSX from 'xlsx';
import axios from 'axios';

const contarRepeticionesPatron = (str) => {
  const patron = /\{\{\d+\}\}/g;
  const contar = str.match(patron);
  return contar ? contar.length : 0;
};

const Sends = (props) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedTemplateData, setSelectedTemplateData] = useState("");
  const [selectedTemplateType, setSelectedTemplateType] = useState("");
  const [selectvar, setSelectvar] = useState('');
  const [sheetname, setSheetname] = useState([]);
  const [filename, setFilename] = useState([]);
  const [showFileContent, setShowFileContent] = useState(false);
  const [variableCount, setVariableCount] = useState(0);
  const [variableValues, setVariableValues] = useState({});
  const [variableColumnMapping, setVariableColumnMapping] = useState({});
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [customParams, setCustomParams] = useState({});
  const [selectedImageUrl, setSelectedImageUrl] = useState(""); // Agrega esta línea
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");


  const handleVideoFileChange = async (e) => {
    const file = e.target.files[0];
    setFilename(file.name);
  
    // Cargar el video y obtener la URL
    const videoUrl = URL.createObjectURL(file);
    setSelectedVideoUrl(videoUrl);
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    setFilename(file.name);

    // Cargar la imagen a Imgbb y obtener la URL
    const imgbbApiKey = 'e31e20927215f7f1aa0598b395ff6261';
    const imgbbUploadUrl = 'https://api.imgbb.com/1/upload';

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(imgbbUploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          key: imgbbApiKey,
        },
      });

      const imageUrl = response.data.data.url;
      setSelectedImageUrl(imageUrl);
    } catch (error) {
      console.error('Error al cargar la imagen:', error);
    }
  };

  const handleVariableColumnChange = (variable, column) => {
    setVariableColumnMapping((prevMapping) => ({
      ...prevMapping,
      [variable]: column,
    }));
  };

  useEffect(() => {
    const apiUrl2 = 'https://appcenteryes.appcenteryes.com/w/api/templates';
    axios.get(apiUrl2)
      .then(response => {
        setTemplates(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  const getTemplateType = (templateType) => {
    switch (templateType) {
      case 'TEXT':
        return 'Texto';
      case 'IMAGE':
        return 'Imagen';
      case 'VIDEO':
        return 'Video';
      case 'DOCUMENT':
        return 'Documento';
      default:
        return templateType;
    }
  };

  const handleTemplateChange = (event) => {
    const selectedTemplateName = event.target.value;
    setSelectedTemplate(selectedTemplateName);

    const selectedTemplateObject = templates.find(template => template.elementName === selectedTemplateName);

    if (selectedTemplateObject) {
      setSelectedTemplateData(selectedTemplateObject.data);
      const count = contarRepeticionesPatron(selectedTemplateObject.data);
      setVariableCount(count);
      setVariableValues({});
      // Set the selected template type
      const type = getTemplateType(selectedTemplateObject.templateType);
      setSelectedTemplateType(type);

      // Set the selected template ID
      setSelectedTemplateId(selectedTemplateObject.id);
      console.log('Selected Template Type:', getTemplateType(selectedTemplateObject.templateType));
    }
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    setFilename(file.name);
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const raw_data = XLSX.utils.sheet_to_row_object_array(worksheet);
    setSheetname(raw_data);
  };

  function asignarDestino(e) {
    setSelectvar(e.target.value);
  }

  const handleVariableChange = (variable, value) => {
    setVariableValues((prevValues) => ({
      ...prevValues,
      [variable]: value,
    }));
  };

  const handleCustomParamChange = (index, value) => {
    setCustomParams((prevParams) => ({
      ...prevParams,
      [index]: value,
    }));
  
    // Actualizar variableValues con el nuevo valor
    setVariableValues((prevValues) => ({
      ...prevValues,
      [index]: value,
    }));
  };
  const conection =()=> {
    const socket = io('https://appcenteryes.appcenteryes.com/w');
    socket.on( async(datos) => {
    
      const mensaje = {
        content: messageWithVariables,
        type_comunication: datos.type,
        status:   datos.payload.type,
        number: datos.payload.source || datos.payload.destination,
        timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
        type_message: datos.payload.conversation.type,
        idMessage: datos.payload.id
      };
      
      fetch('https://appcenteryes.appcenteryes.com/db/guardar-mensajes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // Puedes agregar más encabezados según sea necesario
        },
        body: JSON.stringify(mensaje)
      })
        .then(response => response.json())
        .then(datos => {
          console.log('Respuesta del servidor:', datos);
          // Puedes manejar la respuesta del servidor aquí
        })
        .catch(error => {
          console.error('Error al enviar la solicitud:', error);
          // Puedes manejar errores aquí
        });
      
    
        })
    
  }
 

  const enviar = () => {
    if (sheetname.length > 0) {
      sheetname.forEach((dest, rowIndex) => {
        const destinationNumber = String(dest[selectvar]);
        const formattedDestination = destinationNumber.startsWith("57") ? destinationNumber : `57${destinationNumber}`;

        // Personalizar customParams con datos de la columna seleccionada
      const updatedCustomParams = {};
      Object.keys(variableColumnMapping).forEach((variable) => {
        const columnIndex = variableColumnMapping[variable];
        const columnValue = dest[columnIndex];
        updatedCustomParams[variable] = columnValue;
      });

      setCustomParams(updatedCustomParams);

        const url = 'https://api.gupshup.io/wa/api/v1/template/msg';
        const apiKey = '6ovjpik6ouhlyoalchzu4r2csmeqwlbg';
        const messageWithVariables = replaceVariables(selectedTemplateData, variableValues);

        // Reemplazar las variables con los valores de la columna seleccionada
        Object.keys(variableColumnMapping).forEach((variable) => {
          const columnIndex = variableColumnMapping[variable];
          const columnValue = dest[columnIndex];
          const variableValue = customParams[variable] !== undefined ? customParams[variable] : columnValue;
          messageWithVariables = messageWithVariables.replace(`{{${variable}}}`, variableValue);
        });

        const data = {
          channel: 'whatsapp',
          source: '5718848135',
          'src.name': 'Pb1yes',
          destination: formattedDestination,
          template: JSON.stringify({
            id: selectedTemplateId ? selectedTemplateId : '',
            params: Object.values(updatedCustomParams),
          }),
          channel: 'whatsapp',
          disablePreview: true,
        };
        conection();
        
        // Tipo de plantilla seleccionada
      switch (selectedTemplateType) {
        case 'Texto':
          data.message = messageWithVariables;
          break;
        case 'Imagen':
          data.message = JSON.stringify({
            type: 'image',
            image: {
              link: selectedImageUrl,
            },
          });
          break;
        case 'Video':
          data.message = JSON.stringify({
            type: 'video',
            video: {
              link: selectedVideoUrl,
            },
          });
          break;
        case 'Documento':
          data.message = JSON.stringify({
            type: 'document',
            document: {
              link: 'https://mail.google.com/mail/u/0?ui=2&ik=97abb4c14a&attid=0.1&permmsgid=msg-f:1786087961629059212&th=18c97589ba80688c&view=att&disp=safe',
            },
          });
          break;
        default:
          console.warn('Tipo de plantilla no reconocido:', selectedTemplateType);
          return;
      }

        const headers = {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/x-www-form-urlencoded',
          'apikey': apiKey,
        };

        const formData = new URLSearchParams();
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value);
        });

        axios.post(url, formData, { headers })
          .then((response) => {
            console.log('Respuesta del servidor:', response.data);
          })
          .catch((error) => {
            console.error('Error al realizar la solicitud:', error);
          });
      });
    } else {
      console.log('No hay datos masivos.');
    }
  };

  const handleShowContent = () => {
    if (sheetname.length === 0) {
      alert('No hay ningún archivo cargado.');
    } else {
      setShowFileContent(true);
    }
  };

  // Función para reemplazar las variables en la plantilla con los valores proporcionados
  const replaceVariables = (template, values) => {
    let replacedTemplate = template;

    // Reemplazar las variables en orden
    Object.keys(values).forEach(variable => {
      const variablePattern = new RegExp(`\\{\\{${variable}\\}\\}, 'g'`);
      replacedTemplate = replacedTemplate.replace(variablePattern, values[variable]);
    });

    return replacedTemplate;
  };

  return (
    <Layout>
      <Box>
        <div style={styleName}>
          <h1>
            Envio de plantillas
          </h1>
        </div>
      </Box>

      <Box>
        <div>
          <p>Selecciona un Archivo</p>

          <input
            type="file"
            onChange={handleFile}
            placeholder="Selecciona tu Archivo"
          />

          {sheetname.length > 0 && (
            <div>
              <h1>Elige la columna que contiene el numero destino</h1>
              <select className="var-select" value={selectvar} onChange={asignarDestino}>
                {Object.keys(sheetname[0]).map((columnName, index) => (
                  <option key={index} value={columnName}>
                    {columnName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button onClick={handleShowContent}>Mostrar Contenido del Archivo</button>

          {showFileContent && (
            <div>
              <h2>Contenido del archivo por columnas y filas:</h2>
              <div className="scrollable-table-container">
                <table>
                  <thead>
                    <tr>
                      {Object.keys(sheetname[0]).map((columnName, index) => (
                        <th key={index}>{columnName}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sheetname.map((rowData, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.values(rowData).map((cellData, cellIndex) => (
                          <td key={cellIndex}>{cellData}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Box>

      <Box>
        <div>
          <p>Selecciona la plantilla:</p>
          <select onChange={handleTemplateChange} value={selectedTemplate}>
            {templates.map((template, index) => (
              <option key={index} value={template.elementName}>
                {template.elementName}
              </option>
            ))}
          </select>
        </div>
      </Box>

      <Box>
        {selectedTemplateData && (
          <div>
            <p>Contenido de la plantilla:</p>
            <pre>{JSON.stringify(selectedTemplateData, null, 2)}</pre>
          </div>
        )}
        {selectedTemplateType && (
          <div>
            <p>Tipo de la plantilla seleccionada: {selectedTemplateType}</p>
          </div>
        )}
      </Box>

      {selectedTemplateType === 'Video' && (
      <Box>
      <div>
  <p>Selecciona un Video</p>
  <input
    type="file"
    onChange={handleVideoFileChange}
    accept="video/*" // Limitar a archivos de video
    placeholder="Selecciona tu Video"
  />
  {selectedVideoUrl && (
    <div>
      <h2>Video seleccionado:</h2>
      <video width="400" controls>
        <source src={selectedVideoUrl} type="video/mp4" />
        Tu navegador no soporta el tag de video.
      </video>
    </div>
  )}
</div>
</Box>
)}


{selectedTemplateType === 'Imagen' && (
        <Box>
          <div>
            <p>Selecciona una Imagen</p>

            <input
              type="file"
              onChange={handleImageFileChange}
              accept="image/*" // Limitar a archivos de imagen
              placeholder="Selecciona tu Imagen"
            />

            {selectedImageUrl && (
              <div>
                <h2>Imagen seleccionada:</h2>
                <img src={selectedImageUrl} alt="Selected" style={{ maxWidth: '100%' }} />
              </div>
            )}
          </div>
        </Box>
      )}

      <Box>
        {variableCount > 0 && (
          <div>
            <p>Selecciona la columna para cada variable:</p>
            {Array.from({ length: variableCount }).map((_, index) => (
              <div key={index}>
                <label>{`Variable ${index + 1}:`}</label>
          
                <select
                  value={variableColumnMapping[index + 1] || ''}
                  onChange={(e) => handleVariableColumnChange(index + 1, e.target.value)}
                >
                  <option value="">Selecciona una columna</option>
                  {sheetname.length > 0 &&
                    Object.keys(sheetname[0]).map((columnName, columnIndex) => (
                      <option key={columnIndex} value={columnName}>
                        {columnName}
                      </option>
                    ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </Box>

      <Box>
        <button onClick={enviar}>Enviar</button>
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

const styleName = {
  textAlign: 'left',
  fontFamily: 'Arial Black',
  fontWeight: 'bold',
  fontSize: '30px',
  color: '#fff',
  textShadow: '-1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000',
};

export default Sends;