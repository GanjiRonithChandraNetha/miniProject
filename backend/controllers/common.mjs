import usersModel from '../models/users.mjs'
import linksModel from '../models/links.mjs'
import skillsModel from '../models/skills.mjs'
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'
import * as jwt  from 'jsonwebtoken'

dotenv.config();

const SECRET = process.env.SECRET || "publicSecret";
const SALT = process.env.SALT || 10;

const signIn = async(req,res)=>{
    try{
        
        //finding if userExists or not
        const findVar = await usersModel.find({userName:req.body.userName,email:req.body.email});
        
        if(findVar.length === 0){    //createTransaction

            hashedPassword = await bcrypt.hash(req.body.password,SALT);
            const obj = {
                userName : req.body.userName,
                email:req.body.email,
                password:hashedPassword
            }
            
            const user = new usersModel(obj);
            const savedUser = await user.save();
            
            if(Array.isArray(req.body.skills)){    
                const skillsArray = [];
                req.body.skills.forEach(element => {
                    skillsArray.push({userId:savedUser._id,skill:element});
                });
                const skillsReport = await skillsModel.insertMany(skillsArray);
            }

            if(Array.isArray(req.body.links)){
                const linksArray = [];
                req.body.links.forEach(element =>{
                    Object.keys(element).forEach(key=>{
                        linksArray.push({
                            userId:savedUser._id,
                            linkKey:key,
                            linkValue:element[key]
                        })
                    })
                })
            }
            const linksReport = await linksModel.insertMany(linksArray);

            const token = jwt.sign({userName:req.body.userName,email:req.body.email},SECRET,{expiresIn:'2d'}) 
            res.status(200).json({
                message:"successfully created user",
                token:token
            });
            // end
        }else{
            res.status(400).json({
                message:"user alredy exsits",
            });
        }
    }catch(err){
        if(err.code === 11000){
            res.status(401).json({
                message:"username or email already exists",
                error:err.message
            })
        }else{
            res.status(500).json({
                message:"faild to create user",
                error:err.message
            })
        }
    }
}

const login = async (req,res)=>{
    try{
        let checker = null;
        if (req.body.userName) {
            checker = await usersModel.findOne({ userName: req.body.userName });
        } else if (req.body.email) {
            checker = await usersModel.findOne({ email: req.body.email });
        } else {
            return res.status(400).json({ message: "userName or email is required" });
        }

        if(checker){
            if(bcrypt.compare(req.body.password,checker.password)){
                const token = jwt.sign(
                    {
                        userName:checker.userName,
                        email:req.body.email
                    },
                    SECRET,{expiresIn:'2d'}
                );
                res.status(200).json(
                    {
                        message:"user loged in",
                        token:token
                    }
                )
            }else{
                res.status(400).json({message:"wrong password"})
            }
        }
    
    }catch(err){
        res.status(500).json({
            message:"user not loged in",
            error:err.message
        })
    }
}

export {signIn,login};