const axios = require('axios');

async function testEmailSend() {
    try {
        // Step 1: Login
        console.log('Logging in...');
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: '22it117@charusat.edu.in',
            password: '@22It117' // Replace with actual admin password
        });

        const token = loginResponse.data.token;
        console.log('Login successful, token received');

        // Step 2: Send emails
        console.log('Sending emails...');
        const emailResponse = await axios.post(
            'http://localhost:5000/api/email/send-credentials',
            {
                userType: 'alumni',
                excelFilePath: 'D:/7th_sem/SGP/peerprep/Data/temp_users_with_hashed_passwords.xlsx'
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Email send result:', emailResponse.data);

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testEmailSend();