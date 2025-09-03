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

// Register middleware
fastify.decorate('authenticate', authMiddleware);

// Enable CORS
fastify.register(fastifyCors, {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// Register routes
fastify.register(pagesRoutes);
fastify.register(termsRoutes);
fastify.register(productsRoutes);
fastify.register(authRoutes);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Sync all models
    console.log('Database connected');
    await fastify.listen({ port: process.env.PORT || 3001 });
    console.log(`Server running on port ${process.env.PORT || 3001}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();