import Customer from '../models/customer.js';

export default async function routes(fastify) {
  // Generate unique customer number
  const generateCustomerNumber = async (userId) => {
    const lastCustomer = await Customer.findOne({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
    
    let nextNumber = 1;
    if (lastCustomer && lastCustomer.customerNumber) {
      const lastNumber = parseInt(lastCustomer.customerNumber.replace('K', ''));
      nextNumber = lastNumber + 1;
    }
    
    return `K${nextNumber.toString().padStart(4, '0')}`;
  };

  // Get all customers for user
  fastify.get('/api/customers', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { page = 1, limit = 20, search, isActive } = request.query;
      const offset = (page - 1) * limit;
      
      const whereClause = { userId: request.user.userId };
      if (isActive !== undefined) whereClause.isActive = isActive === 'true';
      
      if (search) {
        whereClause[fastify.sequelize.Sequelize.Op.or] = [
          { companyName: { [fastify.sequelize.Sequelize.Op.iLike]: `%${search}%` } },
          { contactPerson: { [fastify.sequelize.Sequelize.Op.iLike]: `%${search}%` } },
          { email: { [fastify.sequelize.Sequelize.Op.iLike]: `%${search}%` } },
          { customerNumber: { [fastify.sequelize.Sequelize.Op.iLike]: `%${search}%` } },
        ];
      }
      
      const customers = await Customer.findAndCountAll({
        where: whereClause,
        order: [['companyName', 'ASC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });
      
      return reply.code(200).send({
        customers: customers.rows,
        total: customers.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(customers.count / limit),
      });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });

  // Get single customer
  fastify.get('/api/customers/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params;
      
      const customer = await Customer.findOne({
        where: { id, userId: request.user.userId },
      });
      
      if (!customer) {
        return reply.code(404).send({ error: 'Customer not found.' });
      }
      
      return reply.code(200).send(customer);
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });

  // Create new customer
  fastify.post('/api/customers', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const {
        companyName,
        contactPerson,
        email,
        phone,
        address,
        address2,
        postNumber,
        city,
        country = 'Sweden',
        orgNumber,
        vatNumber,
        paymentTerms = '30 days',
        currency = 'SEK',
        notes,
      } = request.body;
      
      if (!companyName && !contactPerson) {
        return reply.code(400).send({ error: 'Company name or contact person is required.' });
      }
      
      // Generate customer number
      const customerNumber = await generateCustomerNumber(request.user.userId);
      
      const customer = await Customer.create({
        userId: request.user.userId,
        customerNumber,
        companyName,
        contactPerson,
        email,
        phone,
        address,
        address2,
        postNumber,
        city,
        country,
        orgNumber,
        vatNumber,
        paymentTerms,
        currency,
        notes,
        isActive: true,
      });
      
      return reply.code(201).send(customer);
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });

  // Update customer
  fastify.put('/api/customers/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params;
      const updateData = request.body;
      
      const customer = await Customer.findOne({
        where: { id, userId: request.user.userId },
      });
      
      if (!customer) {
        return reply.code(404).send({ error: 'Customer not found.' });
      }
      
      await customer.update(updateData);
      
      return reply.code(200).send(customer);
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });

  // Delete customer
  fastify.delete('/api/customers/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params;
      
      const customer = await Customer.findOne({
        where: { id, userId: request.user.userId },
      });
      
      if (!customer) {
        return reply.code(404).send({ error: 'Customer not found.' });
      }
      
      await customer.destroy();
      
      return reply.code(200).send({ message: 'Customer deleted successfully.' });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });

  // Toggle customer active status
  fastify.patch('/api/customers/:id/toggle-status', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params;
      
      const customer = await Customer.findOne({
        where: { id, userId: request.user.userId },
      });
      
      if (!customer) {
        return reply.code(404).send({ error: 'Customer not found.' });
      }
      
      await customer.update({ isActive: !customer.isActive });
      
      return reply.code(200).send({
        message: `Customer ${customer.isActive ? 'activated' : 'deactivated'} successfully.`,
        isActive: customer.isActive,
      });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });

  // Get customer statistics
  fastify.get('/api/customers/stats', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const totalCustomers = await Customer.count({
        where: { userId: request.user.userId },
      });
      
      const activeCustomers = await Customer.count({
        where: { userId: request.user.userId, isActive: true },
      });
      
      const inactiveCustomers = totalCustomers - activeCustomers;
      
      return reply.code(200).send({
        totalCustomers,
        activeCustomers,
        inactiveCustomers,
      });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });
}
