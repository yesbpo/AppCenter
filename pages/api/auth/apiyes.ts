import type { NextApiHandler } from "next";


const credentialsAuth: NextApiHandler<User> = (request, response) => {

    if (request.method !== 'POST'){
        response.status(405).end()
        return
    }

    if ( request.body.password === 'password'){
        const yesuser: User = {
            name: 'yesusuario',
            email: 'mesadeayudaqyebpo.co'
        }
        return response.status(200).json(yesuser)
    }
return response.status(401).end()
}

export default credentialsAuth