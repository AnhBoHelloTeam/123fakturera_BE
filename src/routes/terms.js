import Term from '../models/term.js';

  export default async function routes(fastify) {
    fastify.get('/api/terms', async (request, reply) => {
      const { language } = request.query;
      if (!['en', 'sv'].includes(language)) {
        return reply.code(400).send({ error: 'Invalid language. Use "en" or "sv".' });
      }
      try {
        const term = await Term.findOne({ where: { language } });
        if (!term) {
          return reply.code(404).send({ error: 'Terms not found.' });
        }
        return reply.code(200).send({
          title: term.terms_title,
          button: term.terms_button,
          context: term.terms_context,
        });
      } catch (error) {
        return reply.code(500).send({ error: 'Internal server error.' });
      }
    });
  }