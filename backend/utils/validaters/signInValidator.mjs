import {string,object} from 'zod';

const credential = object({
    userName:string().min(6,'must contail atleast 6 characters'),
    email:string().min(6,"must be an email"),
    password:string().min(6,'must contain atleast 6 characters')
    .regex(/[A-Z]/,'must contain atleast one upper ')
    .regex(/[a-z]/,'must contain atleast one small ')
    .regex(/[0-9]/,'must contain atleast on numeric charecter')
    .regex(/[^A-Za-z0-9]/,'must contain atleast on special character')
})

const credentialChecker = data=>credential.safeParse(data);

export default credentialChecker;