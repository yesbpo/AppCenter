
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from '../../../libs/db';
import bcrypt from 'bcrypt'



export const authOptions = {
   providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          usuario: { label: "Usuario", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password", placeholder: "*****" },
        },   async authorize(credentials, req) {
         console.log(credentials)
 
         const userFound = await db.user.findFirst({
             where: {
                 usuario: credentials.usuario
             },
          
         })
 
         if (!userFound) throw new Error('No user found')
 
         console.log(userFound)
          
         const matchPassword = await credentials.password == userFound.password;
 
         if (!matchPassword) throw new Error('Wrong password')
         const updateuser = async () => {
          const usuario = userFound.usuario; // Reemplaza con el nombre de usuario que deseas actualizar
          const nuevoDato = 'Activo'; // Reemplaza con el nuevo valor que deseas asignar
        
          try {
            const response = await fetch('https://appcenteryes.appcenteryes.com/db/actualizar/usuario', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                nuevoDato: nuevoDato,
                usuario: usuario
              }),
            });
        
            if (response.ok) {
              const data = await response.json();
             // Aquí puedes manejar la respuesta del servidor
            } else {
              console.error('Error al actualizar el usuario:', response.statusText);
            }
            
          } catch (error) {
            
          }
        };
         return {
             id: userFound.id,
             name: userFound.usuario,
             email:  userFound.email,
             type_user:  userFound.type_user,
         }
       },
     }),
   ],
   pages: {
     signIn: "/auth/login",
   }
    // ...add more providers here
  
}
export default NextAuth(authOptions);


