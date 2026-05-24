const express = require('express');
const foodController = require('../controllers/food.controller');    
const router = express.Router();
const { authFoodPartnerMiddleware } = require('../middlewares/auth.middlewares');
const multer = require('multer');
const authMiddleware = require('../middlewares/auth.middlewares');

const upload = multer({ 
    storage: multer.memoryStorage(),
 });

router.post('/', authFoodPartnerMiddleware, upload.single('image'), foodController.createFood);     

router.get('/',authMiddleware.authUserMiddleware, foodController.getFoodItems);

router.post('/like', authMiddleware.authUserMiddleware, foodController.likeFoodController);

router.post('/save', authMiddleware.authUserMiddleware, foodController.saveFood);

module.exports = router;