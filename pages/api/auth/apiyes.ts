import type { NextApiHandler } from "next";


const credentialsAuth: NextApiHandler<User> = (request, response) => {

    if (request.method !== 'POST'){
        response.status(405).end()
        return
    }
    
    if ( request.body.user === 'password' && request.body.password === 'password'){
        const yesuser: User = {
            Nombre: 'yesusuario',
            Id: 'mesadeayudaqyebpo.co',
            TypeUser: 'Asesor'
        }
        
        return response.status(200).json(yesuser)
        
    }
    
return response.status(401).end()
}

export default credentialsAuth