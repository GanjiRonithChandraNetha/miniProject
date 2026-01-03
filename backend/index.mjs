import express from 'express';
// import connectToDB from './connections/localConnection.mjs';
import publicConnectDB from './connections/golobalConnection.mjs';
import dotenv from 'dotenv';
import accessRoutes from './routes/accessRoutes.mjs';
import jwtChecker from './middelware/jwtChecker.mjs';
import commonRoutes from './routes/commonRoutes.mjs'
import issuesRouter from "./routes/issuesRoutes.mjs";
import employerRoutes from "./routes/employerRoutes.mjs"
import freelancerRoutes from "./routes/freelancerRoutes.mjs"
import cors from 'cors'

dotenv.config();
publicConnectDB();

// const PORT = 3636;
const app = express();

app.use(express.json())
app.use(cors({origin:"http://localhost:5173"}))

app.use('/v1/application/',accessRoutes);

app.use(jwtChecker)
app.use("/v1/application/",commonRoutes);
app.use("/v1/application/",issuesRouter);
app.use("/v1/application/employer/job/",employerRoutes);
app.use("/v1/application/freelancer/",freelancerRoutes);

app.get('/',(req,res)=>{
    console.log("hello");
    res.json({
        message:"first"
    }).status(200);
})


app.listen(process.env.PORT,()=>{})