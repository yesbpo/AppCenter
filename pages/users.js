import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';


const Users = () => {
    const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState({
    Nombre: '',
    Apellido: '',
    Email: '',
    Usuario: '',
    Password: '',
    TypeUser: 'Asesor',
  });
  const [creationStatus, setCreationStatus] = useState(null);



//Aca enviamos los datos del usuario creado
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validar que todos los campos estén llenos
    if (!userData.Nombre || !userData.Apellido || !userData.Email || !userData.Usuario || !userData.Password) {
      alert('Faltan campos. Por favor, complete todos los campos.');
      return;
    }

    // Validar que el nombre de usuario y el correo electrónico no estén en uso
    const isUsernameTaken = users.some((user) => user.Usuario === userData.Usuario);
    const isEmailTaken = users.some((user) => user.Email === userData.Email);

    if (isUsernameTaken) {
      alert('El nombre de usuario ya está en uso. Por favor, elija otro.');
      return;
    }

    if (isEmailTaken) {
      alert('El correo electrónico ya está en uso. Por favor, elija otro.');
      return;
    }

    try {
      const response = await axios.post('https://3d29bmtd-8080.use2.devtunnels.ms/crear-usuario', userData);
      console.log('Respuesta del servidor:', response.data);
      setCreationStatus('Usuario creado exitosamente.');
      setTimeout(() => {
        setCreationStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Error al hacer la solicitud:', error.message);
      setCreationStatus('Error al crear el usuario.');
      setTimeout(() => {
        setCreationStatus(null);
      }, 3000);
    }
  };

//Obtener los usuarios en la db
useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://3d29bmtd-8080.use2.devtunnels.ms/obtener-usuarios');
        setUsers(response.data.usuarios);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Layout>
      <p>Crear Usuario:</p>
      <form onSubmit={handleSubmit}>

        <div>
          <label>
            Nombre:
            <input type="text" name="Nombre" value={userData.Nombre} onChange={handleChange} />
          </label>
          
          <label>
            Apellido:
            <input type="text" name="Apellido" value={userData.Apellido} onChange={handleChange} />
          </label>

          <label>
            Correo:
            <input type="text" name="Email" value={userData.Email} onChange={handleChange} />
          </label>

          <label>
            Usuario:
            <input type="text" name="Usuario" value={userData.Usuario} onChange={handleChange} />
          </label>

          <label>
            Contraseña:
            <input type="text" name="Password" value={userData.Password} onChange={handleChange} />
          </label>

          <label>
              Asesor:
              <input
                type="radio"
                name="TypeUser"
                value="Asesor"
                checked={userData.TypeUser === 'Asesor'}
                onChange={handleChange}
              />
            </label>

            <label>
              Coordinador:
              <input
                type="radio"
                name="TypeUser"
                value="Coordinador"
                checked={userData.TypeUser === 'Coordinador'}
                onChange={handleChange}
              />
            </label>
        </div>

        <div>
          <button type="submit">Crear Usuario</button>
        </div>
      </form>

      {creationStatus && <p>{creationStatus}</p>}

      <p>Usuarios:</p>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            Nombre: {user.Nombre}, Apellido: {user.Apellido}, Email: {user.Email}, Usuario: {user.Usuario}, Tipo de usuario: {user.TypeUser}
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Users;
