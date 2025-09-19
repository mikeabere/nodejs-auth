import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import conectDB from './config/db.js';
import morgan from "morgan"; //show http status codes in the console

conectDB();

const app = express();
app.use(express.json()); // Middleware to parse JSON

//routes
import authRoutes from "./routes/authRouter.js";

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
 
app.use("/api/v1/auth", authRoutes);

const port = process.env.PORT || 2000;

app.listen(port , ()=> {
    console.log(`server running on ${port} `);
});