import express from 'express';
import { getAllArticles, writeArticle } from '../controllers/article.controllers.js';
import { VerifyToken } from '../middlewares/authMiddleWare.js';
import { upload } from '../utils/multer.dataURI.js';
import { adminVerify } from '../middlewares/adminMiddleWare.js';


  const router = express.Router();


  router.post('/admin/writeArticle', VerifyToken, adminVerify,  upload.single("image"),  writeArticle)


  router.get('/getAll', getAllArticles)




  export default router