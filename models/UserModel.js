import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type: String, required: true},
    email:{type: String, required:true, unique:true},
    password:{type: String, required: true},
    otp:{type: String}, //Otp for verification
    otpExpiry:{type: Date}, //Expiry time for OTP
    isVerified:{type: Boolean, default: false } // Email verification status
});

const User = mongoose.model("User", userSchema);

export default User;