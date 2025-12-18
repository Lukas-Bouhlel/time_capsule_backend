const { Commentary, User } = require('../models');

exports.createComment = async (req, res) => {
    try {
        const { content, capsuleId } = req.body;
        const userId = req.auth.userId;

        if (!content) {
            return res.status(400).json({ message: "Le contenu du commentaire est vide." });
        }

        const comment = await Commentary.create({
            content,
            capsuleId,
            userId
        });

        const commentWithUser = await Commentary.findByPk(comment.id, {
            include: [{ model: User, as: 'user', attributes: ['username'] }]
        });

        res.status(201).json(commentWithUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCommentsByCapsule = async (req, res) => {
    try {
        const { capsuleId } = req.params;

        const comments = await Commentary.findAll({
            where: { capsuleId },
            include: [{ 
                model: User, 
                as: 'user', 
                attributes: ['username']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};