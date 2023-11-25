

import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
   theme: 'light',
   debug: true,
   session: {},
   jwt: {},
   providers: [
    CredentialsProvider({
      name: 'Yes',
      credentials: {
         
         password: {
            type: 'password',
            label:'ingresa tu contraseña',
         }

      },
      async authorize(credentials){
        const res =  await fetch('http://localhost:3000/api/auth/apiyes',{
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: {'Content-type': 'application/json'}
         })

         const user  = await res.json()
         if(res.ok && user ){
            return user
         }
         return null
      }
    }),
    // ...add more providers here
  ],
}
export default NextAuth(authOptions)