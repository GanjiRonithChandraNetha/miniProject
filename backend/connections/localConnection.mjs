import {connect} from 'mongoose';

const connectToDB = await connect("mongodb://localhost:27017/miniProject").then(()=>{
    console.log("connected successfully")
}).catch(err=>{
    console.log("could not connect");
    console.log(err);
})

export default connectToDB;