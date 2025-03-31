import { Schema,model } from "mongoose";

const links = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    linkKey:{
        required:true,
        type:String
    },
    linkValue:{
        require:true,
        type:String
    }
});
// console.log(links)
const linksModel = model('links',links);

export default linksModel;

// set rule no instance creation until key and value is created