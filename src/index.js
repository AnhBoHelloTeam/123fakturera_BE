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
  origin: ['http://localhost:3000', 'https://one23fakturera-fe.onrender.com'],
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
    // Try to connect to database
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    // Sync database schema
    await sequelize.sync({ alter: true });
    console.log('Database schema synchronized');
    
    // Start server
    await fastify.listen({ port: process.env.PORT || 3001, host: '0.0.0.0' });
    console.log(`Server running on port ${process.env.PORT || 3001}`);
  } catch (err) {
    console.error('Database connection error:', err.message);
    console.error('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    
    // If database connection fails, still start server but log the error
    if (err.message.includes('Tenant or user not found') || err.message.includes('ConnectionError')) {
      console.log('Starting server without database connection...');
      try {
        await fastify.listen({ port: process.env.PORT || 3001, host: '0.0.0.0' });
        console.log(`Server running on port ${process.env.PORT || 3001} (without database)`);
      } catch (serverErr) {
        console.error('Server start error:', serverErr);
        process.exit(1);
      }
    } else {
      fastify.log.error(err);
      process.exit(1);
    }
  }
};

start();