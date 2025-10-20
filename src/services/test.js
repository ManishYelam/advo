const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../../.env' }); // adjust the path to your .env

async function testApiEndpoint() {
  try {
    // Generate a token for user with ID 1
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: '1d' });
    console.log('Generated token:', token);

    const testData = {
      user_id: 1, // Use a valid user ID from your database
      subject: 'API Test Ticket',
      description: 'Testing the API endpoint directly',
      category: 'general',
      priority: 'medium',
      case_id: null // Explicitly set to null
    };

    console.log('Testing API endpoint with data:', testData);

    const response = await axios.post('http://localhost:5000/api/support/tickets', testData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ API SUCCESS:', response.data);
  } catch (error) {
    console.log('❌ API FAILED:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testApiEndpoint();