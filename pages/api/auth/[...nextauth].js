
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
   theme: {
      colorScheme: "light",
      brandColor: "#320df1", 
      logo: "https://1bb437.a2cdn1.secureserver.net/wp-content/uploads/2023/08/Logo-500-full-150x150.jpg", 
      buttonText: "#346df1" 
    },
   debug: true,
   session: {},
   jwt: {},
   providers: [
    CredentialsProvider({
      name: 'Yes',
      credentials: {
         user :{
            type: 'string',
            label: 'Usuario',
         },
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