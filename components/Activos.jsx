import React, {useEffect, useState} from "react";
import Layout from "./Layout";

function Activos({ mensajes }) {
    if (!mensajes || !Array.isArray(mensajes)) {
      return <p>No hay mensajes disponibles.</p>;
    }
  
    // Filtrar mensajes que no tienen propiedades undefined
    const mensajesFiltrados = mensajes.filter(mensaje => (
      mensaje.numero !== undefined && mensaje.contenido !== undefined && mensaje.date !== undefined
    ));
  
    return (
      <div>
        {mensajesFiltrados.map((mensaje, index) => (
          <div key={index} className={`mensaje ${mensaje.tipo}`}>
            <p>Número: {mensaje.numero}</p>
          </div>
        ))}
      </div>
    );
  }
  
export { Activos }