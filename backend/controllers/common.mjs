import usersModel from '../models/users.mjs'
import linksModel from '../models/links.mjs'
import skillsModel from '../models/skills.mjs'
import jobModel from '../models/jobs.mjs';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'
import jwt  from 'jsonwebtoken'
import credentialChecker from '../utils/validaters/signInValidator.mjs';
import issueModel from '../models/issues.mjs';

dotenv.config();

const SECRET = process.env.SECRET || "publicSecret";
const SALT = process.env.SALT || 10;

console.log(SALT);
console.log(SECRET);

const signIn = async(req,res)=>{
    try{
        
        console.log(req.body)
        //finding if userExists or not
        const findVar = await usersModel.find({userName:req.body.userName,email:req.body.email});
        
        if(findVar.length === 0){    //createTransaction
            const {success,error,data} = credentialChecker({
                userName : req.body.userName,
                email:req.body.email,
                password:req.body.password
            })
            if(!success){
                console.log(error)
                res.status(402).json({
                    message:'user input error',
                    error:error.message
                });
                return;
            }
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
            const token = jwt.sign({
                userName:req.body.userName,
                email:req.body.email,
                _id:user._id
            },SECRET,{expiresIn:'2d'}) 

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
        console.log(req.body);
        let checker = null;
        if (req.body.userName) {
            checker = await usersModel.findOne({ userName: req.body.userName });
        } else if (req.body.email) {
            checker = await usersModel.findOne({ email: req.body.email });
        } else {
            return res.status(400).json({ message: "userName or email is required" });
        }
        console.log(checker)
        if(checker){
            if(bcrypt.compare(req.body.password,checker.password)){
                const token = jwt.sign(
                    {
                        userName:checker.userName,
                        email:checker.email,
                        _id:checker._id
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
        }else
            res.status(400).json({message:"user does not exist"})
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
            const links = await linksModel.find({userId:user._id});
            // console.log(links);
            const linksArr = [];
            for(const obj in links){
                const obj1 = {}
                obj1._id = links[obj]._id
                obj1[links[obj].linkKey] = links[obj].linkValue
                linksArr.push(obj1); 
            }
            // console.log(linksArr);

            const skills = await skillsModel.find({userId:user._id});
            // console.log(skills)
            const skillsArr = [];
            for(const obj in skills){
                skillsArr.push({
                    _id:skills[obj]._id,
                    skill:skills[obj].skill
                });
            }

            res.json({
                username:user.userName,
                email:user.email,
                profile:user.profilePic,
                skills:skillsArr,
                links:linksArr
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

// const updateSkills = async(req,res)=>{
//     try {
//         const user = await usersModel.findOne({
//             userName:req.body.userName,
//             email:req.body.email
//         })
//         if(!user){
//             res.json({message:"user not found"}).status(404);
//         }else{
//             //create a transaction
//             await skillsModel.deleteMany({_id:{$in:req.body.deletedIds}});
//             const insertedSkills = [];
//             for(const obj in req.body.insertedSkills){
//                 insertedSkills.push({
//                     userId:user._id,
//                     skill:obj
//                 });
//             }
//             await skillsModel.insertMany(insertedSkills);
//             //end the transaction
//         }
//     } catch (error) {
//         res.json({
//             message:"failed in making updates in skills",
//             error:error.message
//         }).status(500);
//     }
// }

// {
//     deletedIds:[],
//     insertedSkills:[skills]
// }


const updateSkills = async(req,res)=>{
    try{
        if(req.body.type === "INSERT" && req.body.skill){
            await skillsModel.create({
                userId:req.user._id,
                skill:req.body.skill
            })
            res.status(200).json({message:"skill added"});
        }else if(req.body.skillId && req.body.type === "DELETE"){
            await skillsModel.deleteOne({_id:req.body.skillId})
            res.status(200).json({message:"deleted skill"})
        }else{
            res.status(400).json({message:"bad request"})
        }
    }catch(err){
        res.status(500).json({
            message:"skill not updated"
        })
    }
}

// {
//     type:INSERT || delete,
//     skill: if delete,
//     skillID: _id
// }

// const updateLinks = async(req,res)=>{
//     try {
//         const user = await usersModel.findOne({
//             userName:req.body.userName,
//             email:req.body.email
//         })
//         if(!user){
//             res.json({message:"user not found"}).status(404);
//         }else{
//             const obj1 = req.body.deleteIds;
//             const obj2 = req.body.linksObject;
//             if(Array.isArray(obj1) && (obj2 !== null && !Array.isArray(obj2) && typeof obj2 == 'object')){
//                 // create a transaction 
//                 await linksModel.deleteMany({_id:{$in:obj1}});
//                 const linksInstances = [];
//                 Object.keys(obj2).forEach(key=>{
//                     linksInstances.push({
//                         userId:user._id,
//                         linkKey:key,
//                         linkValue:req.body.linkObject[key]
//                     })
//                 })
//                 await linksModel.insertMany(linksInstances);
//                 // end the transaction
//                 res.status(200).json({message:"links updated"});
//             }else
//                 res.status(400).json({message:"worng input"});
//         }
//     } catch (error) {
//         res.status(500).json({
//             message:"failed in making updates in links",
//             error:error.message
//         });
//     }
// }
const updateLinks = async(req,res)=>{
    try {
        if(req.body.type === "DELETE" && req.body.linkId){
            await linksModel.deleteOne({_id:req.body.linkId})
            res.status(200).json({message:"data deleted"});
        }else if(req.body.type === "INSERT" && req.body.linkKey && req.body.linkValue){
            await linksModel.insertOne({
                userId:req.user._id,
                linkKey:req.body.linkKey,
                linkValue:req.body.linkValue
            });
            res.status(200).json({message:"data inserted"})
        }else{
            res.status(400).json({message:"worng input"});
        }
    } catch (error) {
        res.status(500).json({
            message:"failed in making updates in links",
            error:error.message
        });
    }
}

// {
//     type:INSERT || DELETE ,
//     linkId: for insert,
//     linkKey:for delete,
//     linkValue: for delete
// }

const raiseIssue = async(req,res)=>{
    try {
        if(req.body.issue && req.body.jobId){
            await issueModel.insertOne({
                raisedBy:req.user._id,
                description:req.body.issue,
                jobId:req.body.jobId
            })
            res.status(200).json({message:"issue raised"});
        }else{
            res.status(400).json({message:"bad request"});
        }
    } catch (error) {
        res.status(500).json({
            message:"issue not reaised",
            error:error.message
        })
    }
}

const viewIssue = async(req,res)=>{
    try {
        const ans =await issueModel.find({raisedBy:req.user._id});
        res.status(200).json({data:ans});
    } catch (error) {
        res.status(500).json({
            message:"error in retriving issues",
            error:error.message
        })
    }
}

const search = async (req, res) => {
    const search = req.query.search?.toLowerCase() || '';

    const jobs = await jobModel.find({
        $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
        ]
    });
    res.json({ vacantJobs: jobs.filter(job => job.status === 'vacant'), engagedJobs: jobs.filter(job => job.status === 'ongoing') });
}

const viewJob = async(req,res)=>{
    try {
        console.log("hello");
        const jobId = req.params.jobId
        console.log(jobId);
        if(!jobId)
            return res.status(400).json({message:"jobId not sent"});
        const job = await jobModel.findById(jobId);
        console.log(job);
        if(!job)
            return res.status(404).json({message:"job not found"});
        res.status(200).json({data:job});
    } catch (error) {
        
    }
}

export {signIn,
    login,
    getProfile,
    updateSkills,
    updateLinks,
    viewIssue,
    raiseIssue,
    search,
    viewJob
}