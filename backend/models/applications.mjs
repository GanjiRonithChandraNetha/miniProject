import { Schema,model } from "mongoose";

const applicatons = Schema({
    bidAmount:{
        type:Number,
        required:true
    },
    coverLetter:{
        type:String,
        required:true
    }, //dought
    status:{
        type:String,
        default:"draft",
        enum:["draft","published","appointed","rejected","selected","ready"]
    }
},
{timestamps:true});

const applicationModel = model("applications",applicatons);

export default applicationModel;