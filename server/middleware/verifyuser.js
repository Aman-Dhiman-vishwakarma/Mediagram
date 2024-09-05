import jwt from "jsonwebtoken";
export const verifyuser = async (req, res, next) => {
    try {
        const token = req.cookies.mediagram_token;
        if (!token) {
            return res.status(401).json({success:false, message:"Unauthrized"})
        }

        jwt.verify(token,  process.env.JWT_SECRET, (err, user)=>{
            if (err) {
                return res.status(401).json({success:false, message:"Unauthrized"})
            }
            req.user = user;
            next();
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
} 