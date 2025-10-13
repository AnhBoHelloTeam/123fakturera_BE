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
        return reply.code(400).send({ error: 'Email already in use.' });
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
      });

      // Sửa link để loại bỏ dấu // thừa
      const verificationLink = `${process.env.BASE_URL}verify?token=${token}`;
      const mailOptions = {
        from: '"Nguyễn Thành Nhân" <' + process.env.EMAIL_USER + '>',
        to: email,
        subject: 'Välkommen till 123 Fakturera - Bekräfta din e-post',
        html: `
          <p>Hej.</p>
          <p>Kul att du har registrerat dig för att använda 123 Fakturera.</p>
          <p>Vänligen klicka trên knappen nedan för att bekräfta din e-post:</p>
          <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #07a31f; color: white; text-decoration: none; border-radius: 5px;">Bekräfta din epost</a>
          <p>Du kan också klicka trên liên kết này hoặc sao chép và dán vào trình duyệt của bạn:</p>
          <p><a href="${verificationLink}">${verificationLink}</a></p>
          <p>Igen, tack för att du registrerade dig och kontakta oss gärna om du behöver hjälp med något.</p>
          <p><img src="https://storage.123fakturera.se/public/icons/diamond.png" alt="LättFaktura" style="width: 50px;"></p>
          <p><strong>LättFaktura !</strong></p>
          <p>Box 2826, 187 28 Täby<br>Telefon: 08-555 00 500<br>Org. Nr: 556651-3734</p>
          <p style="font-size: 12px; color: #555;">
            The information contained in this communication is intended solely for the use of the individual or entity to whom it is addressed and others authorized to receive it. It may contain confidential or legally privileged information. If you are not the intended recipient you are hereby notified that any disclosure, copying, distribution or taking any action in reliance on the contents of this information is strictly prohibited and may be unlawful. If you have received this communication in error, please notify us immediately by responding to this email and then delete it from your system. LättFaktura is neither liable for the proper and complete transmission of the information contained in this communication nor for any delay in its receipt. We, LättFaktura Ltd are registered in Ireland, with company registration number 638537. Swedish forwarding contact details are only provided for ease of contact. Vid beställning från oss så kan fakturering och ev. också förmedling komma att ske från K-Soft Sverige AB, Box 2826, 187 28 Täby. Betalning görs då till det företag som fakturan kommer från. Kundförhållandet är dock självklart alltid med oss. För ordningens skull måste vi också skriva att om erbjudande om att köpa program från oss har getts i denna mail så gäller villkoren på Beställningsdelen av vår hemsida, och genom att respondera på denna mail med önskemål om att beställa vår programvara så är sändaren införstådd med att det säljs med villkoren på Beställningsdelen av vår hemsida.
          </p>
        `,
      };

      await transporter.sendMail(mailOptions);

      return reply.code(201).send({ message: 'Registration successful. Please check your email to verify your account.' });
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