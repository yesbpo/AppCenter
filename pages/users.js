import React, { useState } from 'react';
import Layout from '../components/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
const CrearUsuario = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [session, setSession] = useState('');
  const [typeUser, setTypeUser] = useState('');
  const [complete_name, setComplete_name] = useState('');
  const handleCrearUsuario = async () => {
    try {
      const createdAt = new Date(); // Puedes ajustar cómo obtienes la fecha de creación
      const updatedAt = new Date(); // Puedes ajustar cómo obtienes la fecha de actualización

      const response = await fetch('http://localhost:3001/crear-usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: usuario,
          password:password,
          email:email,
          createdAt:createdAt,
          updatedAt:updatedAt,
          session:session,
          type_user: typeUser,
          complete_name: complete_name,
      
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // Aquí puedes manejar la respuesta del servidor
      } else {
        console.error('Error al crear el usuario:', response.statusText);
      }
    } catch (error) {
      console.error('Error de red:', error.message);
    }
  };

  return (
    <Layout>
       <div className="container mt-10">
       <h1 className="text-dark">Crear Usuario</h1>
        <form>
          <div className="mb-5">
            <label htmlFor="usuario" className="form-label">Usuario:</label>
            <input type="text" className="form-control" id="usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password:</label>
            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="session" className="form-label">Session:</label>
            <input type="text" className="form-control" id="session" value={session} onChange={(e) => setSession(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="typeUser" className="form-label">Type User:</label>
            <input type="text" className="form-control" id="typeUser" value={typeUser} onChange={(e) => setTypeUser(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="completeName" className="form-label">Complete Name:</label>
            <input type="text" className="form-control" id="completeName" value={complete_name} onChange={(e) => setComplete_name(e.target.value)} />
          </div>
          <button type="button" className="btn btn-dark" onClick={handleCrearUsuario}>
            Crear Usuario
          </button>
        </form>
      </div>
    </Layout>
      );
};

export default CrearUsuario;
