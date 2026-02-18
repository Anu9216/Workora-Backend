try {
    console.log('Verifying modules...');
    require('./src/controllers/gigController');
    require('./src/controllers/orderController');
    require('./src/utils/uploadUtils');
    require('./src/routes/gigRoutes');
    require('./src/routes/orderRoutes');
    console.log('All new modules loaded successfully.');
} catch (error) {
    console.error('Module verification failed:', error);
    process.exit(1);
}
