import express from 'express';
import { articleById, getAllArticles, getFilteredArticles, likeArticle, writeArticle } from '../controllers/article.controllers.js';
import { VerifyToken } from '../middlewares/authMiddleWare.js';
import { upload } from '../utils/multer.dataURI.js';
import { adminVerify } from '../middlewares/adminMiddleWare.js';


  const router = express.Router();


  router.post('/admin/writeArticle', VerifyToken, adminVerify,  upload.single("image"),  writeArticle)


  // get articles
  router.get('/getAll', getAllArticles)
  .get('/articleById/:id', articleById)
  .get('/filter', getFilteredArticles)


  // like aticle
  router.put('/likeArticle/:articleId', VerifyToken, likeArticle)





  export default router