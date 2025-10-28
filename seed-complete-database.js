import sequelize from './src/config/db.js';
import User from './src/models/User.js';
import Product from './src/models/product.js';
import Term from './src/models/term.js';
import Customer from './src/models/customer.js';
import Invoice from './src/models/invoice.js';
import InvoiceItem from './src/models/invoiceItem.js';
import bcrypt from 'bcrypt';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await InvoiceItem.destroy({ where: {} });
    await Invoice.destroy({ where: {} });
    await Customer.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await User.destroy({ where: {} });
    await Term.destroy({ where: {} });

    // 1. Create Users
    console.log('👥 Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.bulkCreate([
      {
        companyName: 'ABC Company AB',
        contactPerson: 'John Doe',
        address: 'Storgatan 123',
        postNumber: '12345',
        city: 'Stockholm',
        mobile: '070-1234567',
        email: 'john@abc.com',
        password: hashedPassword,
        isVerified: true,
      },
      {
        companyName: 'XYZ Trading AB',
        contactPerson: 'Anna Svensson',
        address: 'Vasagatan 45',
        postNumber: '11122',
        city: 'Göteborg',
        mobile: '070-9876543',
        email: 'anna@xyz.com',
        password: hashedPassword,
        isVerified: true,
      },
      {
        companyName: 'Tech Solutions AB',
        contactPerson: 'Erik Johansson',
        address: 'Kungsgatan 78',
        postNumber: '22334',
        city: 'Malmö',
        mobile: '070-5555555',
        email: 'erik@tech.com',
        password: hashedPassword,
        isVerified: true,
      }
    ]);
    console.log(`✅ Created ${users.length} users`);

    // 2. Create Terms
    console.log('📋 Creating terms...');
    const terms = await Term.bulkCreate([
      {
        language: 'sv',
        terms_title: 'Allmänna villkor',
        terms_button: 'Acceptera villkor',
        terms_context: `
          <h2>Allmänna villkor för 123 Fakturera</h2>
          <p>Genom att använda vår tjänst accepterar du följande villkor:</p>
          <ul>
            <li>Du är ansvarig för att hålla dina uppgifter uppdaterade</li>
            <li>Vi respekterar din integritet enligt GDPR</li>
            <li>Tjänsten tillhandahålls "som den är"</li>
            <li>Vi förbehåller oss rätten att ändra villkoren</li>
          </ul>
          <p>För frågor, kontakta oss på support@123fakturera.se</p>
        `
      },
      {
        language: 'en',
        terms_title: 'Terms and Conditions',
        terms_button: 'Accept Terms',
        terms_context: `
          <h2>Terms and Conditions for 123 Fakturera</h2>
          <p>By using our service, you accept the following terms:</p>
          <ul>
            <li>You are responsible for keeping your information updated</li>
            <li>We respect your privacy according to GDPR</li>
            <li>The service is provided "as is"</li>
            <li>We reserve the right to change the terms</li>
          </ul>
          <p>For questions, contact us at support@123fakturera.se</p>
        `
      }
    ]);
    console.log(`✅ Created ${terms.length} terms`);

    // 3. Create Products
    console.log('📦 Creating products...');
    const products = await Product.bulkCreate([
      {
        userId: users[0].id,
        article_no: 'PROD-001',
        name: 'Konsultation - Timpris',
        in_price: 800.00,
        price: 1200.00,
        unit: 'timme',
        in_stock: 0,
        description: 'Professionell konsultation per timme',
      },
      {
        userId: users[0].id,
        article_no: 'PROD-002',
        name: 'Webbutveckling - Projekt',
        in_price: 50000.00,
        price: 75000.00,
        unit: 'projekt',
        in_stock: 0,
        description: 'Komplett webbutveckling för företag',
      },
      {
        userId: users[1].id,
        article_no: 'PROD-003',
        name: 'IT-support - Månadsavgift',
        in_price: 2000.00,
        price: 3000.00,
        unit: 'månad',
        in_stock: 0,
        description: 'Månatlig IT-support för företag',
      }
    ]);
    console.log(`✅ Created ${products.length} products`);

    // 4. Create Customers
    console.log('👤 Creating customers...');
    const customers = await Customer.bulkCreate([
      {
        userId: users[0].id,
        customerNumber: 'CUST-001',
        companyName: 'Nordic Solutions AB',
        contactPerson: 'Maria Andersson',
        email: 'maria@nordic.com',
        phone: '08-1234567',
        mobile: '070-1111111',
        address: 'Birger Jarlsgatan 12',
        postNumber: '11434',
        city: 'Stockholm',
        country: 'Sverige',
        vatNumber: 'SE556123456701',
        paymentTerms: 30,
        currency: 'SEK',
        notes: 'Viktig kund - snabb betalning',
        status: 'active',
      },
      {
        userId: users[0].id,
        customerNumber: 'CUST-002',
        companyName: 'Tech Innovations AB',
        contactPerson: 'Lars Eriksson',
        email: 'lars@techinnovations.se',
        phone: '031-9876543',
        mobile: '070-2222222',
        address: 'Kungsportsavenyn 25',
        postNumber: '41136',
        city: 'Göteborg',
        country: 'Sverige',
        vatNumber: 'SE556987654301',
        paymentTerms: 14,
        currency: 'SEK',
        notes: 'Ny kund - behöver extra uppmärksamhet',
        status: 'active',
      },
      {
        userId: users[1].id,
        customerNumber: 'CUST-003',
        companyName: 'Digital Marketing AB',
        contactPerson: 'Sofia Lindberg',
        email: 'sofia@digitalmarketing.se',
        phone: '040-5555555',
        mobile: '070-3333333',
        address: 'Stortorget 8',
        postNumber: '21122',
        city: 'Malmö',
        country: 'Sverige',
        vatNumber: 'SE556555555501',
        paymentTerms: 30,
        currency: 'SEK',
        notes: 'Stor kund - regelbundna beställningar',
        status: 'active',
      }
    ]);
    console.log(`✅ Created ${customers.length} customers`);

    // 5. Create Invoices
    console.log('🧾 Creating invoices...');
    const invoices = await Invoice.bulkCreate([
      {
        userId: users[0].id,
        customerId: customers[0].id,
        invoiceNumber: 'INV-2024-001',
        invoiceDate: new Date('2024-01-15'),
        dueDate: new Date('2024-02-14'),
        totalAmount: 14400.00,
        vatAmount: 3600.00,
        netAmount: 10800.00,
        currency: 'SEK',
        status: 'paid',
        paymentMethod: 'bank_transfer',
        paymentDate: new Date('2024-01-20'),
        notes: 'Betalning mottagen i tid',
        terms: 'Betalning ska ske inom 30 dagar',
        footer: 'Tack för ditt förtroende!',
      },
      {
        userId: users[0].id,
        customerId: customers[1].id,
        invoiceNumber: 'INV-2024-002',
        invoiceDate: new Date('2024-01-20'),
        dueDate: new Date('2024-02-03'),
        totalAmount: 3750.00,
        vatAmount: 750.00,
        netAmount: 3000.00,
        currency: 'SEK',
        status: 'sent',
        paymentMethod: null,
        paymentDate: null,
        notes: 'Väntar på betalning',
        terms: 'Betalning ska ske inom 14 dagar',
        footer: 'Tack för ditt förtroende!',
      },
      {
        userId: users[1].id,
        customerId: customers[2].id,
        invoiceNumber: 'INV-2024-003',
        invoiceDate: new Date('2024-01-25'),
        dueDate: new Date('2024-02-24'),
        totalAmount: 9375.00,
        vatAmount: 1875.00,
        netAmount: 7500.00,
        currency: 'SEK',
        status: 'draft',
        paymentMethod: null,
        paymentDate: null,
        notes: 'Utkast - väntar på godkännande',
        terms: 'Betalning ska ske inom 30 dagar',
        footer: 'Tack för ditt förtroende!',
      }
    ]);
    console.log(`✅ Created ${invoices.length} invoices`);

    // 6. Create Invoice Items
    console.log('📄 Creating invoice items...');
    const invoiceItems = await InvoiceItem.bulkCreate([
      {
        invoiceId: invoices[0].id,
        productId: products[0].id,
        description: 'Konsultation - Timpris',
        quantity: 12,
        unitPrice: 1200.00,
        total: 14400.00, // quantity * unitPrice
        taxRate: 25,
        taxAmount: 3600.00,
        sortOrder: 0,
      },
      {
        invoiceId: invoices[1].id,
        productId: products[2].id,
        description: 'IT-support - Månadsavgift',
        quantity: 1,
        unitPrice: 3000.00,
        total: 3000.00, // quantity * unitPrice
        taxRate: 25,
        taxAmount: 750.00,
        sortOrder: 0,
      },
      {
        invoiceId: invoices[2].id,
        productId: products[1].id,
        description: 'Webbutveckling - Projekt',
        quantity: 1,
        unitPrice: 75000.00,
        total: 75000.00, // quantity * unitPrice
        taxRate: 25,
        taxAmount: 18750.00,
        sortOrder: 0,
      }
    ]);
    console.log(`✅ Created ${invoiceItems.length} invoice items`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Terms: ${terms.length}`);
    console.log(`- Products: ${products.length}`);
    console.log(`- Customers: ${customers.length}`);
    console.log(`- Invoices: ${invoices.length}`);
    console.log(`- Invoice Items: ${invoiceItems.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
