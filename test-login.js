import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_URL || 'https://123fakturera-backend.onrender.com';

const testUsers = [
  {
    email: 'anna@techsolutions.no',
    password: '123456',
    company: 'Tech Solutions AS',
    contact: 'Anna Johansson'
  },
  {
    email: 'erik@digitalinnovation.se',
    password: '123456',
    company: 'Digital Innovation AB',
    contact: 'Erik Andersson'
  },
  {
    email: 'maria@nordicbusiness.dk',
    password: '123456',
    company: 'Nordic Business Ltd',
    contact: 'Maria Hansen'
  }
];

const testLogin = async (user) => {
  try {
    console.log(`\n🔐 Testing login for: ${user.email}`);
    console.log(`   Company: ${user.company}`);
    console.log(`   Contact: ${user.contact}`);
    
    const response = await axios.post(`${API_URL}/api/login`, {
      email: user.email,
      password: user.password
    });
    
    if (response.status === 200 && response.data.token) {
      console.log(`   ✅ Login successful!`);
      console.log(`   🎫 Token received: ${response.data.token.substring(0, 20)}...`);
      console.log(`   🔄 Redirect: ${response.data.redirect}`);
      return { success: true, token: response.data.token };
    } else {
      console.log(`   ❌ Login failed: Unexpected response`);
      return { success: false, error: 'Unexpected response' };
    }
  } catch (error) {
    console.log(`   ❌ Login failed: ${error.response?.data?.error || error.message}`);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

const testProductsAccess = async (token) => {
  try {
    console.log(`\n📦 Testing products access with token...`);
    
    const response = await axios.get(`${API_URL}/api/products`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.status === 200) {
      console.log(`   ✅ Products access successful!`);
      console.log(`   📊 Found ${response.data.length} products`);
      return { success: true, products: response.data.length };
    } else {
      console.log(`   ❌ Products access failed: Unexpected response`);
      return { success: false, error: 'Unexpected response' };
    }
  } catch (error) {
    console.log(`   ❌ Products access failed: ${error.response?.data?.error || error.message}`);
    return { success: false, error: error.response?.data?.error || error.message };
  }
};

const runTests = async () => {
  console.log('🧪 Starting Login & Authentication Tests');
  console.log('=' .repeat(50));
  
  let successCount = 0;
  let totalTests = 0;
  
  for (const user of testUsers) {
    totalTests++;
    const loginResult = await testLogin(user);
    
    if (loginResult.success) {
      successCount++;
      
      // Test products access
      const productsResult = await testProductsAccess(loginResult.token);
      if (productsResult.success) {
        console.log(`   📦 Products access: ✅ Success (${productsResult.products} products)`);
      } else {
        console.log(`   📦 Products access: ❌ Failed`);
      }
    }
    
    // Wait 1 second between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('=' .repeat(50));
  console.log(`✅ Successful logins: ${successCount}/${totalTests}`);
  console.log(`❌ Failed logins: ${totalTests - successCount}/${totalTests}`);
  console.log(`📈 Success rate: ${((successCount / totalTests) * 100).toFixed(1)}%`);
  
  if (successCount === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED! Login system is working perfectly!');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }
  
  console.log('\n🔗 Test URLs:');
  console.log(`   Frontend: https://123fakturera-frontend.onrender.com`);
  console.log(`   Backend: ${API_URL}`);
  console.log('\n👥 Test Users:');
  testUsers.forEach((user, index) => {
    console.log(`   ${index + 1}. ${user.email} / 123456 (${user.company})`);
  });
};

// Run tests
runTests().catch(console.error);
