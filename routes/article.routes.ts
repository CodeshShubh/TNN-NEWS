import express from 'express';
import { addComment, addViews, articleById, deleteArticle, deleteComment, getAdminStats, getAllArticles, getFilteredArticles, likeArticle, writeArticle } from '../controllers/article.controllers.js';
import { VerifyToken } from '../middlewares/authMiddleWare.js';
import { upload } from '../utils/multer.dataURI.js';
import { adminVerify } from '../middlewares/adminMiddleWare.js';


  const router = express.Router();

// write Article
  router.post('/admin/writeArticle', VerifyToken, adminVerify,  upload.single("image"),  writeArticle)


  // get AllArticle // get article by Id// filterSearchArticles
  router.get('/getAll', getAllArticles)
  .get('/articleById/:id', articleById)
  .get('/filter', getFilteredArticles)
  .get('/stats', VerifyToken, adminVerify, getAdminStats)
  


  // like aticle // addComment // addviews
  router.put('/likeArticle/:articleId', VerifyToken, likeArticle)
  .put('/addComments/:articleId', VerifyToken, addComment)
  .put('/addViews/:articleId', addViews)


  //delete Comment // deleteArticle

  router.delete('/deleteComment/:articleId/:commentId', deleteComment)
  .delete('/deleteArticle/:articleId', deleteArticle)



  export default router