import {connect} from 'mongoose';


const publicConnectDB = async () => {
  try {
    await connect(process.env.MONGODB_URL);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default publicConnectDB;
