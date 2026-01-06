const express = require('express');
const auth = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/checkPermission');
const CategoryController = require('../controllers/category.controller');

const router = express.Router();

router.post('/create-category', auth, checkPermission(['cetegory:create']), CategoryController.createCategory)

module.exports = router;