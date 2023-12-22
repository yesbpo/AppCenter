import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
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
      if (!fechaInicio || !fechaFin) {
        console.error('Por favor, selecciona fechas de inicio y fin.');
        return;
      }

      const response = await fetch(`http://localhost:3001/obtener-mensajes?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
      }

      const mensajes = await response.json();

      const datosFiltrados = mensajes.map((mensaje) => ({
        fecha: mensaje.timestamp,
        mensaje: mensaje.content,
        destinatario: mensaje.number,
        tipo: mensaje.type_message,
        estado: mensaje.status,
        idMensaje: mensaje.idMessage,
        // Agrega más campos según sea necesario
      }));

      const csvData = "Fecha,Mensaje,Destinatario,Tipo,Estado,ID Mensaje\n" +
        datosFiltrados.map((d) => `${d.fecha},${d.mensaje},${d.destinatario},${d.tipo},${d.estado},${d.idMensaje}`).join("\n");

      const blob = new Blob([csvData], { type: 'text/csv' });

      saveAs(blob, 'reporte_whatsapp.csv');
    } catch (error) {
      console.error('Error al generar el reporte:', error);
    }
  };

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
      const nombreArchivo = `Reporte plantillas ${fecha}.xlsx`;

      XLSX.writeFile(workbook, nombreArchivo);
    } catch (error) {
      console.error('Error al generar el reporte:', error);
    }
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-black p-8 bg-opacity-80">
      <h1 className="text-4xl font-bold mb-4">
        Generador de Reportes WhatsApp
      </h1>
      <label className="block mb-4">
        Fecha de Inicio:
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="border rounded p-2 ml-2"
        />
      </label>
      <label className="block mb-4">
        Fecha de Fin:
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          className="border rounded p-2 ml-2"
        />
      </label>
      <label className="block mb-4">
        Nombre de Campaña:
        <input
          type="text"
          value={nombreCampaña}
          onChange={(e) => setNombreCampaña(e.target.value)}
          className="border rounded p-2 ml-2"
        />
      </label>
      <label className="block mb-4">
        Tipo de Mensajes:
        <select
          value={tipoMensajes}
          onChange={(e) => setTipoMensajes(e.target.value)}
          className="border rounded p-2 ml-2"
        >
          <option value="ambos">Ambos</option>
          <option value="entrantes">Entrantes</option>
          <option value="salientes">Salientes</option>
        </select>
      </label>
      <button
        onClick={generarReporte}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Generar Reporte
      </button>

      <h1 className="text-4xl font-bold mb-4 mt-8">
        Exporte de plantillas
      </h1>
      {/* Botón para exportar los datos */}
      <button
        onClick={generarReportePlan}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Exportar Datos
      </button>
    </div>
  </Layout>  );
}

export default Reports;
