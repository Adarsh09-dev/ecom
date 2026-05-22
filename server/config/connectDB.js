import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI && process.env.MONGODB_URI.trim();
if (!uri) {
    throw new Error("MONGODB_URI is missing in environment (.env)");
}

async function connectDB() {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('mongoDB connection error', err && err.message ? err.message : err);
        if (err && err.name === 'MongooseServerSelectionError') {
            console.error('Possible causes: incorrect URI, network access blocked, or Atlas IP not whitelisted.');
            console.error('Check Atlas Network Access and whitelist your current IP or 0.0.0.0/0: https://www.mongodb.com/docs/atlas/security-whitelist/');
            console.error('Recommended URI format (SRV): mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority');
        }
        process.exit(1);
    }
}

export default connectDB;
