import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectionDB = async () => {

    try {

        const connectionObj = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDB connection successfully connect: ${connectionObj.connection.host}`);

        
        
    } catch (error) {
        console.log(`MongoDB connection error: ${error}`);
        process.exit(1)
        
    }
}

export default connectionDB