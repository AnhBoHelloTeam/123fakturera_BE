import Product from '../models/product.js';

     export default async function routes(fastify) {
       fastify.get('/api/products', async (request, reply) => {
         try {
           const products = await Product.findAll();
           return reply.code(200).send(products);
         } catch (error) {
           return reply.code(500).send({ error: 'Internal server error.' });
         }
       });

       fastify.put('/api/products/:id', async (request, reply) => {
         const { id } = request.params;
         const { name, in_price, price, unit, vat_rate, quantity } = request.body;
         try {
           const product = await Product.findByPk(id);
           if (!product) {
             return reply.code(404).send({ error: 'Product not found.' });
           }
           await product.update({ name, in_price, price, unit, vat_rate, quantity });
           return reply.code(200).send(product);
         } catch (error) {
           return reply.code(500).send({ error: 'Internal server error.' });
         }
       });
     }