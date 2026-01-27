import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type: String, required: true},
    email:{type: String, required:true, unique:true},
    password:{type: String, required: true},
    passwordHash:{type: String, required: true},
    otp:{type: String}, //Otp for verification
    otpExpiry:{type: Date}, //Expiry time for OTP
    role: { enum: ['user','admin']},
    refreshTokens: [],
    isEmailVerified:{type: Boolean, default: false }, // Email verification status
    passwordResetToken:{type: String},
    passwordResetExpires:{type: Date},
    createdAt
});

const User = mongoose.model("User", userSchema);

export default User;