const express = require('express');
const router = express.Router();

const sauceController = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, sauceController.createSauce);
router.post('/:id/like', auth, sauceController.likesOrDislikes);
router.put('/:id', auth, multer, sauceController.modifySauce);
router.delete('/:id', auth, sauceController.deleteSauce);
router.get('/', auth, sauceController.getAllSauce);
router.get('/:id', auth, sauceController.getOneSauce);


module.exports = router;