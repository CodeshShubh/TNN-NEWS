import express from 'express';
import { writeArticle } from '../controllers/article.controllers.js';
import { VerifyToken } from '../middlewares/authMiddleWare.js';
import { upload } from '../utils/uploadToCloudinary.js';


  const router = express.Router();


  router.post('/writeArticle',VerifyToken, upload.single("image"), writeArticle)




  export default router