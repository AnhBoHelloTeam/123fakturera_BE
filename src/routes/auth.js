import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

export default async function routes(fastify) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Register endpoint
  fastify.post('/api/register', async (request, reply) => {
    const { companyName, contactPerson, address, postNumber, city, mobile, email, password } = request.body;

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        if (existingUser.isVerified) {
          return reply.code(400).send({ error: 'Email already in use.' });
        } else {
          // User exists but not verified, allow re-registration
          await existingUser.destroy();
        }
      }

      const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const verificationToken = uuidv4();
      const token = jwt.sign(
        { email, companyName, address, postNumber, city, mobile, token_type: 'signup' },
        process.env.JWT_SECRET,
        { expiresIn: '48h', jwtid: uuidv4() }
      );

      const user = await User.create({
        companyName,
        contactPerson,
        address,
        postNumber,
        city,
        mobile,
        email,
        password: hashedPassword,
        verificationToken,
        isVerified: true, // Auto-verify all users
      });

      return reply.code(201).send({ message: 'Registration successful. You can now login.' });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });

  // Login endpoint
  fastify.post('/api/login', async (request, reply) => {
    const { email, password } = request.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return reply.code(401).send({ error: 'Invalid email or password.' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return reply.code(401).send({ error: 'Invalid email or password.' });
      }

      if (!user.isVerified) {
        return reply.code(403).send({ error: 'Please verify your email before logging in.' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h', jwtid: uuidv4() }
      );

      return reply.code(200).send({ token, redirect: '/price-list' });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });

  // Verify endpoint
  fastify.get('/api/verify', async (request, reply) => {
    const { token } = request.query;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.token_type !== 'signup') {
        return reply.code(400).send({ error: 'Invalid token type.' });
      }

      const user = await User.findOne({ where: { email: decoded.email } });
      if (!user) {
        return reply.code(404).send({ error: 'User not found.' });
      }

      await user.update({ isVerified: true, verificationToken: null });
      const sessionToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h', jwtid: uuidv4() }
      );

      return reply.code(200).send({ token: sessionToken, redirect: '/price-list' });
    } catch (error) {
      console.error(error);
      return reply.code(400).send({ error: 'Invalid or expired token.' });
    }
  });

  // Get user business details
  fastify.get('/api/mybusiness', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const user = await User.findByPk(request.user.userId);
      if (!user) {
        return reply.code(404).send({ error: 'User not found.' });
      }

      return reply.code(200).send({
        companyName: user.companyName,
        contactPerson: user.contactPerson,
        address: user.address,
        address2: user.address2,
        postNumber: user.postNumber,
        city: user.city,
        mobile: user.mobile,
        email: user.email,
        accountNumber: user.accountNumber,
        orgNumber: user.orgNumber,
        homepage: user.homepage,
      });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });

  // Update user business details
  fastify.put('/api/mybusiness', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const user = await User.findByPk(request.user.userId);
      if (!user) {
        return reply.code(404).send({ error: 'User not found.' });
      }

      const { companyName, contactPerson, address, address2, postNumber, city, mobile, email, accountNumber, orgNumber, homepage } = request.body;

      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return reply.code(400).send({ error: 'Email already in use.' });
        }
      }

      await user.update({
        companyName: companyName || user.companyName,
        contactPerson: contactPerson || user.contactPerson,
        address: address || user.address,
        address2: address2 !== undefined ? address2 : user.address2,
        postNumber: postNumber || user.postNumber,
        city: city || user.city,
        mobile: mobile || user.mobile,
        email: email || user.email,
        accountNumber: accountNumber !== undefined ? accountNumber : user.accountNumber,
        orgNumber: orgNumber !== undefined ? orgNumber : user.orgNumber,
        homepage: homepage !== undefined ? homepage : user.homepage,
      });

      return reply.code(200).send({
        companyName: user.companyName,
        contactPerson: user.contactPerson,
        address: user.address,
        address2: user.address2,
        postNumber: user.postNumber,
        city: user.city,
        mobile: user.mobile,
        email: user.email,
        accountNumber: user.accountNumber,
        orgNumber: user.orgNumber,
        homepage: user.homepage,
      });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });

  // Delete user account
  fastify.delete('/api/mybusiness', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const user = await User.findByPk(request.user.userId);
      if (!user) {
        return reply.code(404).send({ error: 'User not found.' });
      }

      await user.destroy();
      return reply.code(200).send({ message: 'User account deleted successfully.' });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });
}