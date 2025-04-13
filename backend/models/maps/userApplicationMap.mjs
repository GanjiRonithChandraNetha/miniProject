import { Schema,model } from "mongoose";

const userApplicationsMaps = Schema({
    freelancerId:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    applicationId:{
        type:Schema.Types.ObjectId,
        ref:'applications'
    }
});

const userApplicationsModel = model('userApplicationsMaps',userApplicationsMaps);

export default userApplicationsModel;