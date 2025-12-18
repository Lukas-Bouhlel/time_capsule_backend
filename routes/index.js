const express = require('express')
const router = express();
const authRoutes = require('./auth.js');
const capsuleRoutes = require('./capsule.js')
const commentaryRoutes = require('./commentary.js')

/**
 * Les différentes routes de l'application sont définies ici et reliées à leur fichier respectif.
 * 
 * @module routes
 */
router.use("/auth", authRoutes);
router.use("/capsules", capsuleRoutes);
router.use("/comments", commentaryRoutes);

module.exports = router