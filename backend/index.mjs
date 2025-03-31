import express from 'express';
import connectToDB from './connections/localConnection.mjs';
import usersRouter from './users.mjs';

const PORT = 3636;
const app = express();

app.use(express.json())
app.use('v1/application/',accessRoutes);

app.get('/',(req,res)=>{
    console.log("hello");
    res.json({
        message:"first"
    }).status(200);
})


app.listen(PORT,()=>{})