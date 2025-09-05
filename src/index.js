import Fastify from 'fastify';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import termsRoutes from './routes/terms.js';
import productsRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';
import pagesRoutes from './routes/pages.js';
import fastifyCors from '@fastify/cors';
import authMiddleware from './middleware/authMiddleware.js';

dotenv.config();

const fastify = Fastify({ logger: true });

fastify.decorate('authenticate', authMiddleware);

fastify.register(fastifyCors, {
  origin: ['http://localhost:3000', 'https://one23fakturera-frontend.vercel.app'], // Cập nhật origin cho frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

fastify.register(pagesRoutes);
fastify.register(termsRoutes);
fastify.register(productsRoutes);
fastify.register(authRoutes);

// Thêm route mặc định cho HEAD request
fastify.head('/', async (request, reply) => {
  reply.status(200).send();
});

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Database connected');
    await fastify.listen({ port: process.env.PORT || 3001, host: '0.0.0.0' });
    console.log(`Server running on port ${process.env.PORT || 3001}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();