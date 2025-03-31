import { Schema,model } from "mongoose";
const payments = new Schema({
    jobId:{
        type: Schema.Types.ObjectId,  // Storing reference
        ref: 'jobs' 
    },
    amount:{
        type:Number,
        required:true
    },
    paymentMethod:{
        type:String,
        enum:['UPI','bank-transfer']
    },
    status:{
        type:String,
        enum:[""] // dought
    },
    createAt:{
        type:Date,
        required:true
    },
    updateAt:{ // dought
        type:Date,
        required:true
    }
}) 

const paymentModel = model(payments,"payments");

export default paymentModel;