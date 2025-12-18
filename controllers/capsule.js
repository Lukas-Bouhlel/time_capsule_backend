const { Capsule, User } = require('../models');

exports.getCapsules = async (req, res) => {
  try {
    const capsules = await Capsule.findAll({
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['username']
      }]
    });

    const formattedCapsules = capsules.map(capsule => ({
      id: capsule.id.toString(),
      title: capsule.title,
      description: capsule.description,
      imageUrl: `${process.env.HOST_URL}/${capsule.imagePath}`,
      latitude: capsule.latitude,
      longitude: capsule.longitude,
      author: capsule.user ? capsule.user.username : 'Inconnu'
    }));

    res.json(formattedCapsules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.createCapsule = async (req, res) => {
  try {
    const { title, description, latitude, longitude } = req.body;
    const userId = req.auth.userId;

    if (!req.file) {
      return res.status(400).json({ message: 'Une image est obligatoire' });
    }

    const newCapsule = await Capsule.create({
      title,
      description,
      imagePath: req.file.path.replace(/\\/g, "/"),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      userId: userId
    });

    const capsuleWithAuthor = await Capsule.findByPk(newCapsule.id, {
        include: [{ model: User, as: 'user', attributes: ['username'] }]
    });

    res.status(201).json(capsuleWithAuthor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la création' });
  }
};