import {Schema,model} from 'mongoose'

const users = new Schema({
    userName:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    profilePic:{
        data: Buffer,
        contentType: String
    },
    cooperationRatio:{
        type:Number,
        default:0
    }
})
// console.log(users);
const usersModel = model("users",users);

export default usersModel;