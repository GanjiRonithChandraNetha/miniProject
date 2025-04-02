import usersModel from '../models/users.mjs'
import linksModel from '../models/links.mjs'
import skillsModel from '../models/skills.mjs'
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'
import jwt  from 'jsonwebtoken'
import credentialChecker from '../utils/inputChecker.mjs';

dotenv.config();

const SECRET = process.env.SECRET || "publicSecret";
const SALT = process.env.SALT || 10;

console.log(SALT);
console.log(SECRET);

const signIn = async(req,res)=>{
    try{
        
        //finding if userExists or not
        const findVar = await usersModel.find({userName:req.body.userName,email:req.body.email});
        
        if(findVar.length === 0){    //createTransaction
            const {success,error,data} = credentialChecker({
                userName : req.body.userName,
                email:req.body.email,
                password:req.body.password
            })
            if(!success){
                res.json({
                    message:'user input error',
                    error:error.message
                }).status(402);
                return;
            }
            const token = jwt.sign({userName:req.body.userName,email:req.body.email},SECRET,{expiresIn:'2d'}) 
            console.log(token);
            const hashedPassword = await bcrypt.hash(req.body.password,10);
            console.log(hashedPassword)
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
                console.log(skillsArray);
                const skillsReport = await skillsModel.insertMany(skillsArray);
            }

            const linksArray = [];
            const obj2 = req.body.links;
                if(obj2 != null && typeof obj2 == 'object' && !Array.isArray(obj2)){
                    Object.keys(req.body.links).forEach(key=>{
                    linksArray.push({
                        userId:savedUser._id,
                        linkKey:key,
                        linkValue:req.body.links[key]
                    })
                })
            }
            if(linksArray.length !== 0){
                const linksReport = await linksModel.insertMany(linksArray);
            }

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

const getProfile = async(req,res)=>{
    try {
        const user = await usersModel.findOne({
            userName:req.user.userName,
            email:req.user.email
        })
        if(!user){
            res.json({message:"user not found"}).status(404);
        }else{
            links = await linksModel.find({userId:user._id});
            
            const linksJson = {};
            for(const obj in links){
                linksJson[obj.linkKey] = obj.linkValue;
                linksJson._id = obj._id;
            }


            skills = await skillsModel.find({userId:user._id});
            
            const skillsArr = [];
            for(const obj in skills){
                skillsArr.push({
                    _id:obj._id,
                    skill:obj.skill
                });
            }

            res.json({
                skills:skillsArr,
                links:linksJson
            }).status(200);
        }
    } catch (error) {
        res.json({
            message:"error in fetching data",
            error:error.message
        }).status(500);
    }
}
//nothing its a get reques where data is stored in token

const updateSkills = async(req,res)=>{
    try {
        const user = await usersModel.findOne({
            userName:req.body.userName,
            email:req.body.email
        })
        if(!user){
            res.json({message:"user not found"}).status(404);
        }else{
            //create a transaction
            await skillsModel.deleteMany({_id:{$in:req.body.deletedIds}});
            const insertedSkills = [];
            for(const obj in req.body.insertedSkills){
                insertedSkills.push({
                    userId:user._id,
                    skill:obj
                });
            }
            await skillsModel.insertMany(insertedSkills);
            //end the transaction
        }
    } catch (error) {
        res.json({
            message:"failed in making updates in skills",
            error:error.message
        }).status(500);
    }
}

// {
//     deletedIds:[],
//     insertedSkills:[skills]
// }

const updateLinks = async(req,res)=>{
    try {
        const user = await usersModel.findOne({
            userName:req.body.userName,
            email:req.body.email
        })
        if(!user){
            res.json({message:"user not found"}).status(404);
        }else{
            const obj1 = req.body.deleteIds;
            const obj2 = req.body.linksObject;
            if(Array.isArray(obj1) && (obj2 !== null && !Array.isArray(obj2) && typeof obj2 == 'object')){
                // create a transaction 
                await linksModel.deleteMany({_id:{$in:obj1}});
                const linksInstances = [];
                Object.keys(obj2).forEach(key=>{
                    linksInstances.push({
                        userId:user._id,
                        linkKey:key,
                        linkValue:req.body.linkObject[key]
                    })
                })
                await linksModel.insertMany(linksInstances);
                // end the transaction
                res.status(200).json({message:"links updated"});
            }else
                res.status(400).json({message:"worng input"});
        }
    } catch (error) {
        res.status(500).json({
            message:"failed in making updates in links",
            error:error.message
        });
    }
}

export {signIn,login,getProfile,updateSkills,updateLinks};