import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();
const SECRET = process.env.SECRET

const jwtChecker = async(req,res,next)=>{
    try {
        console.log(req.headers['authorization'])
        const token = req.headers['authorization']?.split(' ')[1];
        console.log(token);
        const decode = jwt.verify(token,SECRET);
        console.log(decode)
        req.user = {
            userName:decode.userName,
            email:decode.email,
            _id:decode._id
        }
        const timeLeft = decode.exp - Math.floor(Date.now()/1000);
        if(timeLeft > 60*60){
            const newToken = +jwt.sign({
                userName:decode.userName,
                email:decode.email,
                _id:decode._id
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