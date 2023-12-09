import React from 'react';
import { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import Sidebar from '../components/Sidebar'
import axios from 'axios';
import * as XLSX from 'xlsx';
import Layout from '../components/Layout';


function Reports() {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [nombreCampaña, setNombreCampaña] = useState('');
  const [tipoMensajes, setTipoMensajes] = useState('ambos'); // Puede ser 'entrantes', 'salientes', o 'ambos'.
  const [datos, setDatos] = useState([]);

  const generarReporte = async () => {
    try {
      // Aquí deberías realizar una solicitud a tu servidor para obtener los datos de WhatsApp.
      //  hacer la solicitud con fetch.

      // Ejemplo de datos.
      const datos = [
        { fecha: '2023-11-25', mensaje: 'Hola', destinatario: '123456789' },
        
      ];
      // Filtrar los datos según los criterios seleccionados.
      const datosFiltrados = datos.filter(d => {
      const fechaValida = (!fechaInicio || d.fecha >= fechaInicio) && (!fechaFin || d.fecha <= fechaFin);
      const campañaValida = !nombreCampaña || d.campaña === nombreCampaña;
      const tipoValido = tipoMensajes === 'ambos' || d.tipo === tipoMensajes;
      return fechaValida && campañaValida && tipoValido;
})
      // Crear un objeto CSV con los datos.
      const csvData = "Fecha,Mensaje,Destinatario\n" +
        datos.map(d => `${d.fecha},${d.mensaje},${d.destinatario}`).join("\n");

      // Crear un Blob con los datos.
      const blob = new Blob([csvData], { type: 'text/csv' });

      // Descargar el archivo.
      saveAs(blob, 'reporte_whatsapp.csv');
    } catch (error) {
      console.error('Error al generar el reporte:', error);
    }
  };

  //Generar reporte plantillas 
  useEffect(() => {
    axios({
      method: 'get',
      url: 'https://3d29bmtd-8080.use2.devtunnels.ms/api/templates',
    })
      .then(response => {
        const filteredData = response.data.map(template => ({
          Categoria: template.category,
          Fecha_de_creacion: template.createdOn,
          Contenido: template.data,
          Nombre: template.elementName,
          ID_Plantilla: template.id,
          Idioma: template.languageCode,
          Ultima_modificacion: template.modifiedOn,
          Estado: template.status,
          Tipo_Plantilla: template.templateType,
        }));

        setDatos(filteredData);
      })
      .catch(error => {
        console.error('Error:', error.response ? error.response.data : error.message);
      });
  }, []);

  const generarReportePlan = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(datos);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

      const fecha = new Date().toISOString().slice(0, 10);
      const nombreArchivo = `Reórte plantillas ${fecha}.xlsx`;

      XLSX.writeFile(workbook, nombreArchivo);
    } catch (error) {
      console.error('Error al generar el reporte:', error);
    }
  };

  return (
    
    <Layout >
      
      <div className="min-h-screen bg-light text-gray-900">
      <h1>Generador de Reportes WhatsApp</h1>
    <label >
      Fecha de Inicio:
      <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
    </label>
    <label >
      Fecha de Fin:
      <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
    </label >
    <label >
      Nombre de Campaña:
      <input type="text" value={nombreCampaña} onChange={(e) => setNombreCampaña(e.target.value)} />
    </label >
    <label >
      Tipo de Mensajes:
      <select value={tipoMensajes} onChange={(e) => setTipoMensajes(e.target.value)}>
        <option value="ambos">Ambos</option>
        <option value="entrantes">Entrantes</option>
        <option value="salientes">Salientes</option>
      </select>
    </label>
    <button onClick={generarReporte}>Generar Reporte</button>

    
        <h1>Exporte de plantillas</h1>
        {/* Botón para exportar los datos */}
        <button onClick={generarReportePlan}>Exportar Datos</button>
      </div>
        
  </Layout>
  );
}




export default Reports;
