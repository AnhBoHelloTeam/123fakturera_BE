import User from '../src/models/User.js';
import Product from '../src/models/product.js';
import bcrypt from 'bcrypt';

export const up = async () => {
  try {
    // Clear existing products first (due to foreign key constraint)
    await Product.destroy({ where: {} });
    console.log('Cleared existing products...');
    
    // Clear existing users
    await User.destroy({ where: {} });
    console.log('Cleared existing users...');

    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash('123456', saltRounds);

    const testUsers = [
      {
        companyName: 'Tech Solutions AS',
        contactPerson: 'Anna Johansson',
        address: 'Storgata 123, Oslo',
        postNumber: '0155',
        city: 'Oslo',
        mobile: '+47 123 45 678',
        email: 'anna@techsolutions.no',
        password: hashedPassword,
        isVerified: true,
        verificationToken: null
      },
      {
        companyName: 'Digital Innovation AB',
        contactPerson: 'Erik Andersson',
        address: 'Vasagatan 45, Stockholm',
        postNumber: '111 20',
        city: 'Stockholm',
        mobile: '+46 70 123 45 67',
        email: 'erik@digitalinnovation.se',
        password: hashedPassword,
        isVerified: true,
        verificationToken: null
      },
      {
        companyName: 'Nordic Business Ltd',
        contactPerson: 'Maria Hansen',
        address: 'Kongens Nytorv 1, Copenhagen',
        postNumber: '1050',
        city: 'Copenhagen',
        mobile: '+45 12 34 56 78',
        email: 'maria@nordicbusiness.dk',
        password: hashedPassword,
        isVerified: true,
        verificationToken: null
      }
    ];

    // Create all users
    for (const userData of testUsers) {
      await User.create(userData);
    }

    console.log('Test users seeded successfully!');
    console.log('Users created:');
    console.log('1. anna@techsolutions.no (Tech Solutions AS)');
    console.log('2. erik@digitalinnovation.se (Digital Innovation AB)');
    console.log('3. maria@nordicbusiness.dk (Nordic Business Ltd)');
    console.log('Password for all: 123456');
    console.log('All users are verified and ready to login!');

  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

export const down = async () => {
  await User.destroy({ where: {} });
};
