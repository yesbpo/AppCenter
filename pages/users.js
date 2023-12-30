import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useSession, signIn } from 'next-auth/react';
const CrearUsuario = () => {
  const { data: sesion } = useSession();
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

      const response = await fetch('http://146.190.143.165:3001/crear-usuario', {
               method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type_user: typeUser,
          email:email,
          session:session,
          usuario: usuario,
          password:password,                    
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
  if (sesion){
  return (
    
    <Layout>
    <div className="flex items-center justify-center h-screen">
    <div className="w-full max-w-md">
      <h1 className="text-dark text-center mb-6">Crear Usuario</h1>    <form>
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
  </div>
</Layout>

      )}
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
      </>
      
        )
};

export default CrearUsuario;
