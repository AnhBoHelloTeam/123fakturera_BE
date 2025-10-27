import Invoice from '../models/invoice.js';
import InvoiceItem from '../models/invoiceItem.js';
import Customer from '../models/customer.js';
import Product from '../models/product.js';

export default async function routes(fastify) {
  // Generate unique invoice number
  const generateInvoiceNumber = async (userId) => {
    const year = new Date().getFullYear();
    const prefix = `F${year}`;
    
    const lastInvoice = await Invoice.findOne({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
    
    let nextNumber = 1;
    if (lastInvoice && lastInvoice.invoiceNumber.startsWith(prefix)) {
      const lastNumber = parseInt(lastInvoice.invoiceNumber.replace(prefix, ''));
      nextNumber = lastNumber + 1;
    }
    
    return `${prefix}${nextNumber.toString().padStart(4, '0')}`;
  };

  // Get all invoices for user
  fastify.get('/api/invoices', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { page = 1, limit = 20, status, customerId } = request.query;
      const offset = (page - 1) * limit;
      
      const whereClause = { userId: request.user.userId };
      if (status) whereClause.status = status;
      if (customerId) whereClause.customerId = customerId;
      
      const invoices = await Invoice.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Customer,
            as: 'customer',
            attributes: ['id', 'companyName', 'contactPerson', 'email'],
          },
          {
            model: InvoiceItem,
            as: 'items',
            attributes: ['id', 'description', 'quantity', 'unitPrice', 'total'],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });
      
      return reply.code(200).send({
        invoices: invoices.rows,
        total: invoices.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(invoices.count / limit),
      });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });

  // Get single invoice
  fastify.get('/api/invoices/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params;
      
      const invoice = await Invoice.findOne({
        where: { id, userId: request.user.userId },
        include: [
          {
            model: Customer,
            as: 'customer',
          },
          {
            model: InvoiceItem,
            as: 'items',
            order: [['sortOrder', 'ASC']],
          },
        ],
      });
      
      if (!invoice) {
        return reply.code(404).send({ error: 'Invoice not found.' });
      }
      
      return reply.code(200).send(invoice);
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });

  // Create new invoice
  fastify.post('/api/invoices', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const transaction = await fastify.sequelize.transaction();
    
    try {
      const {
        customerId,
        invoiceDate,
        dueDate,
        items,
        notes,
        paymentTerms,
        currency = 'SEK',
        taxRate = 25.00,
      } = request.body;
      
      if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
        await transaction.rollback();
        return reply.code(400).send({ error: 'Customer ID and items are required.' });
      }
      
      // Generate invoice number
      const invoiceNumber = await generateInvoiceNumber(request.user.userId);
      
      // Calculate totals
      let subtotal = 0;
      const processedItems = items.map((item, index) => {
        const itemTotal = parseFloat(item.quantity) * parseFloat(item.unitPrice);
        subtotal += itemTotal;
        
        return {
          description: item.description,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          total: itemTotal,
          taxRate: parseFloat(taxRate),
          taxAmount: itemTotal * (parseFloat(taxRate) / 100),
          sortOrder: index,
          productId: item.productId || null,
        };
      });
      
      const taxAmount = subtotal * (parseFloat(taxRate) / 100);
      const total = subtotal + taxAmount;
      
      // Create invoice
      const invoice = await Invoice.create({
        userId: request.user.userId,
        customerId,
        invoiceNumber,
        invoiceDate: invoiceDate || new Date(),
        dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'draft',
        subtotal,
        taxRate: parseFloat(taxRate),
        taxAmount,
        total,
        currency,
        notes,
        paymentTerms,
      }, { transaction });
      
      // Create invoice items
      const invoiceItems = await InvoiceItem.bulkCreate(
        processedItems.map(item => ({
          ...item,
          invoiceId: invoice.id,
        })),
        { transaction }
      );
      
      await transaction.commit();
      
      // Return invoice with items
      const createdInvoice = await Invoice.findByPk(invoice.id, {
        include: [
          { model: Customer, as: 'customer' },
          { model: InvoiceItem, as: 'items' },
        ],
      });
      
      return reply.code(201).send(createdInvoice);
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });

  // Update invoice
  fastify.put('/api/invoices/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const transaction = await fastify.sequelize.transaction();
    
    try {
      const { id } = request.params;
      const {
        customerId,
        invoiceDate,
        dueDate,
        items,
        notes,
        paymentTerms,
        status,
        currency = 'SEK',
        taxRate = 25.00,
      } = request.body;
      
      const invoice = await Invoice.findOne({
        where: { id, userId: request.user.userId },
        transaction,
      });
      
      if (!invoice) {
        await transaction.rollback();
        return reply.code(404).send({ error: 'Invoice not found.' });
      }
      
      // Update invoice fields
      const updateData = {};
      if (customerId) updateData.customerId = customerId;
      if (invoiceDate) updateData.invoiceDate = invoiceDate;
      if (dueDate) updateData.dueDate = dueDate;
      if (notes !== undefined) updateData.notes = notes;
      if (paymentTerms) updateData.paymentTerms = paymentTerms;
      if (status) updateData.status = status;
      if (currency) updateData.currency = currency;
      if (taxRate) updateData.taxRate = taxRate;
      
      // Recalculate totals if items are provided
      if (items && Array.isArray(items)) {
        let subtotal = 0;
        const processedItems = items.map((item, index) => {
          const itemTotal = parseFloat(item.quantity) * parseFloat(item.unitPrice);
          subtotal += itemTotal;
          
          return {
            description: item.description,
            quantity: parseFloat(item.quantity),
            unitPrice: parseFloat(item.unitPrice),
            total: itemTotal,
            taxRate: parseFloat(taxRate),
            taxAmount: itemTotal * (parseFloat(taxRate) / 100),
            sortOrder: index,
            productId: item.productId || null,
          };
        });
        
        const taxAmount = subtotal * (parseFloat(taxRate) / 100);
        const total = subtotal + taxAmount;
        
        updateData.subtotal = subtotal;
        updateData.taxAmount = taxAmount;
        updateData.total = total;
        
        // Delete existing items and create new ones
        await InvoiceItem.destroy({
          where: { invoiceId: id },
          transaction,
        });
        
        await InvoiceItem.bulkCreate(
          processedItems.map(item => ({
            ...item,
            invoiceId: id,
          })),
          { transaction }
        );
      }
      
      await invoice.update(updateData, { transaction });
      await transaction.commit();
      
      // Return updated invoice
      const updatedInvoice = await Invoice.findByPk(id, {
        include: [
          { model: Customer, as: 'customer' },
          { model: InvoiceItem, as: 'items' },
        ],
      });
      
      return reply.code(200).send(updatedInvoice);
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });

  // Delete invoice
  fastify.delete('/api/invoices/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const transaction = await fastify.sequelize.transaction();
    
    try {
      const { id } = request.params;
      
      const invoice = await Invoice.findOne({
        where: { id, userId: request.user.userId },
        transaction,
      });
      
      if (!invoice) {
        await transaction.rollback();
        return reply.code(404).send({ error: 'Invoice not found.' });
      }
      
      // Delete invoice items first
      await InvoiceItem.destroy({
        where: { invoiceId: id },
        transaction,
      });
      
      // Delete invoice
      await invoice.destroy({ transaction });
      
      await transaction.commit();
      
      return reply.code(200).send({ message: 'Invoice deleted successfully.' });
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });

  // Send invoice (mark as sent)
  fastify.post('/api/invoices/:id/send', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params;
      
      const invoice = await Invoice.findOne({
        where: { id, userId: request.user.userId },
      });
      
      if (!invoice) {
        return reply.code(404).send({ error: 'Invoice not found.' });
      }
      
      await invoice.update({
        status: 'sent',
        sentDate: new Date(),
      });
      
      return reply.code(200).send({ message: 'Invoice sent successfully.' });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });

  // Mark invoice as paid
  fastify.post('/api/invoices/:id/paid', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { id } = request.params;
      
      const invoice = await Invoice.findOne({
        where: { id, userId: request.user.userId },
      });
      
      if (!invoice) {
        return reply.code(404).send({ error: 'Invoice not found.' });
      }
      
      await invoice.update({
        status: 'paid',
        paidDate: new Date(),
      });
      
      return reply.code(200).send({ message: 'Invoice marked as paid.' });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });

  // Get invoice statistics
  fastify.get('/api/invoices/stats', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { period = 'month' } = request.query;
      
      let dateFilter;
      const now = new Date();
      
      switch (period) {
        case 'week':
          dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          dateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          dateFilter = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          dateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
      }
      
      const stats = await Invoice.findAll({
        where: {
          userId: request.user.userId,
          createdAt: { [fastify.sequelize.Sequelize.Op.gte]: dateFilter },
        },
        attributes: [
          'status',
          [fastify.sequelize.Sequelize.fn('COUNT', fastify.sequelize.Sequelize.col('id')), 'count'],
          [fastify.sequelize.Sequelize.fn('SUM', fastify.sequelize.Sequelize.col('total')), 'total'],
        ],
        group: ['status'],
        raw: true,
      });
      
      const totalInvoices = await Invoice.count({
        where: {
          userId: request.user.userId,
          createdAt: { [fastify.sequelize.Sequelize.Op.gte]: dateFilter },
        },
      });
      
      const totalAmount = await Invoice.sum('total', {
        where: {
          userId: request.user.userId,
          createdAt: { [fastify.sequelize.Sequelize.Op.gte]: dateFilter },
        },
      });
      
      return reply.code(200).send({
        period,
        totalInvoices,
        totalAmount: totalAmount || 0,
        byStatus: stats,
      });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: 'Internal server error.' });
    }
  });
}
