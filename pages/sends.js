import React, { useState, useEffect } from 'react';
import Layout from "../components/Layout";
import styled from "styled-components";
import * as XLSX from 'xlsx';
import axios from 'axios';
import io from 'socket.io-client';

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
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");

  const handleVideoFileChange = async (e) => {
    const file = e.target.files[0];
    setFilename(file.name);
    const videoUrl = URL.createObjectURL(file);
    setSelectedVideoUrl(videoUrl);
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    setFilename(file.name);

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
      const type = getTemplateType(selectedTemplateObject.templateType);
      setSelectedTemplateType(type);
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
    setShowFileContent(true);
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
  
    setVariableValues((prevValues) => ({
      ...prevValues,
      [index]: value,
    }));
  };

  const conection =()=> {
    const socket = io('https://appcenteryes.appcenteryes.com/w');
    socket.on( async(data) => {
      const datosAInsertar = {
        status: data.payload.type,
        attachments: data.payload.destination,
        message: messageWithVariables,
        timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ')
      };
      try {
        const respnseweb = await fetch("https://appcenteryes.appcenteryes.com/db/insertar-datos-template", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datosAInsertar)
        })
      } catch(error) {
        console.error('Error al enviar la solicitud:', error);
      }
      
      socket.close();
    });
  }

  const enviar = async () => {
    const socket = io('https://appcenteryes.appcenteryes.com/w/');
    socket.on(async data => {
      console.log(data)
      const datosAInsertar = {
        status: data.payload.type,
        attachments: data.payload.destination,
        message: messageWithVariables,
        timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ')
      };
      await fetch("https://appcenteryes.appcenteryes.com/db/insertar-datos-template", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosAInsertar)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Respuesta del servidor:', data);
      })
      .catch(error => {
        console.error('Error al enviar la solicitud:', error);
      });
    });
    
    if (sheetname.length > 0) {
      for (let rowIndex = 0; rowIndex < sheetname.length; rowIndex++) {
        const dest = sheetname[rowIndex];
        const destinationNumber = String(dest[selectvar]);
        const formattedDestination = destinationNumber.padStart(10, '0');
        const variableValues = {};
        Object.keys(variableColumnMapping).forEach((variable) => {
          const columnIndex = variableColumnMapping[variable];
          if (columnIndex !== undefined && sheetname[rowIndex][columnIndex] !== undefined) {
            variableValues[variable] = sheetname[rowIndex][columnIndex];
          }
        });
        setVariableValues(variableValues);

        const updatedCustomParams = {};
        Object.keys(customParams).forEach((variable) => {
          const columnIndex = variableColumnMapping[variable];
          if (columnIndex !== undefined && sheetname[rowIndex][columnIndex] !== undefined) {
            updatedCustomParams[variable] = sheetname[rowIndex][columnIndex];
          }
        });

        setCustomParams(updatedCustomParams);

        let messageWithVariables = selectedTemplateData;
        Object.keys(variableValues).forEach((variable) => {
          const regex = new RegExp(`\\{\\{${variable}\\}\\}`, 'g');
          messageWithVariables = messageWithVariables.replace(regex, variableValues[variable]);
        });

        Object.keys(updatedCustomParams).forEach((variable) => {
          const regex = new RegExp(`\\{\\{${variable}\\}\\}`, 'g');
          messageWithVariables = messageWithVariables.replace(regex, updatedCustomParams[variable]);
        });

        const datosAInsertar = {
          status: 'queued',
          attachments: dest[selectvar],
          message: messageWithVariables,
          timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };

        try {
          const respnseweb = await fetch("https://appcenteryes.appcenteryes.com/db/insertar-datos-template", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosAInsertar)
          });

          console.log('Respuesta del servidor:', respnseweb);
        } catch (error) {
          console.error('Error al enviar la solicitud:', error);
        }
      }
    }
    socket.close();
  };

  const resetFileState = () => {
    setFilename("");
    setShowFileContent(false);
    setSheetname([]);
  };

  return (
    <Layout>
      <div>
        <h1>Envío de mensajes</h1>
        <FormContainer>
          <FormLabel>Seleccione una plantilla:</FormLabel>
          <FormSelect onChange={handleTemplateChange}>
            <option value="" selected>
              Seleccione una plantilla
            </option>
            {templates.map((template, index) => (
              <option key={index} value={template.elementName}>
                {template.elementName}
              </option>
            ))}
          </FormSelect>

          {selectedTemplateId && (
            <>
              <FormLabel>Seleccione un archivo:</FormLabel>
              <FormFileInput
                type="file"
                accept=".xlsx, .xls"
                onChange={(e) => {
                  resetFileState();
                  handleFile(e);
                }}
              />
              {showFileContent && (
                <>
                  <FormLabel>Seleccione una variable para asignar el destino:</FormLabel>
                  <FormSelect onChange={asignarDestino}>
                    {Object.keys(sheetname[0]).map((column, index) => (
                      <option key={index} value={column}>
                        {column}
                      </option>
                    ))}
                  </FormSelect>
                </>
              )}

              {showFileContent && (
                <>
                  <FormLabel>Asignar variables:</FormLabel>
                  {Array.from({ length: variableCount }).map((_, index) => (
                    <VariableInput
                      key={index}
                      placeholder={`Variable ${index + 1}`}
                      onChange={(e) => handleVariableChange(index, e.target.value)}
                    />
                  ))}
                </>
              )}

              {selectedTemplateType === 'Documento' && (
                <>
                  <FormLabel>Cargar archivo de imagen:</FormLabel>
                  <FormFileInput type="file" accept="image/*" onChange={handleImageFileChange} />
                  {selectedImageUrl && <PreviewImage src={selectedImageUrl} alt="Preview" />}
                </>
              )}

              {selectedTemplateType === 'Video' && (
                <>
                  <FormLabel>Cargar archivo de video:</FormLabel>
                  <FormFileInput type="file" accept="video/*" onChange={handleVideoFileChange} />
                  {selectedVideoUrl && (
                    <VideoContainer>
                      <PreviewVideo controls>
                        <source src={selectedVideoUrl} type="video/mp4" />
                        Tu navegador no admite el elemento de video.
                      </PreviewVideo>
                    </VideoContainer>
                  )}
                </>
              )}

              {showFileContent && (
                <>
                  <FormLabel>Asignar columnas personalizadas:</FormLabel>
                  {Array.from({ length: variableCount }).map((_, index) => (
                    <CustomParamInput
                      key={index}
                      placeholder={`Variable ${index + 1}`}
                      onChange={(e) => handleCustomParamChange(index, e.target.value)}
                    />
                  ))}
                </>
              )}

              <Button onClick={enviar}>Enviar mensajes</Button>
            </>
          )}
        </FormContainer>
      </div>
    </Layout>
  );
};

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 600px;
  margin: auto;
`;

const FormLabel = styled.label`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const FormSelect = styled.select`
  padding: 8px;
  font-size: 14px;
`;

const FormFileInput = styled.input`
  padding: 8px;
  font-size: 14px;
`;

const VariableInput = styled.input`
  padding: 8px;
  font-size: 14px;
`;

const CustomParamInput = styled.input`
  padding: 8px;
  font-size: 14px;
`;

const Button = styled.button`
  padding: 8px;
  font-size: 16px;
  font-weight: bold;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const PreviewImage = styled.img`
  max-width: 100%;
  margin-top: 16px;
`;

const VideoContainer = styled.div`
  margin-top: 16px;
`;

const PreviewVideo = styled.video`
  max-width: 100%;
`;

export default Sends;
