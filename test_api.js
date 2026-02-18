const axios = require('axios');

const testUser = async () => {
    try {
        const id = '6991dd94ef5dcab9b8845486';
        console.log(`Testing GET /api/users/${id}`);
        // Try localhost:5178 (backend port from previous context if applicable, usually 8800 or similar based on server.js)
        // Let's check server.js port. Assuming 8800 standard MERN.
        // Wait, package.json says nodemon server.js. Let's assume default port or check .env.
        // I'll try 8800 which is common for this project type.

        const res = await axios.get(`http://localhost:5000/api/users/${id}`);
        console.log("Success:", res.data);
    } catch (err) {
        console.error("Error:", err.response ? err.response.data : err.message);
    }
};

testUser();
