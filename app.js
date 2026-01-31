import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";


const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors());


app.use("/api/v1/auth", authRoutes);
//app.use("/auth/login", authRoutes);

if(process.env.NODE_ENV === "development"){
   app.use(morgan("dev"));
}

export default app;