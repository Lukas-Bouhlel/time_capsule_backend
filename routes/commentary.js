const express = require('express');
const router = express();
const commentaryCtrl = require("../controllers/commentary.js");
const authMiddleware = require('../middlewares/auth');

router.post("/", authMiddleware, commentaryCtrl.createComment);
router.post("/:capsuleId", authMiddleware, commentaryCtrl.getCommentsByCapsule);

module.exports = router;