import jwt from 'jsonwebtoken';

export default async function authenticate(request, reply) {
  const authHeader = request.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    fastify.log.warn('No token or invalid format provided');
    return reply.code(401).send({ error: 'Unauthorized: No token provided.' });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = decoded;
  } catch (error) {
    fastify.log.error('Invalid token:', error.message);
    return reply.code(401).send({ error: 'Unauthorized: Invalid token.' });
  }
}