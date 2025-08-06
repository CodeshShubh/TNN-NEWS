import {Request, Response, NextFunction,} from 'express'
import jwt from 'jsonwebtoken'

interface AuthRequest extends Request {
    user?:any;
}

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export const VerifyToken = (req:AuthRequest, res:Response, next:NextFunction)=>{
     const authHeader = req.headers.authorization;

      if(!authHeader?.startsWith("Bearer "))
          return res.status(401).json({Success:false, Message:"Unauthorized"})


      const token = authHeader.split(' ')[1];

      try {
        const decode = jwt.verify(token,JWT_SECRET);

        req.user = decode;
        next();
        
      } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
      }

}