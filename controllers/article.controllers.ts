import { Request, Response } from "express";
import { User } from "../models/user.models.js";
import { Article } from "../models/article.models.js";
import { getDataURi } from "../utils/multer.dataURI.js";
import cloudinary from "../config/cloudinary.js";

interface AdminRequest extends Request {
  user?: any;
}

export const writeArticle = async (req: AdminRequest, res: Response) => {
  try {
    const { title, content, translatedContent, category, videoUrl } = req.body || {};

    const image = req.file?.path || "";

    if (!title || !content || !translatedContent || !category)
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
        return res.status(403).json({
          Success: false,
          Message: "Not authorized for this category",
        });
      }
    }

    let imageUrl = ''
    if(req.file){
        const fileDataUri = getDataURi(req.file);
        const result = await cloudinary.uploader.upload(fileDataUri,{
          folder:"TNN-News",
          resource_type:'image'
        })
         imageUrl = result.secure_url
    }
   

    const article = await Article.create({
      title,
      content,
      translatedContent,
      image:imageUrl,
      videoUrl,
      category,
      author: user._id,
      views: 0,
      likes: [],
    });

    return res
      .status(201)
      .json({ Success: true, Message: "Article posted", article });
  } catch (error) {
    return res
      .status(500)
      .json({ Success: false, Message: "Server Error", Error: error });
  }
};

// get All articles
export const getAllArticles = async (req: Request, res: Response) => {
  try {
    const articles = await Article.find()
      .populate("author", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      Success: true,
      Count: articles.length,
      Articles: articles,
    });
  } catch (error) {
    res.status(500).json({
      Success: false,
      Message: "Failed to fetch articles",
      Error: error,
    });
  }
};
