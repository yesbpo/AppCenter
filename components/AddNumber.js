import React, {useState, useEffect} from "react";
 
import styled from 'styled-components';
function AddNumber (){
  const [parametros, setParametros] = useState('')
     //logica agregar numero 
     const [showPopup, setShowPopup] = useState(false);

     // Función para abrir la ventana emergente
     const openPopup = () => {
       setShowPopup(true);
     };
   
     // Función para cerrar la ventana emergente
     const closePopup = () => {
       setShowPopup(false);
     };
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
      params: selectedTemplate.params || [] // Asegúrate de que tu plantilla tenga una propiedad params
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
      console.log('Respuesta:', responseData);
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
    return(
        <ContainerBox className="fixed inset-0 flex items-center justify-center">
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
              {contarOcurrencias(template.data, '{{.*?}}').map((param) => (
                <div key={param} className="mt-2">
                  <label htmlFor={param} className="block text-sm font-medium text-gray-700">
                    {param}:
                  </label>
                  <input
                    type="text"
                    id={param}
                    value={templateParams[param] || ''}
                    onChange={(e) => handleParamChange(param, e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>
          )
      )}
    </div>
  </ContainerBox>
    )
}

const ContainerBox = styled.div`
background-color: #f7f7f7;
padding: 15px;
border-radius: 10px;
overflow-y: scroll;
max-height: 300px;
max-width: 500px;
scroll-behavior: smooth;
`;

export default AddNumber