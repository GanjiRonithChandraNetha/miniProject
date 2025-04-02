import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();
const SECRET = process.env.SECRET

const jwtChecker = async(req,res,next)=>{
    try {
        const token = req.headers['Authorization']?.split(' ')[1];
        const decode = jwt.verify(token,SECRET);
        req.users = {
            userName:decode.userName,
            email:decode.email
        }
        const timeLeft = decode.exp - Math.floor(Date.now()/1000);
        if(timeLeft > 60*60){
            const newToken = +jwt.sign({
                userName:decode.userName,
                email:decode.email
            },SECRET,{expiresIn:'2d'})
            req.header.Authorization = `Bearer ${newToken}`;
        }
        next();
    } catch (error) {
        if(error.name == 'TokenExpiredError'){
            res.status(401).json({
                message:"token has expired"
            });
        }
        else{
            res.status(403).json({
                message:"token not valid"
            })
        }
    }
}

export default jwtChecker