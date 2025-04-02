import {Schema,model} from "mongoose";

const skills = new Schema({
    userId:{ 
        type: Schema.Types.ObjectId,  // Storing reference
        ref: 'users'  // Refers to 'User' model
    },
    skill:String    
})
// console.log(skills)
const skillsModel = model("skills",skills);
export default skillsModel;