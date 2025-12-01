const https = require('http');

const data = JSON.stringify({
    username: 'admin',
    password: 'adminpassword'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);

    let responseData = '';
    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        console.log('Response:', responseData);
        if (res.statusCode === 200) {
            console.log('✅ LOGIN SUCCESSFUL!');
        } else {
            console.log('❌ LOGIN FAILED');
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Error:', error);
});

req.write(data);
req.end();
