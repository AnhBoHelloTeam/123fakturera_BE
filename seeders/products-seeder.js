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
        article_no: 'MAC-001',
        name: 'MacBook Pro 16" M3 Max',
        in_price: 2800.00,
        price: 3499.00,
        unit: 'pcs',
        in_stock: 3,
        description: 'Apple MacBook Pro 16-inch with M3 Max chip, 32GB RAM, 1TB SSD. Perfect for professional video editing and software development.'
      },
      {
        userId: user.id,
        article_no: 'GAM-002',
        name: 'Gaming Mouse Pro X',
        in_price: 45.00,
        price: 89.99,
        unit: 'pcs',
        in_stock: 25,
        description: 'High-precision gaming mouse with 25,600 DPI sensor, RGB lighting, and programmable buttons. Ideal for competitive gaming.'
      },
      {
        userId: user.id,
        article_no: 'KEY-003',
        name: 'Mechanical Keyboard RGB',
        in_price: 85.00,
        price: 149.99,
        unit: 'pcs',
        in_stock: 18,
        description: 'Cherry MX Blue switches, full RGB backlighting, aluminum frame. Perfect for typing and gaming enthusiasts.'
      },
      {
        userId: user.id,
        article_no: 'MON-004',
        name: '4K UltraWide Monitor',
        in_price: 450.00,
        price: 699.99,
        unit: 'pcs',
        in_stock: 8,
        description: '34-inch curved 4K monitor with 144Hz refresh rate, HDR support, and USB-C connectivity. Great for productivity and gaming.'
      },
      {
        userId: user.id,
        article_no: 'WEB-005',
        name: '4K Webcam Pro',
        in_price: 120.00,
        price: 199.99,
        unit: 'pcs',
        in_stock: 12,
        description: '4K resolution webcam with AI-powered auto-framing, noise cancellation, and privacy shutter. Perfect for streaming and video calls.'
      },
      {
        userId: user.id,
        article_no: 'SPK-006',
        name: 'Studio Monitor Speakers',
        in_price: 180.00,
        price: 299.99,
        unit: 'pcs',
        in_stock: 6,
        description: 'Professional studio monitor speakers with 5-inch woofers, balanced XLR inputs, and flat frequency response for accurate audio reproduction.'
      },
      {
        userId: user.id,
        article_no: 'SSD-007',
        name: 'NVMe SSD 2TB',
        in_price: 95.00,
        price: 159.99,
        unit: 'pcs',
        in_stock: 20,
        description: 'High-speed NVMe SSD with 2TB capacity, 7,000 MB/s read speed. Perfect for gaming, video editing, and system acceleration.'
      },
      {
        userId: user.id,
        article_no: 'USB-008',
        name: 'USB-C Hub Pro',
        in_price: 35.00,
        price: 59.99,
        unit: 'pcs',
        in_stock: 30,
        description: '11-in-1 USB-C hub with 4K HDMI, USB 3.0 ports, SD card reader, Ethernet, and 100W PD charging. Essential for modern laptops.'
      },
      {
        userId: user.id,
        article_no: 'CAB-009',
        name: 'Thunderbolt 4 Cable',
        in_price: 25.00,
        price: 49.99,
        unit: 'pcs',
        in_stock: 40,
        description: '2-meter Thunderbolt 4 cable supporting 40Gbps data transfer, 8K video, and 100W power delivery. Premium build quality.'
      },
      {
        userId: user.id,
        article_no: 'PAD-010',
        name: 'Gaming Mouse Pad XL',
        in_price: 18.00,
        price: 34.99,
        unit: 'pcs',
        in_stock: 50,
        description: 'Extra-large gaming mouse pad (900x400mm) with RGB edge lighting, water-resistant surface, and anti-slip rubber base.'
      },
      {
        userId: user.id,
        article_no: 'STA-011',
        name: 'Ergonomic Laptop Stand',
        in_price: 45.00,
        price: 79.99,
        unit: 'pcs',
        in_stock: 15,
        description: 'Adjustable aluminum laptop stand with 6 height levels, 360° rotation, and built-in cable management. Promotes better posture.'
      },
      {
        userId: user.id,
        article_no: 'BAG-012',
        name: 'Professional Laptop Backpack',
        in_price: 65.00,
        price: 119.99,
        unit: 'pcs',
        in_stock: 10,
        description: 'Waterproof laptop backpack with dedicated 17-inch laptop compartment, multiple pockets, and USB charging port.'
      },
      {
        userId: user.id,
        article_no: 'COO-013',
        name: 'Laptop Cooling Pad Pro',
        in_price: 28.00,
        price: 49.99,
        unit: 'pcs',
        in_stock: 22,
        description: 'Dual-fan laptop cooling pad with adjustable height, USB-powered fans, and LED lighting. Reduces laptop temperature by up to 15°C.'
      },
      {
        userId: user.id,
        article_no: 'DOK-014',
        name: 'Thunderbolt 3 Docking Station',
        in_price: 180.00,
        price: 299.99,
        unit: 'pcs',
        in_stock: 5,
        description: 'Professional docking station with dual 4K display support, 85W power delivery, and 10 connectivity ports including Thunderbolt 3.'
      },
      {
        userId: user.id,
        article_no: 'TAB-015',
        name: 'Digital Drawing Tablet',
        in_price: 220.00,
        price: 399.99,
        unit: 'pcs',
        in_stock: 4,
        description: '10-inch digital drawing tablet with 8,192 pressure levels, battery-free pen, and compatibility with all major design software.'
      },
      {
        userId: user.id,
        article_no: 'MIC-016',
        name: 'Podcast Microphone Kit',
        in_price: 95.00,
        price: 169.99,
        unit: 'pcs',
        in_stock: 8,
        description: 'Professional podcast microphone with pop filter, shock mount, and boom arm. Cardioid pattern for clear voice recording.'
      },
      {
        userId: user.id,
        article_no: 'LIG-017',
        name: 'Smart LED Strip Kit',
        in_price: 22.00,
        price: 39.99,
        unit: 'pcs',
        in_stock: 35,
        description: 'WiFi-enabled RGB LED strip with app control, music sync, and 16 million colors. Perfect for ambient lighting and gaming setups.'
      },
      {
        userId: user.id,
        article_no: 'CHA-018',
        name: 'Ergonomic Office Chair',
        in_price: 280.00,
        price: 499.99,
        unit: 'pcs',
        in_stock: 3,
        description: 'Premium ergonomic office chair with lumbar support, adjustable armrests, and breathable mesh back. 12-year warranty included.'
      },
      {
        userId: user.id,
        article_no: 'DES-019',
        name: 'Premium Desk Mat',
        in_price: 35.00,
        price: 59.99,
        unit: 'pcs',
        in_stock: 25,
        description: 'Large premium desk mat (1200x600mm) with leather surface, memory foam base, and wireless charging pad. Elevates your workspace.'
      },
      {
        userId: user.id,
        article_no: 'CLE-020',
        name: 'Screen Cleaning Kit Pro',
        in_price: 8.00,
        price: 19.99,
        unit: 'pcs',
        in_stock: 60,
        description: 'Professional screen cleaning kit with microfiber cloths, cleaning solution, and anti-static brush. Safe for all screen types.'
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
