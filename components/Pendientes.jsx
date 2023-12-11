import React, {useEffect, useState} from "react";
import { Activos } from "./Activos";
function Pendientes ({ mensajes, acivarengestion }) {
    const [engestion, setEngestion] = useState([]);
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
            <ul>
              
                <li key={index}>
                  <strong onClick={() => setEngestion((anteriores)=>[...anteriores,mensaje])}>Usuario:</strong> {mensaje.numero},{' '}
                  <strong>Fecha:</strong> {mensaje.date}
                </li>
              
            </ul>
          </div>
        ))}
        {acivarengestion && <Activos mensajes={engestion}/>}
      </div>
    );
  }
  
export { Pendientes }