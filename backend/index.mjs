import express from 'express';
import connectToDB from './connections/localConnection.mjs';
import accessRoutes from './routes/access.mjs';
import jwtChecker from './middelware/jwtChecker.mjs';
import profileRouter from './routes/profile.mjs'
import issuesRouter from "./routes/issuesRoutes.mjs";
import employerRoutes from "./routes/employerRoutes.mjs"

const PORT = 3636;
const app = express();

app.use(express.json())
app.use('/v1/application/',accessRoutes);
app.use(jwtChecker)
app.use("/v1/application/",profileRouter);
app.use("/v1/application/",issuesRouter);
app.use("/v1/application/employer/job/",employerRoutes);
app.get('/',(req,res)=>{
    console.log("hello");
    res.json({
        message:"first"
    }).status(200);
})


app.listen(PORT,()=>{})