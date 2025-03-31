import { Schema,model } from "mongoose";

const userPaymentsMaps = Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    paymentId:{
        type:Schema.Types.ObjectId,
        ref:'payments'
    }
})

const userPaymentsModel = model(userPaymentsMaps,'userPaymentsMaps');

export default userPaymentsModel