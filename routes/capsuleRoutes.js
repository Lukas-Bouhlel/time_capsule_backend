const express = require('express');
const router = express.Router();
const multer = require('multer');
const capsuleController = require('../controllers/capsuleController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

const upload = multer({ storage: storage }); 
console.log('Test Controller:', capsuleController); 

router.get('/', capsuleController.getCapsules);
router.post('/', upload.single('image'), capsuleController.createCapsule);

module.exports = router;