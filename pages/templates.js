import React, { useEffect, useState, useMemo } from 'react';
//import {Rox, Col, Form} from 'react-bootstrap'
import axios from 'axios';
import Layout from '../components/Layout';
import styled from 'styled-components';
import EmojiPicker from 'emoji-picker-react';

import { useSession, signIn } from 'next-auth/react';
const Reports = (props) => {
  const { data: session } = useSession()
  const [responseData, setResponseData] = useState(null);
  const [elementName, setElementName] = useState('');
  const [languageCode, setLanguageCode] = useState('es_MX');
  const [category, setCategory] = useState('MARKETING');
  const [header, setHeader] = useState('');
  const [exampleHeader, setExampleHeader] = useState('');
  const [content, setContent] = useState('');
  const [emojis, setEmojis] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [footer, setFooter] = useState('');
  const [allowCategoryChange, setAllowCategoryChange] = useState(false);
  const [showTemplateButtons, setShowTemplateButtons] = useState(false);
  const [selectedTemplateType, setSelectedTemplateType] = useState('');
  const [exampleContent, setExampleContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [exampleMedia, setExampleMedia] = useState('');
  const [message, setMessage] = useState('');
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

//Constants buy page templates
  const templatesPerPage = 5;

  // Calculate the index of the first and last template to display on the current page
  const indexOfLastTemplate = currentPage * templatesPerPage;
  const indexOfFirstTemplate = indexOfLastTemplate - templatesPerPage;
  const currentTemplates = templates.slice(indexOfFirstTemplate, indexOfLastTemplate);

  // Calculate the total number of pages
  const totalPages = Math.ceil(templates.length / templatesPerPage)
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

//Constants delete templates
  const resetDeleteMessage = () => {
    setDeleteMessage('');
  };
  const showTemporaryDeleteMessage = (msg, duration = 3000) => {
    setDeleteMessage(msg);
    setTimeout(() => {
      resetDeleteMessage();
    }, duration);
  };
  const resetMessage = () => {
    setMessage('');
  };
  const showTemporaryMessage = (msg, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => {
      resetMessage();
    }, duration);
  };

//Constant to reset fields to 0 when changing template type
  const resetFields = () => {
    setElementName('');
    setLanguageCode('es_MX');
    setCategory('MARKETING');
    setHeader('');
    setExampleHeader('');
    setContent('');
    setEmojis([]);
    setShowEmojiPicker(false);
    setFooter('');
    setAllowCategoryChange(false);
    setSelectedFile(null);
    setExampleMedia('');
  };

//Handling of template type buttons and template creation 
  const handleToggleTemplateButtons = () => {
    resetFields();
    setShowTemplateButtons(!showTemplateButtons);
  };

  const handleTemplateButtonClick = (templateType) => {
    resetFields();
    setSelectedTemplateType(templateType);
    setShowTemplateButtons(false);
  };

//Function for uploading files, whether image, video or document and getting the handleId
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) handleFileUpload();
  };

  const handleFileUpload = async () => {
    const apiUrl = 'https://partner.gupshup.io/partner/app/cef6cd40-330f-4b25-8ff2-9c8fcc434d90/upload/media';
    const partnerAppToken = 'sk_ce0c81f1783e4e86828863ebf2d9c3fa';

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('file_type', 'image/png');

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Authorization': partnerAppToken,
          'Content-Type': 'multipart/form-data',
        },
      });

      setExampleMedia(response.data.handleId.message);
    } catch (error) {
      console.error('Error:', error.message || error);
      setMessage('Error al cargar el archivo. Por favor, inténtelo de nuevo.');

    }
  };

//Here we have the handling of the variables, so that you can count from the last one 
  const handleAddPlaceholder = () => {
    if (!header.includes('{{1}}') && header.length + 7 <= 160) {
      setHeader(`${header}{{1}}`);
    }
  };

  const getNextVariableNumber = () => {
    const matches = content.match(/{{(\d+)}}/g);
    return (matches && matches.length > 0) ? parseInt(matches[matches.length - 1].match(/\d+/)[0]) + 1 : 1;
  };

  const handleAddVariable = () => {
    const nextVariable = getNextVariableNumber();
    const variable = `{{${nextVariable}}}`;

    if (!content.includes(variable) && !exampleContent.includes(variable)) {
      setContent(`${content} ${variable}`);
    }
  };

//This is how to handle the emojis, for deployment
  const handleAddEmoji = (emoji) => {
    setContent(`${content} ${emoji}`);
    setEmojis([...emojis, emoji]);
    setShowEmojiPicker(false);
  };

