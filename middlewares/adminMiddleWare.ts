import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.models.js";
import { AuthRequest } from "../types/authRequest.types.js";


export const adminVerify = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
     if (!req.user) {
      return res.status(401).json({
        Status: false,
        Message: "Unauthorized: Token decoded but user data missing",
      });
    }
    let user = await User.findById(req.user.id);

    if (user?.role !== "admin")
      return res.status(403).json({
        Status: false,
        Message: "Access denied: Admins only",
      });

    if (!user?.category || user?.category.length <= 0)
      return res.status(403).json({
        Status: false,
        Message: "Access denied: No categories assigned",
      });

      req.userCategory = user?.category

    next();
  } catch (error:any) {
    console.error("JWT Error:", error.message);
    return res.status(400).json({
        Status: false,
        Message: "Error in admin Access",
      });
  }
};
