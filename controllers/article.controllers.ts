import { Request, Response } from "express";
import { User } from "../models/user.models.js";
import { Article } from "../models/article.models.js";

interface AuthRequest extends Request {
  user?: any;
}

export const writeArticle = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, translatedContent, category, videoUrl } = req.body ||{};

    const image = req.file?.path || "";

    if(!title || !content || !translatedContent)
        return res
        .status(400)
        .json({ Success: false, Message: "Pleas Enter Article First" });

    const user = await User.findById(req.user.id);

    if (!user)
      return res
        .status(404)
        .json({ Success: false, Message: "User not found" });

    if (user.role == "admin") {
      if (
        !user.category?.includes("all") &&
        !user.category?.includes(category)
      ) {
        return res
          .status(403)
          .json({
            Success: false,
            Message: "Not authorized for this category",
          });
      }
    }

    const article = await Article.create({
      title,
      content,
      translatedContent,
      image,
      videoUrl,
      category,
      author: user._id,
      views: 0,
      likes: [],
    });

     return res.status(201).json({ Success: true, Message: "Article posted", article });


  } catch (error) {
        return res.status(500).json({ Success: false, Message: "Server Error", Error: error });
  }
};




