import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/UserModel.js";
import { signAccessToken, signRefreshToken } from "../utils/token.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";


export const register = async (req, res) => {
const { email, password } = req.body;
const passwordHash = await bcrypt.hash(password, 12);
await User.create({ email, passwordHash });
res.status(201).json({ message: "User registered" });
};

export const login = async (req, res) => {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
return res.status(401).json({ message: "Invalid credentials" });
}


const accessToken = signAccessToken(user);
const refreshToken = signRefreshToken(user);


user.refreshTokens.push(refreshToken);
await user.save();


res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict" });
res.json({ accessToken });
};

export const refresh = async (req, res) => {
const token = req.cookies.refreshToken;
if (!token) return res.sendStatus(401);


try {
const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
const user = await User.findById(decoded.userId);


if (!user || !user.refreshTokens.includes(token)) {
user.refreshTokens = [];
await user.save();
return res.sendStatus(403);
}


user.refreshTokens = user.refreshTokens.filter(t => t !== token);


const newAccess = signAccessToken(user);
const newRefresh = signRefreshToken(user);


user.refreshTokens.push(newRefresh);
await user.save();


res.cookie("refreshToken", newRefresh, { httpOnly: true, sameSite: "strict" });
res.json({ accessToken: newAccess });
} catch {
res.sendStatus(403);
}
};


export const logout = async (req, res) => {
const token = req.cookies.refreshToken;
if (token) {
const decoded = jwt.decode(token);
await User.findByIdAndUpdate(decoded.userId, { $pull: { refreshTokens: token } });
}
res.clearCookie("refreshToken");
res.sendStatus(204);
};


export const forgotPassword = async (req, res) => {
const user = await User.findOne({ email: req.body.email });
if (!user) return res.sendStatus(200);


const resetToken = crypto.randomBytes(32).toString("hex");
user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
user.passwordResetExpires = Date.now() + 3600000;
await user.save();


const transporter = nodemailer.createTransport({ sendmail: true });
await transporter.sendMail({
to: user.email,
subject: "Password Reset",
text: `Reset token: ${resetToken}`
});


res.sendStatus(200);
};


export const resetPassword = async (req, res) => {
const hashed = crypto.createHash("sha256").update(req.body.token).digest("hex");


const user = await User.findOne({
passwordResetToken: hashed,
passwordResetExpires: { $gt: Date.now() }
});


if (!user) return res.status(400).json({ message: "Invalid token" });


user.passwordHash = await bcrypt.hash(req.body.password, 12);
user.passwordResetToken = undefined;
user.passwordResetExpires = undefined;
user.refreshTokens = [];


await user.save();
res.json({ message: "Password reset successful" });
};