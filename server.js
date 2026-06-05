require('dotenv').config();

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');

const app = express();

// ── Middlewares ───────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static('.'));
// express.static('.') sert tes fichiers HTML/CSS/JS
// directement depuis le même dossier

// ── Connexion MongoDB ─────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB connecté'))
  .catch(err => console.error(' Erreur MongoDB :', err.message));

// ── Schéma Admin ──────────────────────────────────────
// Un seul document en base : l'admin
const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});
const Admin = mongoose.model('Admin', adminSchema);

// ── Créer l'admin au démarrage si il n'existe pas ─────
const initAdmin = async () => {
  const existing = await Admin.findOne();
  if (!existing) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await Admin.create({ password: hashed });
    console.log('Admin créé en base');
  }
};
initAdmin();

// ══════════════════════════════════════════════════════
// LA FONCTION BACKEND — POST /api/login
// ══════════════════════════════════════════════════════
// C'est la seule route protégée du projet.
// Le front envoie le mot de passe → le back vérifie
// → renvoie un token JWT si c'est correct.

app.post('/api/login', async (req, res) => {
  try {
    const { password } = req.body;

    // 1. Vérifier que le mot de passe a été envoyé
    if (!password) {
      return res.status(400).json({ message: 'Mot de passe requis' });
    }

    // 2. Chercher l'admin en base
    const admin = await Admin.findOne();
    if (!admin) {
      return res.status(500).json({ message: 'Admin non configuré' });
    }

    // 3. Comparer le mot de passe avec le hash en base
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // 4. Générer un token JWT valable 24h
    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '48h' }
    );

    // 5. Renvoyer le token au front
    res.json({ success: true, token });

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ── Démarrage du serveur ──────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Serveur lancé → http://localhost:${PORT}`);
});