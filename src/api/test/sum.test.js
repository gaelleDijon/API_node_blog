const request = require('supertest');
const app = require('../../app'); // Votre application Express
const User = require('../models/userModel');
const mongoose = require('mongoose');

describe('Tests pour le contrôleur userController', () => {
  let savedUser;

  beforeAll(async () => {
    // Établir une connexion avec la base de données de test
    await mongoose.connect('mongodb://mongo/apinode', { useNewUrlParser: true });

    // Créer un utilisateur pour les tests
    savedUser = await User.create({
      email: 'test@test.com',
      password: 'password'
    });
  });

  afterAll(async () => {
    // Supprimer les données de test et fermer la connexion
    await User.deleteMany();
    await mongoose.connection.close();
  });

  describe('POST /user/register', () => {
    it('devrait créer un nouvel utilisateur', async () => {
      const res = await request(app)
        .post('/user/register')
        .send({
          email: 'newuser@test.com',
          password: 'password'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message', 'user created : newuser@test.com');
    });

    it('devrait renvoyer une erreur 401 si l\'email est manquant', async () => {
      const res = await request(app)
        .post('/user/register')
        .send({ email: 'test@test.com', password: 'password' });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });

    it('devrait renvoyer une erreur 401 si le mot de passe est manquant', async () => {
      const res = await request(app)
        .post('/user/register')
        .send({ email: 'test@test.com' });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /user/login', () => {
    it('devrait renvoyer un token JWT valide pour un utilisateur existant', async () => {
      const res = await request(app)
        .post('/user/login')
        .send({
          email: 'test@test.com',
          password: 'password'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'login success');
      expect(res.body).toHaveProperty('token');

      const decodedToken = jwt.verify(res.body.token, process.env.JWT_TOKEN);
      expect(decodedToken).toHaveProperty('id', savedUser.id);
      expect(decodedToken).toHaveProperty('email', savedUser.email);
      expect(decodedToken).toHaveProperty('role', 'admin');
    });

    it('devrait renvoyer une erreur 401 si l\'utilisateur n\'existe pas', async () => {
      const res = await request(app)
        .post('/user/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'Erreur d\'authentification');
    });

    it('devrait renvoyer une erreur 401 si le mot de passe est incorrect', async () => {
      const res = await request(app)
        .post('/user/login')
        .send({
          email: 'test@test.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'Erreur d\'authentification');
    });
  });
});
