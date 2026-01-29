import app from "./app.js";
import connectDB from "./config/db.js";
import * as dotenv from "dotenv";
dotenv.config();


connectDB().then(() => {
app.listen(process.env.PORT, () => console.log("Server running"));
})
.catch(err => console.error(err));