const dotenv = require('dotenv');
dotenv.config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./src/app');
const User = require('./src/models/User');

const runAuthTests = async () => {
    try {
        // Connect to a test database (or the same one, but careful with data)
        // For this simple verif, we assume local mongo is running. 
        // Ideally we'd use different DB but let's just use existing for speed, 
        // and cleanup user after.
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/workora');

        const testUser = {
            username: 'testu',
            email: 'test@example.com',
            password: 'password123',
            role: 'freelancer'
        };

        // Cleanup first
        await User.deleteMany({ email: testUser.email });

        console.log('Testing Signup...');
        const signupRes = await request(app)
            .post('/api/auth/signup')
            .send(testUser);

        if (signupRes.status !== 201) {
            console.error('Signup failed:', signupRes.body);
            process.exit(1);
        }
        console.log('Signup Successful');

        console.log('Testing Login...');
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: testUser.email, password: testUser.password });

        if (loginRes.status !== 200 || !loginRes.body.token) {
            console.error('Login failed:', loginRes.body);
            process.exit(1);
        }
        console.log('Login Successful, Token received');

        // Cleanup
        await User.deleteMany({ email: testUser.email });
        console.log('Cleanup done');
        process.exit(0);

    } catch (error) {
        console.error('Test Error:', error);
        process.exit(1);
    }
};

runAuthTests();
