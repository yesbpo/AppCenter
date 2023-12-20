import React, { useState, useEffect } from 'react';
import Layout from "../components/Layout";
import styled from "styled-components";
import * as XLSX from 'xlsx';
import BaseComponent from 'bootstrap/js/dist/base-component';

const Sends = (props) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedTemplateData, setSelectedTemplateData] = useState("");
  const [checkboxValue, setCheckboxValue] = useState('Masivo'); // Por defecto, establece el valor en 'Masivo'
  const [selectedVariables, setSelectedVariables] = useState({});
  const [isTemplateEditable, setIsTemplateEditable] = useState(true);
  const [selectvar, setSelectvar] = useState('');
  const [sheetname, setSheetname] = useState([]);
  const [filename, setFilename] = useState([]);
  const [showFileContent, setShowFileContent] = useState(false);

  useEffect(() => {
    const apiUrl2 = 'https://3d29bmtd-8080.use2.devtunnels.ms/api/templates';
    fetch(apiUrl2, {
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

  const handleTemplateChange = (event) => {
    const selectedTemplateName = event.target.value;
    setSelectedTemplate(selectedTemplateName);

    const selectedTemplateObject = templates.find(template => template.elementName === selectedTemplateName);

    function contarRepeticionesPatron(str, nuevovalor) {
      const patron = /\{\{\d+\}\}/g;
      const coincidencias = str.replace(patron, nuevovalor);
      let contar = str.match(patron);
      if (contar === null) {
        contar = 0;
      }
      return coincidencias && contar.length;
    }

    if (selectedTemplateObject) {
      setSelectedTemplateData(selectedTemplateObject.data);

      const hasVariables = contarRepeticionesPatron(selectedTemplateObject.data, "lo que sea");

      setIsTemplateEditable(hasVariables);
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
    sheetname.map((dest) => { console.log(dest) });
  }

  const enviar = () => {
    if (checkboxValue === 'Masivo' && sheetname.length > 0) {
      sheetname.map((dest) => {
        console.log(dest[selectvar]);
        const url = 'https://api.gupshup.io/wa/api/v1/msg';
        const apiKey = '6ovjpik6ouhlyoalchzu4r2csmeqwlbg';
        const data = {
          channel: 'whatsapp',
          source: '5718848135',
          'src.name': 'Pb1yes',
          destination: dest[selectvar],
          message: selectedTemplateData,
          channel: 'whatsapp',
          disablePreview: true,
        };

        const headers = {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/x-www-form-urlencoded',
          'apikey': apiKey,
        };

        const formData = new URLSearchParams();
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value);
        });

        fetch(url, {
          method: 'POST',
          headers: headers,
          body: formData,
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
            }
          })
          .then((responseData) => {
            console.log('Respuesta del servidor:', responseData);
          })
          .catch((error) => {
            console.error('Error al realizar la solicitud:', error);
          });
      });
    } else {
      // Manejo para el caso en que no hay datos masivos
      console.log('No hay datos masivos.');
    }
  };

  const handleShowContent = () => {
    if (sheetname.length === 0) {
      // Mostrar mensaje temporal
      alert('No hay ningún archivo cargado.');
    } else {
      setShowFileContent(true);
    }
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
          <p>Selecciona el tipo de envio:</p>
          <label>
            Envio Masivo
            <input
              type='checkbox'
              value='Masivo'
              checked={checkboxValue === 'Masivo'}
              onChange={() => setCheckboxValue('Masivo')}
            />
          </label>
        </div>
      </Box>

      <Box>
        <div>
          {checkboxValue === 'Masivo' && (
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
                      <option key={index} value={columnName} onChange={asignarDestino}>
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
      </Box>

      <Box>
        {isTemplateEditable && (
          <div>
            <p>Selecciona las variables:</p>
            {Object.keys(selectedTemplateData).map((variable, index) => (
              <div key={index}>
                <label>{variable}:</label>
                <input
                  type="text"
                  value={selectedVariables[variable] || ''}
                  onChange={(e) => setSelectedVariables({ ...selectedVariables, [variable]: e.target.value })}
                />
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
