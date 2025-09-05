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
  origin: process.env.NODE_ENV === 'development' ? '*' : ['https://one23fakturera-frontend.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

fastify.register(pagesRoutes);
fastify.register(termsRoutes);
fastify.register(productsRoutes);
fastify.register(authRoutes);

fastify.head('/', async (request, reply) => {
  reply.status(200).send();
});

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log('Database connected');
    await fastify.listen({ port: process.env.PORT || 3001, host: '0.0.0.0' });
    console.log(`Server running on port ${process.env.PORT || 3001}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();