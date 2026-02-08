import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import cors from 'cors';
import dotenv  from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';
import userRouter from './route/user.route.js'
// await connectDB();


const app = express();
app.use(cors({

    credentials: true,
    origin: process.env.FORTEND_URL
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet({
    crossOriginResourcePolicy: false
}));

//  EJS Templating Engine Setup
app.set("views", path.join(__dirname, "views"));
app.use(expressEjsLayouts);
app.set("layout", "layouts/main");
app.set("view engine", "ejs");


 

app.get('/', (req, res) => {
  res.json({ message: "server running" });
});

// user router
app.use('/api/user',userRouter)

 connectDB().then(() => {

    const PORT = process.env.PORT || 5000;

    app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
});

 })


    
// } 

// startServer;

