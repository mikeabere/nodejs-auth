import jwt from "jsonwebtoken";


export const signAccessToken = (user) => jwt.sign(
{ userId: user._id, role: user.role },
process.env.ACCESS_TOKEN_SECRET,
{ expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
);


export const signRefreshToken = (user) => jwt.sign(
{ userId: user._id },
process.env.REFRESH_TOKEN_SECRET,
{ expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
);