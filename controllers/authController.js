import nodemailer from "nodemailer";
import crypto from "crypto";
import User from "../models/UserModel.js";
import HTTP_STATUS_CODES from "http-status-codes";

 // Email setup
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

// Generate OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

export const register = async (req, res) => {
try{
  const {name, email, password} = req.body;

  let user = await User.findOne({ email });
  if (user) return res.status(400).json({message: "user with this email exists"});

   const otp = generateOTP();
   const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user = new User({name, email, password, otp, otpExpiry});
    await user.save();

    const mailOptions = {
      to: user.email,
      from: "no-reply@yourapp.com",
      subject: "Otp verification",
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    res
      .status(HTTP_STATUS_CODES.CREATED)
      .json({success: true, message: "User registered. Please verify OTP sent to email." });
    }catch(error){
     res
       .status(500)
       .json({ success: false, message: "Error registering user", error });
    }
}