//This function is to alert the user that the indicated fields are missing.  
const handleCreateTemplate = async () => {
  if (!content || !exampleContent) {
    showTemporaryMessage('Por favor, complete los campos de contenido, contenido de ejemplo y archivo multimedia.');
    return;
  }

  const templateData = {
    elementName,
    languageCode,
    category,
    templateType: selectedTemplateType,
    vertical: selectedTemplateType,
    content,
    example: exampleContent,
    exampleMedia,
    header,
    exampleHeader,
    footer,
    allowTemplateCategoryChange: false,
    enableSample: true,
  };

  try {
    const response = await fetch('https://appcenteryes.appcenteryes.com/w/createTemplates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include any additional headers here
      },
      body: JSON.stringify(templateData),
    });

    const responseData = await response.json();

    if (response.ok) {
      setResponseData(responseData);
      showTemporaryMessage('Plantilla creada exitosamente.');
    } else {
      console.error('Error en la respuesta del servidor:', response.status, responseData);
      showTemporaryMessage('Error al crear la plantilla. Por favor, inténtelo de nuevo.');
    }
  } catch (error) {
    console.error('Error:', error.message || error);
  }
};


//Request to obtain the templates
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://appcenteryes.appcenteryes.com/w/gupshup-templates');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "success") {
          const processedTemplates = data.templates.map(template => ({
            category: template.category,
            createdOn: template.createdOn,
            data: template.data,
            elementName: template.elementName,
            languageCode: template.languageCode,
            status: template.status,
            templateType: template.templateType,
            modifiedOn: template.modifiedOn,
          }));

          setTemplates(processedTemplates);
        } else {
          setError(`Error: ${data.message}`);
        }
      } catch (error) {
        setError(`Fetch error: ${error.message}`);
      }
    };

    fetchData();
  }, []);

  const getLanguageText = (languageCode) => {
    switch (languageCode) {
      case 'es_MX':
        return 'Español México';
      case 'es_ARG':
        return 'Español Argentina';
      case 'es_ES':
        return 'Español España';
      case 'en_US':
        return 'Inglés Estados Unidos';
      default:
        return languageCode;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'Aprobada';
      case 'PENDING':
        return 'Pendiente';
      case 'REJECT':
        return 'Rechazada';
      default:
        return status;
    }
  };

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

//This is the application to delete the templates
  const handleDeleteTemplate = async (elementName) => {
    try {
      const response = await axios.delete(`https://appcenteryes.appcenteryes.com/w/deleteTemplate/${elementName}`);

      if (response.status === 200 && response.data.status === 'success') {
        const updatedTemplates = templates.filter((template) => template.elementName !== elementName);
        setTemplates(updatedTemplates);
        setDeleteMessage('Plantilla eliminada exitosamente.');
        showTemporaryMessage('Plantilla eliminada exitosamente.');
      } else {
        console.error('Error al eliminar la plantilla:', response.status, response.data);
        setDeleteMessage('Error al eliminar la plantilla. Por favor, inténtelo de nuevo.');
        showTemporaryMessage('Error al eliminar la plantilla. Por favor, inténtelo de nuevo.');
      }
    } catch (error) {
      console.error('Error:', error.message || error);
      setDeleteMessage('Error al eliminar la plantilla. Por favor, inténtelo de nuevo.');
      showTemporaryMessage('Error al eliminar la plantilla. Por favor, inténtelo de nuevo.');
    }
  };

