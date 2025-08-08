import { Request, Response } from "express";
import { User } from "../models/user.models.js";
import { Article } from "../models/article.models.js";
import { getDataURi } from "../utils/multer.dataURI.js";
import cloudinary from "../config/cloudinary.js";
import { AuthRequest } from "../types/authRequest.types.js";
import mongoose from "mongoose";

export const writeArticle = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, translatedContent, category, videoUrl } =
      req.body || {};

    // const image = req.file?.path || "";

    if (!title || !content || !translatedContent || !category)
      return res
        .status(400)
        .json({ Success: false, Message: "Pleas Enter Article First" });

    if (!req.user) {
      return res
        .status(404)
        .json({ Success: false, Message: "req.user passed by MiddleWare" });
    }

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

    let imageUrl = "";
    if (req.file) {
      const fileDataUri = getDataURi(req.file);
      const result = await cloudinary.uploader.upload(fileDataUri, {
        folder: "TNN-News",
        resource_type: "image",
      });
      imageUrl = result.secure_url;
    }

    const article = await Article.create({
      title,
      content,
      translatedContent,
      image: imageUrl,
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

// get Single Article by id

export const articleById = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;

    const article = await Article.findById(id).populate("author", "name -_id");

    if (!article)
      return res.status(404).json({
        Success: false,
        Message: "Article Removed Or Not Available",
      });

    return res.status(200).json({
      Success: true,
      Message: "Article Fetched",
      article,
    });
  } catch (error) {
    return res.status(200).json({
      Success: false,
      Message: "Failed to Fetched",
      Error: error,
    });
  }
};

// Like/Unlike Article

export const likeArticle = async (req: AuthRequest, res: Response) => {
  try {
    let { articleId } = req.params;

    if (!req.user) {
      return res
        .status(404)
        .json({ Success: false, Message: "req.user passed by MiddleWare" });
    }

    const existUser = await User.findById(req.user.id);

    const article = await Article.findById(articleId);

    if (!existUser)
      return res.status(404).json({
        Success: false,
        Message: "Please login first for Like",
      });

    if (existUser.role !== "user") {
      return res
        .status(403)
        .json({ Success: false, Message: "Only users can like articles" });
    }

    if (!article)
      return res.status(404).json({
        Success: false,
        Message: "Article not found Or Removed",
      });

    const alreadyLiked = article.likes.includes(existUser.id);

    if (alreadyLiked) {
      article.likes = article.likes.filter(
        (id) => id.toString() !== existUser.id.toString()
      );
    } else {
      article.likes.push(new mongoose.Types.ObjectId(req.user.id));
    }

    await article.save();

    res.status(200).json({
      Success: true,
      Message: alreadyLiked ? "Unlike Article" : "Liked Article",
      Likes: article.likes.length,
    });
  } catch (error) {
    res.status(500).json({
      Success: false,
      Message: "Failed to like article",
      Error: error,
    });
  }
};

// get filtered article

export const getFilteredArticles = async (req: Request, res: Response) => {
  const { search, category, page = 1, limit = 10 } = req.query;

  const query: any = {};

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const articles = await Article.find(query)
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 })
    .populate("author", "name email");

  const total = await Article.countDocuments(query);

  res.status(200).json({
    Success: true,
    Count: articles.length,
    Total: total,
    Page: Number(page),
    Articles: articles,
  });
};

// add comment

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { articleId } = req.params;
    const { text } = req.body;

    const article = await Article.findById(articleById);

    if (!text)
      return res.status(400).json({
        Success: false,
        Message: "Enter Comment First",
      });

    if (!article)
      return res.status(400).json({
        Success: false,
        Message: "Article not found",
      });

    article.comments.push({
      user: new mongoose.Types.ObjectId(req.user?.id),
      text,
    });

    article.save();
    return res
      .status(200)
      .json({ Success: true, Message: "Comment added", Article: article });
  } catch (error) {
    return res
      .status(500)
      .json({ Success: false, Message: "Error adding comment", Error: error });
  }
};
