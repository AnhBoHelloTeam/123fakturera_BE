import Product from '../models/product.js';

export default async function routes(fastify) {
  // Lấy danh sách sản phẩm của user hiện tại
  fastify.get('/api/products', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const products = await Product.findAll({
        where: { userId: request.user.userId },
      });
      return reply.code(200).send(products);
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });

  // Tạo sản phẩm mới
  fastify.post('/api/products', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { article_no, name, in_price, price, unit, in_stock, description } = request.body;
    if (!article_no || !name || !price) {
      return reply.code(400).send({ error: 'Article number, name, and price are required.' });
    }
    try {
      const existingProduct = await Product.findOne({ where: { article_no } });
      if (existingProduct) {
        return reply.code(400).send({ error: 'Article number already exists.' });
      }
      const product = await Product.create({
        userId: request.user.userId,
        article_no,
        name,
        in_price: in_price ? parseFloat(in_price) : null,
        price: parseFloat(price),
        unit,
        in_stock: in_stock ? parseInt(in_stock) : null,
        description,
      });
      return reply.code(201).send(product);
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });

  // Cập nhật sản phẩm
  fastify.put('/api/products/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params;
    const { article_no, name, in_price, price, unit, in_stock, description } = request.body;
    if (!article_no || !name || !price) {
      return reply.code(400).send({ error: 'Article number, name, and price are required.' });
    }
    try {
      const product = await Product.findOne({
        where: { id, userId: request.user.userId },
      });
      if (!product) {
        return reply.code(404).send({ error: 'Product not found or you do not have permission.' });
      }
      if (article_no !== product.article_no) {
        const existingProduct = await Product.findOne({ where: { article_no } });
        if (existingProduct) {
          return reply.code(400).send({ error: 'Article number already exists.' });
        }
      }
      await product.update({
        article_no,
        name,
        in_price: in_price ? parseFloat(in_price) : null,
        price: parseFloat(price),
        unit,
        in_stock: in_stock ? parseInt(in_stock) : null,
        description,
      });
      return reply.code(200).send(product);
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });

  // Xóa sản phẩm
  fastify.delete('/api/products/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.params;
    try {
      const product = await Product.findOne({
        where: { id, userId: request.user.userId },
      });
      if (!product) {
        return reply.code(404).send({ error: 'Product not found or you do not have permission.' });
      }
      await product.destroy();
      return reply.code(200).send({ message: 'Product deleted successfully.' });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });
}