//This temporary message shows whether or not the template was deleted.
  useEffect(() => {
    const deleteMessageTimer = setTimeout(() => {
      resetDeleteMessage();
    }, 3000); 

    return () => {
      clearTimeout(deleteMessageTimer);
    };
  }, [deleteMessage]);

  if(session){
  return (
    <Layout >
      <Container>
        <Button onClick={handleToggleTemplateButtons} style={{fontWeight: 'bold',margin:'20px'}}>Crear Plantilla</Button>
        {showTemplateButtons && (
          <TemplateButtons>
            {['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT'].map(type => (
              <TemplateButton key={type} onClick={() => handleTemplateButtonClick(type)}>
                Plantilla de {type.toLowerCase()}
              </TemplateButton>
            ))}
          </TemplateButtons>
        )}
      </Container>

      {(selectedTemplateType === 'TEXT' || selectedTemplateType === 'IMAGE' || selectedTemplateType === 'VIDEO' || selectedTemplateType === 'DOCUMENT') && (
        <>
      
        <div className='templateStyle'>
          <label>
            Nombre plantilla:
            <input
              type="text"
              value={elementName}
              onChange={(e) => setElementName(e.target.value)}
            />
            <RequirementText>
              *No se aceptan mayúsculas - Los espacios deben ir separados por guiones bajos -
            </RequirementText>
          </label>

          <Separador />

          <label>
            Categoría:
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="MARKETING">Marketing</option>
              <option value="UTILITY">Utilidad</option>
              <option value="AUTHEM">Autenticación</option>
            </select>
          </label>

          <Separador />

          <label>
            Idioma:
            <select
              value={languageCode}
              onChange={(e) => setLanguageCode(e.target.value)}
            >
              <option value="es_MX">Español Mexico</option>
              <option value="es_ARG">Español Argentina</option>
              <option value="es_ES">Español España</option>
              <option value="en_US">Inglés Estados Unidos</option>
            </select>
          </label>

          <Separador />

          {(selectedTemplateType === 'IMAGE' || selectedTemplateType === 'VIDEO' || selectedTemplateType === 'DOCUMENT') && (
            <label>
              {selectedTemplateType === 'IMAGE' ? 'Imagen' : selectedTemplateType === 'VIDEO' ? 'Video' : 'Documento'}:
              <input type="file" accept={selectedTemplateType === 'IMAGE' ? '.jpg, .jpeg, .png' : selectedTemplateType === 'VIDEO' ? '.MP4, .MOV, .MKV, .AVI, .WMV' : ''} onChange={handleFileUpload} />
            </label>
          )}

{selectedTemplateType === 'TEXT' && (
    <>
      <label>
        Header:
        <input
          type="text"
          value={header}
          onChange={(e) => setHeader(e.target.value)}
          maxLength={160}
        />
       
      </label>

      <Separador />

      <label>
        Example Header:
        <input
          type="text"
          value={exampleHeader}
          onChange={(e) => setExampleHeader(e.target.value)}
        />
      </label>
    </>
  )}

          <Separador />
        
          <StyledLabel>
            Content:
            <TextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />    
            <button 
            onClick={handleAddVariable}>Agregar Variable</button>
          </StyledLabel>
          <div style={{display: 'flex'}}>
          <StyledLabel style={{marginRight: '20px'}}>
            <EmojiButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
              🙂
            </EmojiButton>
            {showEmojiPicker && (
              <EmojiPicker
                onEmojiClick={(emoji) => handleAddEmoji(emoji.emoji)}
                disableAutoFocus
              />
            )}
          </StyledLabel>
          </div>
          <Separador />

          <StyledLabel>
            Example Content:
            <TextArea
              value={exampleContent}
              onChange={(e) => setExampleContent(e.target.value)}
            />
          </StyledLabel>

          <Separador />

          <label>
            Pie de Página:
            <input
              type="text"
              value={footer}
              onChange={(e) => setFooter(e.target.value)}
            />
          </label>

          <Separador />

          <label>
            Permitir Cambio de Categoría:
            <input
              type="checkbox"
              checked={allowCategoryChange}
              onChange={() => setAllowCategoryChange(!allowCategoryChange)}
            />
          </label>

          <Separador />
          </div>

          <button onClick={handleCreateTemplate}>Crear Plantilla</button>

          {message && (
            <div>
              <p>{message}</p>
            </div>
          )}

        </>
      )
      }

<span>{deleteMessage}</span>


<div className='CreatedTemplates'>
        {error && <p>{error}</p>}
        {currentTemplates.length > 0 && (
          <ul>
            {currentTemplates.map((template) => (
              <li key={template.elementName}>
                <strong>Categoria:</strong> {template.category}<br />
                <strong>Tipo de plantilla:</strong> {getTemplateType(template.templateType)}<br />
                <strong>Fecha de creación:</strong> {new Date(template.createdOn).toLocaleString()}<br />
                <strong>Fecha de modificación:</strong> {new Date(template.modifiedOn).toLocaleString()}<br />
                <strong>Contenido:</strong> {template.data}<br />
                <strong>Nombre:</strong> {template.elementName}<br />
                <strong>Idioma:</strong> {getLanguageText(template.languageCode)}<br />
                <strong>Estado:</strong> {getStatusText(template.status)}<br />
                <button onClick={() => handleDeleteTemplate(template.elementName)}>Eliminar Plantilla</button>
                <hr />
              </li>
            ))}
          </ul>
        )}

        {/* Pagination controls */}
        {templates.length > templatesPerPage && (
          <Pagination>
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              Anterior
            </button>
            <span>{`Página ${currentPage} de ${totalPages}`}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              Siguiente
            </button>
          </Pagination>
        )}
      </div>


    </Layout>
  );}
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
  </>)
};

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;

  button {
    padding: 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
`;



const Separador = styled.hr`
  margin: 20px 0;
  border: 0;
  border-top: 1px solid #ccc;
`;

const Container = styled.div`
  margin: 30px;
  position: relative;
  text-align: right;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
`;

const TemplateButtons = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

const TemplateButton = styled.button`
  margin-top: 5px;
  padding: 5px;
  font-size: 14px;
  cursor: pointer;
`;

const RequirementText = styled.p`
  color: #555;
  font-size: 12px;
`;

const StyledLabel = styled.label`
  display: block;
  margin-bottom: 15px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical; /* Permite que el textarea sea redimensionado verticalmente */
`;

const EmojiButton = styled.button`
  background-color: #128c7e;
  color: #fff;
  padding: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
`;

const TemplateList = styled.div`
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
`;

const TemplateItem = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 15px;

  strong {
    color: #128c7e;
  }

  button {
    background-color: #dc3545;
    color: #fff;
    padding: 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
  }

  hr {
    margin-top: 15px;
  }
`;

export default Reports;
