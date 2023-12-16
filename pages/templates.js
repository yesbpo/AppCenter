import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import styled from 'styled-components';

const Reports = (props) => {
  const [languageCode, setLanguageCode] = useState('es_MX');
  const [templateBody, setTemplateBody] = useState('');
  const [templateFooter, setTemplateFooter] = useState('');
  const [templateExample, setTemplateExample] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [templateCategory, setTemplateCategory] = useState('MARKETING');
  const [templateType, setTemplateType] = useState('');
  const [showTemplateOptions, setShowTemplateOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState('none');
  const [digitHeader, setDigitHeader] = useState('');
  const [headerExample, SetHeaderExample] = useState('');
  const [templates, setTemplates] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);


//Crear plantilla
  const apiUrl = 'https://api.gupshup.io/wa/app/cef6cd40-330f-4b25-8ff2-9c8fcc434d90/template';
  const apiKey = '6ovjpik6ouhlyoalchzu4r2csmeqwlbg';

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const requestData = new URLSearchParams({
      languageCode,
      content: templateBody,
      category: templateCategory,
      example: templateExample,
      vertical: 'TEXT',
      elementName: templateName,
      templateType: 'TEXT',
      header: digitHeader,
      exampleHeader: headerExample,
    });
  
    // Agregar el campo "footer" solo si no está vacío
    if (templateFooter.trim() !== '') {
      requestData.append('footer', templateFooter);
    }
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'apikey': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: requestData,
      });
  
      const data = await response.json();
      console.log('Response:', data);
      setSuccessMessage('¡Plantilla creada con éxito!');
      setIsSuccessMessageVisible(true);

      setTimeout(() => {
        setIsSuccessMessageVisible(false);
      }, 5000);
    } catch (error) {
      console.error('Error:', error);
    }
  };


  //Llama las plantillas existentes y las muestra 
  useEffect(() => {
    const apiUrl = 'https://3d29bmtd-8080.use2.devtunnels.ms/api/templates';

    fetch(apiUrl, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        setTemplates(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

//Tipo de plantilla
  const handleTemplateTypeChange = (event) => {
    setTemplateType(event.target.value);
    setShowTemplateOptions(event.target.value === 'product');
  };
  
  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    // Limitar la longitud del texto a 1024 caracteres
    if (inputValue.length <= 1024) {
      setTemplateBody(inputValue);
    }
  };

  const charactersRemaining = 1024 - templateBody.length;

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
    setTemplateCategory(e.target.value);
  };

  let categoryRequirementText = null;

  if (templateCategory === 'MARKETING') {
    categoryRequirementText = 'Envíe ofertas, promociones de productos y otras catalogos para aumentar tu eficacia y productividad.';
  } else if (templateCategory === 'UTILITY') {
    categoryRequirementText = 'Envíe actualizaciones de cuentas, pedidos, recordatorios y mucho más. Podras enviar información importante .';
  } else if (templateCategory === 'AUTHEM') {
    categoryRequirementText = 'Envíe codigos que autoricen accesos o de confirmación.';
  }

  return (
    <Layout>

<Box>
      <form onSubmit={handleSubmit}>
        <InputContainer>
          <label>
            Nombre plantilla: * 
            <Input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </label>
          <RequirementText>
            Requisitos: Todo en minúsculas, espacios separados por barras al piso (_), sin caracteres especiales.
          </RequirementText>
        </InputContainer>

      <Separador />
     
        <div>
      <label>
        Categoria: * 
        <SelectInput 
          value={templateCategory} 
          onChange={handleSelectChange}
        >
          <option value="MARKETING">Marketing</option>
          <option value="UTILITY">Utilidad</option>
          <option value="AUTHEM">Autenticación</option>
        </SelectInput>
      </label>
      {categoryRequirementText && (
        <RequirementText>
          {categoryRequirementText}
        </RequirementText>
      )}
    </div>

    <Separador />

    <div>
      <div>
        <label>
          <input
            type='radio'
            name='templateType'
            value='custom'
            onChange={handleTemplateTypeChange}
          />
          Plantilla personalizada
        </label>

        <label>
          <input
            type='radio'
            name='templateType'
            value='product'
            onChange={handleTemplateTypeChange}
          />
          Plantilla de producto
        </label>
      </div>



      {showTemplateOptions && (
        <div>
          <p>Formato de plantilla: </p>
          <label>
            <input type='radio' name='templateFormat' />
            Plantilla catálogo
          </label>

          <label>
            <input type='radio' name='templateFormat' />
            Plantilla multiproducto
          </label>
        </div>
      )}
    </div>

    <Separador />

    <div>
<label>
  Idioma: *  
  <select 
    value={languageCode} 
    onChange={(e) => setLanguageCode(e.target.value)}
  >
    <option value="es_MX">Español México</option>
    <option value="es_ARG">Español Argentina</option>
    <option value="es_ES">Español España</option>
    <option value="en_US">Ingles Estados Unidos</option>
  </select>
</label>
</div>

<Separador />

<div>
  <label>
    Cabecera:
    <select value={selectedOption} onChange={handleSelectChange}>
      <option >Ninguna</option>
      <option value="TEXT">Texto</option>
      <option value="IMAGE">Imagen</option>
      <option value="VIDEO">Video</option>
      <option value="DOCUMENT">Documento</option>
      <option value="LOCATION">Ubicación</option>
    </select>
  </label>
</div>

<Separador />

{selectedOption === 'TEXT' && (
  <div>
    <label>
      Escribe la cabecera:
      <input type='text' value={digitHeader} onChange={(e) => setDigitHeader(e.target.value)}/>
      Escribe un ejemplo:
      <input type='text' value={headerExample} onChange={(e) => SetHeaderExample(e.target.value)}/>
    </label>
  </div>
)}

{selectedOption === 'IMAGE' && (
  <div>
    <label>
      Selecciona la imagen:
      <input type='text' value={digitHeader} onChange={(e) => setDigitHeader(e.target.value)}/>
    </label>
  </div>
)}

{selectedOption === 'VIDEO' && (
  <div>
    <label>
      Selecciona el video:
      <input type='text' value={digitHeader} onChange={(e) => setDigitHeader(e.target.value)}/>
    </label>
  </div>
)}

{selectedOption === 'DOCUMENT' && (
  <div>
    <label>
      Selecciona el documento:
      <input type='text' value={digitHeader} onChange={(e) => setDigitHeader(e.target.value)}/>
    </label>
  </div>
)}

{selectedOption === 'LOCATION' && (
  <div>
    <label>
      Selecciona la ubicacion:
    </label>
  </div>
)}


<Separador />

<div>
      <label>
        Texto:  * 
        <StyledTextArea 
          value={templateBody} 
          onChange={handleInputChange} 
          rows="4"
          maxLength={1024} 
        />
      </label>
      <RequirementText>
        Caracteres restantes: {charactersRemaining}
      </RequirementText>
    </div>

    <Separador />

      <div>
        <label>
        Pie de pagina:
        <input type="text" value={templateFooter} onChange={(e) => setTemplateFooter(e.target.value)} />
        </label>
        <RequirementText>
          Opcional
        </RequirementText>
      </div>

      <Separador />

      <div>
      <label>
        Tipo de acción:
        <select value={selectedOption} onChange={handleSelectChange}>
          <option value="none">Ninguno</option>
          <option value="callToAction">Llamada a la acción</option>
          <option value="quickReply">Respuesta rápida</option>
        </select>
      </label>
    </div>

    <Separador /> 

      <div>
      <label>
      Escribe un ejemplo:
      <input type="text" value={templateExample} onChange={(e) => setTemplateExample(e.target.value)} />
      </label>
      </div>

      <Separador />

      <div>
      <button type="submit">Crear Plantilla</button>
      </div>

      {isSuccessMessageVisible && (
        <div>
          <p>{successMessage}</p>
        </div>
      )}
      
      
    </form>
      </Box>



       <Box>
       <div>
         <h2>Plantillas actuales:</h2>
         {templates.map((template, index) => (
           <StyledTemplateBox key={index}>
             <h3>Nombre plantilla: {template.elementName}</h3>
             <p>Categoría: {template.category}</p>
             <p>Texto: {template.data}</p>
             <p>
               Lenguaje:{' '}
               {template.languageCode === 'es_MX'
                 ? 'Español México'
                 : template.languageCode === 'en_US'
                 ? 'Ingles Estados Unidos'
                 : template.languageCode === 'es_ARG'
                 ? 'Español Argentina'
                 : template.languageCode === 'es_ES'
                 ? 'Español España'
                 : template.languageCode}
             </p>
             <p>
               Estado:{' '}
               {template.status === 'APPROVED'
                 ? ' Aprobada por WhatsApp'
                 : template.status === 'PENDING'
                 ? ' Pendiente por aprobación'
                 : template.status === 'REJECTED'
                 ? ' Rechazada por politicas de WhatsApp'
                 : template.status}
             </p>
             <p>
               Tipo de plantilla:{' '}
               {template.templateType === 'TEXT'
                 ? 'Texto'
                 : template.templateType}
             </p>
           </StyledTemplateBox>
         ))}
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

const StyledTemplateBox = styled.div`
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #f8f8f8;
  font-size: 16px;
`;

const InputContainer = styled.div`
  margin-bottom: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  box-sizing: border-box;
`;

const RequirementText = styled.p`
  color: #555;
  font-size: 12px;
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: vertical; /* Permite redimensionar verticalmente */
`;

const SelectInput = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 5px;
`;


const Separador = styled.div`
  border-bottom: 1px solid #ccc; /* Puedes ajustar el color según tus preferencias */
  margin: 10px 0; /* Puedes ajustar el margen según tus preferencias */
`;


export default Reports;