require('dotenv').config();

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');

const app = express();


app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static('.'));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB connecté'))
  .catch(err => console.error(' Erreur MongoDB :', err.message));


const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});
const Admin = mongoose.model('Admin', adminSchema);

const initAdmin = async () => {
  const existing = await Admin.findOne();
  if (!existing) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await Admin.create({ password: hashed });
    console.log('Admin créé en base');
  }
};
initAdmin();



app.post('/api/login', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Mot de passe requis' });
    }
    const admin = await Admin.findOne();
    if (!admin) {
      return res.status(500).json({ message: 'Admin non configuré' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }
    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '48h' }
    );
    res.json({ success: true, token });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Serveur lancé → http://localhost:${PORT}`);
});