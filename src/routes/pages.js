export default async function routes(fastify) {
  fastify.get('/api/home', async (request, reply) => {
    const { language } = request.query;
    return reply.code(200).send({
      title: language === 'sv' ? 'Hem' : 'Home',
      button: language === 'sv' ? 'Gå till Villkor' : 'Go to Terms',
      context: language === 'sv' ? '<p>Välkommen till 123 Fakturera! Detta är hemsidan.</p>' : '<p>Welcome to 123 Fakturera! This is the home page.</p>',
    });
  });

  fastify.get('/api/about', async (request, reply) => {
    const { language } = request.query;
    return reply.code(200).send({
      title: language === 'sv' ? 'Om Oss' : 'About Us',
      button: language === 'sv' ? 'Gå till Kontakt' : 'Go to Contact',
      context: language === 'sv' ? '<p>Läs mer om 123 Fakturera och vår mission.</p>' : '<p>Learn more about 123 Fakturera and our mission.</p>',
    });
  });

  fastify.get('/api/contact', async (request, reply) => {
    const { language } = request.query;
    return reply.code(200).send({
      title: language === 'sv' ? 'Kontakta Oss' : 'Contact Us',
      button: language === 'sv' ? 'Gå till Hem' : 'Go to Home',
      context: language === 'sv' ? '<p>Kontakta 123 Fakturera för support eller frågor.</p>' : '<p>Contact 123 Fakturera for support or inquiries.</p>',
    });
  });
}