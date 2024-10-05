const router = require('express').Router();
const profileController = require('../controllers/profile');
const isAuth = require("../middlewares/isAuth");

router.get('/:id',isAuth , profileController.getProfile);
router.post('/create/:id' , isAuth ,profileController.createProfile)
router.put('/update/:id', isAuth ,profileController.updateProfile);
module.exports = router;