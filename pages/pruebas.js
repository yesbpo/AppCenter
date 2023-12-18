import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import styled from 'styled-components';
import EmojiPicker from 'react-emoji-picker';

const Reports = (props) => {
  const [responseData, setResponseData] = useState(null);
  const [elementName, setElementName] = useState('');
  const [languageCode, setLanguageCode] = useState('es_MX');
  const [category, setCategory] = useState('MARKETING');
  const [header, setHeader] = useState(''); 
  const [exampleHeader, setExampleHeader] = useState('Encabezado de la plantilla');
  const [content, setContent] = useState('Contenido de la plantilla {{1}}');
  const [variables, setVariables] = useState([1]); // Arreglo para rastrear variables
  const [emojis, setEmojis] = useState([]);

  const handleAddPlaceholder = () => {
    // Verifica si ya existe {{1}} en el encabezado
    if (!header.includes('{{1}}') && header.length + 7 <= 160) {
      // Agrega {{1}} al encabezado
      setHeader(`${header}{{1}}`);
    }
  };

  const handleAddVariable = () => {
    const nextVariable = variables.length + 1;
    setContent(`${content} {{${nextVariable}}}`);
    setVariables([...variables, nextVariable]);
  };

  // Función para agregar un emoji al contenido
  const handleAddEmoji = (emoji) => {
    setContent(`${content} ${emoji}`);
    setEmojis([...emojis, emoji]);
  };

  const handleCreateTemplate = async () => {
    try {
      const templateData = {
        elementName: elementName,
        languageCode: languageCode,
        category: category,
        templateType: 'TEXT',
        vertical: 'TEXT',
        content: content,
        example: content,
        header: header,
        exampleHeader: exampleHeader,
        footer: 'Pie de la plantilla',
        allowTemplateCategoryChange: false,
        enableSample: true,
      };

      // Realiza la solicitud al servidor
      const response = await axios.post('http://localhost:5000/createTemplates', templateData);

      // Verifica el estado de la respuesta
      if (response.status >= 200 && response.status < 300) {
        // La solicitud fue exitosa
        setResponseData(response.data);
      } else {
        // La solicitud falló
        console.error('Error en la respuesta del servidor:', response.status, response.data);
      }
    } catch (error) {
      // Error en la solicitud
      console.error('Error:', error.message || error);
    }
  };

  return (
    <Layout>

      <label>
        Nombre plantilla:
        <input
          type="text"
          value={elementName}
          onChange={(e) => setElementName(e.target.value)}
        />
      </label>

      <label>
        Categoria:
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="MARKETING">Marketing</option>
          <option value="UTILITY">Utilidad</option>
          <option value="AUTHEM">Autenticación</option>
        </select>
      </label>

      <label>
        Idioma:
        <select
          value={languageCode}
          onChange={(e) => setLanguageCode(e.target.value)}
        >
          <option value="es_MX">Español Mexico</option>
          <option value="es_ARG">Español Argentina</option>
          <option value="es_ES">Español España</option>
          <option value="en_US">Ingles Estados Unidos</option>
        </select>
      </label>
      

      <label>
        Header:
        <input
          type="text"
          value={header}
          onChange={(e) => setHeader(e.target.value)}
          maxLength={160}
        />
        <button onClick={handleAddPlaceholder}>Agregar variable</button>
      </label>

      {/* Campo de entrada para el ejemplo de encabezado */}
      <label>
        Example Header:
        <input
          type="text"
          value={exampleHeader}
          onChange={(e) => setExampleHeader(e.target.value)}
        />
      </label>

      <label>
        Content:
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handleAddVariable}>Agregar Variable</button>
      </label>

      {/* Sección para emojis */}
      <div>
        <label>Emojis:</label>
        <EmojiPicker onEmojiSelected={(emoji) => handleAddEmoji(emoji)} />
      </div>
    
      <button onClick={handleCreateTemplate}>Crear Plantilla</button>

      {/* Puedes mostrar la respuesta del servidor si es necesario */}
      {responseData && (
        <div>
          <h2>Respuesta del Servidor:</h2>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
    </Layout>
  );
};

export default Reports;
