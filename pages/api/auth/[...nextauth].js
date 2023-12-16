
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
 
         const userFound = await db.user.findUnique({
             where: {
                 usuario: credentials.usuario
             }
         })
 
         if (!userFound) throw new Error('No user found')
 
         console.log(userFound)
 
         const matchPassword = bcrypt.compare(credentials.password, userFound.password)
 
         if (!matchPassword) throw new Error('Wrong password')
 
         return {
             id: userFound.id,
             name: userFound.usuario,
             email:  userFound.email,
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


