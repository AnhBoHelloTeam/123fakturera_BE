import Term from '../src/models/term.js';

export const up = async () => {
  try {
    // Clear existing terms first
    await Term.destroy({ where: {} });
    console.log('Cleared existing terms...');

    // English terms
    await Term.create({
      language: 'en',
      terms_title: 'Terms and Conditions',
      terms_button: 'Close',
      terms_context: `
        <h2>Terms and Conditions</h2>
        <p>Welcome to 123 Fakturera. These terms and conditions outline the rules and regulations for the use of our service.</p>
        
        <h3>1. Acceptance of Terms</h3>
        <p>By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h3>2. Use License</h3>
        <p>Permission is granted to temporarily download one copy of the materials on 123 Fakturera's website for personal, non-commercial transitory viewing only.</p>
        
        <h3>3. Disclaimer</h3>
        <p>The materials on 123 Fakturera's website are provided on an 'as is' basis. 123 Fakturera makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        
        <h3>4. Limitations</h3>
        <p>In no event shall 123 Fakturera or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on 123 Fakturera's website, even if 123 Fakturera or a 123 Fakturera authorized representative has been notified orally or in writing of the possibility of such damage.</p>
        
        <h3>5. Accuracy of materials</h3>
        <p>The materials appearing on 123 Fakturera's website could include technical, typographical, or photographic errors. 123 Fakturera does not warrant that any of the materials on its website are accurate, complete or current.</p>
        
        <h3>6. Links</h3>
        <p>123 Fakturera has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by 123 Fakturera of the site.</p>
        
        <h3>7. Modifications</h3>
        <p>123 Fakturera may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</p>
        
        <h3>8. Governing Law</h3>
        <p>These terms and conditions are governed by and construed in accordance with the laws of Sweden and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
      `
    });

    // Swedish terms
    await Term.create({
      language: 'sv',
      terms_title: 'Villkor',
      terms_button: 'Stäng',
      terms_context: `
        <h2>Villkor</h2>
        <p>Välkommen till 123 Fakturera. Dessa villkor beskriver reglerna och bestämmelserna för användning av vår tjänst.</p>
        
        <h3>1. Godkännande av villkor</h3>
        <p>Genom att komma åt och använda denna tjänst accepterar och godkänner du att vara bunden av villkoren och bestämmelserna i detta avtal.</p>
        
        <h3>2. Användningslicens</h3>
        <p>Tillstånd ges att tillfälligt ladda ner en kopia av materialen på 123 Faktureras webbplats för personlig, icke-kommersiell tillfällig visning endast.</p>
        
        <h3>3. Ansvarsfriskrivning</h3>
        <p>Materialen på 123 Faktureras webbplats tillhandahålls på en "som den är"-basis. 123 Fakturera ger inga garantier, uttryckliga eller underförstådda, och förnekar härmed och negerar alla andra garantier inklusive utan begränsning, underförstådda garantier eller villkor för säljbarhet, lämplighet för ett visst ändamål, eller icke-kränkning av immateriell egendom eller annan kränkning av rättigheter.</p>
        
        <h3>4. Begränsningar</h3>
        <p>Under inga omständigheter ska 123 Fakturera eller dess leverantörer vara ansvariga för några skador (inklusive, utan begränsning, skador för förlust av data eller vinst, eller på grund av affärsavbrott) som uppstår från användningen eller oförmågan att använda materialen på 123 Faktureras webbplats, även om 123 Fakturera eller en 123 Fakturera auktoriserad representant har meddelats muntligt eller skriftligt om möjligheten av sådan skada.</p>
        
        <h3>5. Noggrannhet av material</h3>
        <p>Materialen som visas på 123 Faktureras webbplats kan inkludera tekniska, typografiska eller fotografiska fel. 123 Fakturera garanterar inte att något av materialen på dess webbplats är korrekt, komplett eller aktuellt.</p>
        
        <h3>6. Länkar</h3>
        <p>123 Fakturera har inte granskat alla de webbplatser som är länkade till dess webbplats och är inte ansvarig för innehållet i någon sådan länkad webbplats. Inkluderingen av en länk innebär inte godkännande av 123 Fakturera av webbplatsen.</p>
        
        <h3>7. Modifieringar</h3>
        <p>123 Fakturera kan revidera dessa användarvillkor för dess webbplats när som helst utan förvarning. Genom att använda denna webbplats godkänner du att vara bunden av den dåvarande versionen av dessa användarvillkor.</p>
        
        <h3>8. Tillämplig lag</h3>
        <p>Dessa villkor styrs av och tolkas i enlighet med Sveriges lagar och du underkastar dig oåterkalleligt den exklusiva jurisdiktionen för domstolarna i den staten eller platsen.</p>
      `
    });

    console.log('Terms seeded successfully!');
  } catch (error) {
    console.error('Error seeding terms:', error);
  }
};

export const down = async () => {
  await Term.destroy({ where: { language: ['en', 'sv'] } });
};
