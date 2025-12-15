const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/db');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/capsules', require('./routes/capsuleRoutes'));

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  
  await sequelize.sync({ alter: true }); 
  console.log('🔄 Tables SQL synchronisées');

  app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur le port ${PORT}`);
    console.log(`📡 Accessible via ${process.env.HOST_URL || 'http://localhost:3000'}`);
  });
};

startServer();