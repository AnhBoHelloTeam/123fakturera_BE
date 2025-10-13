import Product from '../src/models/product.js';
import User from '../src/models/User.js';

export const up = async () => {
  try {
    // Clear existing products first
    await Product.destroy({ where: {} });
    console.log('Cleared existing products...');

    // Get the first user (assuming we have at least one user)
    const user = await User.findOne();
    if (!user) {
      console.log('No user found, please create a user first');
      return;
    }

    const sampleProducts = [
      {
        userId: user.id,
        article_no: 'ART-001',
        name: 'Laptop',
        in_price: 500.00,
        price: 700.00,
        unit: 'pcs',
        in_stock: 10,
        description: 'High-performance laptop for business use'
      },
      {
        userId: user.id,
        article_no: 'ART-002',
        name: 'Wireless Mouse',
        in_price: 10.00,
        price: 20.00,
        unit: 'pcs',
        in_stock: 50,
        description: 'Ergonomic wireless optical mouse'
      },
      {
        userId: user.id,
        article_no: 'ART-003',
        name: 'Mechanical Keyboard',
        in_price: 30.00,
        price: 50.00,
        unit: 'pcs',
        in_stock: 30,
        description: 'RGB mechanical gaming keyboard'
      },
      {
        userId: user.id,
        article_no: 'ART-004',
        name: '24" LED Monitor',
        in_price: 150.00,
        price: 200.00,
        unit: 'pcs',
        in_stock: 15,
        description: 'Full HD 24-inch LED monitor'
      },
      {
        userId: user.id,
        article_no: 'ART-005',
        name: 'USB-C Cable',
        in_price: 5.00,
        price: 10.00,
        unit: 'pcs',
        in_stock: 100,
        description: 'High-speed USB-C charging cable'
      },
      {
        userId: user.id,
        article_no: 'ART-006',
        name: 'Noise-Canceling Headphones',
        in_price: 40.00,
        price: 60.00,
        unit: 'pcs',
        in_stock: 25,
        description: 'Premium wireless noise-canceling headphones'
      },
      {
        userId: user.id,
        article_no: 'ART-007',
        name: '1080p Webcam',
        in_price: 25.00,
        price: 40.00,
        unit: 'pcs',
        in_stock: 20,
        description: 'HD webcam with built-in microphone'
      },
      {
        userId: user.id,
        article_no: 'ART-008',
        name: 'Inkjet Printer',
        in_price: 80.00,
        price: 120.00,
        unit: 'pcs',
        in_stock: 10,
        description: 'All-in-one wireless inkjet printer'
      },
      {
        userId: user.id,
        article_no: 'ART-009',
        name: 'Wi-Fi 6 Router',
        in_price: 50.00,
        price: 80.00,
        unit: 'pcs',
        in_stock: 12,
        description: 'High-speed Wi-Fi 6 router'
      },
      {
        userId: user.id,
        article_no: 'ART-010',
        name: '1TB External HDD',
        in_price: 60.00,
        price: 90.00,
        unit: 'pcs',
        in_stock: 8,
        description: 'Portable 1TB external hard drive'
      },
      {
        userId: user.id,
        article_no: 'ART-011',
        name: 'Ergonomic Mouse Pad',
        in_price: 5.00,
        price: 15.00,
        unit: 'pcs',
        in_stock: 40,
        description: 'Gel-filled ergonomic mouse pad'
      },
      {
        userId: user.id,
        article_no: 'ART-012',
        name: 'Bluetooth Speaker',
        in_price: 30.00,
        price: 50.00,
        unit: 'pcs',
        in_stock: 15,
        description: 'Portable Bluetooth speaker with bass'
      },
      {
        userId: user.id,
        article_no: 'ART-013',
        name: '500GB SSD',
        in_price: 70.00,
        price: 100.00,
        unit: 'pcs',
        in_stock: 10,
        description: 'High-speed 500GB solid state drive'
      },
      {
        userId: user.id,
        article_no: 'ART-014',
        name: 'Adjustable Laptop Stand',
        in_price: 20.00,
        price: 35.00,
        unit: 'pcs',
        in_stock: 20,
        description: 'Aluminum adjustable laptop stand'
      },
      {
        userId: user.id,
        article_no: 'ART-015',
        name: '10000mAh Power Bank',
        in_price: 15.00,
        price: 25.00,
        unit: 'pcs',
        in_stock: 30,
        description: 'Fast-charging portable power bank'
      },
      {
        userId: user.id,
        article_no: 'ART-016',
        name: '4K HDMI Cable',
        in_price: 8.00,
        price: 15.00,
        unit: 'pcs',
        in_stock: 50,
        description: 'Premium 4K HDMI cable 2 meters'
      },
      {
        userId: user.id,
        article_no: 'ART-017',
        name: 'LED Desk Lamp',
        in_price: 25.00,
        price: 40.00,
        unit: 'pcs',
        in_stock: 15,
        description: 'Adjustable LED desk lamp with USB port'
      },
      {
        userId: user.id,
        article_no: 'ART-018',
        name: 'Laptop Cooling Pad',
        in_price: 20.00,
        price: 30.00,
        unit: 'pcs',
        in_stock: 18,
        description: 'USB-powered laptop cooling pad'
      },
      {
        userId: user.id,
        article_no: 'ART-019',
        name: 'USB-C to HDMI Adapter',
        in_price: 10.00,
        price: 20.00,
        unit: 'pcs',
        in_stock: 25,
        description: 'Compact USB-C to HDMI adapter'
      },
      {
        userId: user.id,
        article_no: 'ART-020',
        name: 'Latest Model Smartphone',
        in_price: 300.00,
        price: 500.00,
        unit: 'pcs',
        in_stock: 5,
        description: 'Latest flagship smartphone model'
      }
    ];

    // Create all products
    for (const productData of sampleProducts) {
      await Product.create(productData);
    }

    console.log('Products seeded successfully!');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

export const down = async () => {
  const user = await User.findOne();
  if (user) {
    await Product.destroy({ where: { userId: user.id } });
  }
};
