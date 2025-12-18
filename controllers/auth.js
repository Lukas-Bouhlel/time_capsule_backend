const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

/**
 * @module UserController
 */

/**
 * Inscrit un nouvel utilisateur et envoie un e-mail de confirmation.
 *
 * @function signup
 * @async
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @throws {Error} En cas d'erreur lors de la création de l'utilisateur ou de l'envoi de l'e-mail.
 *
 * @example
 * // Exemple de requête
 * POST /api/auth/signup
 * {
 *   "username": "nouvel_utilisateur",
 *   "email": "utilisateur@example.com",
 *   "password": "MotDePasse123!",
 *   "avatarData": {
 *     "circleColor": "#ff0000",
 *     "pathColor": "#00ff00",
 *     "uniqueAvatarName": "avatar.svg"
 *   }
 * }
 */
exports.signup = async (req, res) => {
    try {
        // Créer l'utilisateur avec l'avatar (soit celui téléchargé, soit la copie du défaut)
        const user = await User.create({
            ...req.body
        });

        res.status(201).json(user);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(err => err.message);
            return res.status(400).json({ message: messages });
        }

        res.status(500).json({
            message: error.message || 'Could not create user'
        });
    }
}

/**
 * Authentifie un utilisateur et renvoie un token JWT.
 *
 * @function login
 * @async
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @throws {Error} En cas d'erreur d'authentification.
 *
 * @example
 * // Exemple de requête
 * POST /api/auth/login
 * {
 *   "identifier": "utilisateur@example.com",
 *   "password": "MotDePasse123!"
 * }
 */
exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        // Vérifiez que le champ 'identifier' et le mot de passe sont fournis
        if (!identifier) {
            return res.status(400).json({ message: "Votre identifiant est requis." });
        }

        if (!password) {
            return res.status(400).json({ message: "Votre mot de passe est requis." });
        }

        // Chercher l'utilisateur par email ou nom d'utilisateur
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: identifier },
                    { username: identifier }
                ]
            }
        });

        if (!user) {
            return res.status(404).json({ message: "Votre identifiant ou votre mot de passe est incorrect" });
        }

        // Comparer le mot de passe
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Votre identifiant ou votre mot de passe est incorrect" });
        }

        // Générer le token JWT
        const token = jwt.sign(
            { userId: user.id, userRole: user.roles }, 
            process.env.JWT_SECRET, 
            { expiresIn: '10h' }
        );

        res.cookie('token', token, {
            httpOnly: true,  // Empêche l'accès au cookie via JS
            secure: process.env.NODE_ENV === 'production',  // Seulement en HTTPS en production
            sameSite: 'Strict',  // Empêche l'envoi du cookie pour les requêtes cross-site
            maxAge: 10 * 60 * 60 * 1000,  // Expire dans 10 heures
        });

        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({
            message: error.message || 'An error occurred during login'
        });
    }
}

/**
 * Déconnecte l'utilisateur en invalidant le cookie JWT.
 *
 * @function logout
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @throws {Error} En cas d'erreur lors de la déconnexion.
 *
 * @example
 * // Exemple de requête
 * POST /api/auth/logout
 */
exports.logout = (req, res) => {
    try {
        // Invalider le cookie contenant le token JWT
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        res.status(200).json({ message: "Successfully logged out" });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Logout failed' });
    }
};