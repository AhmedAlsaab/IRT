
// Config folder to store the JWT secret,
// Routes tha tare excluded from the JWT process
// And the port the server is running on
module.exports = {
    'jwtsecret': 'shhhhhhh',
    'excludedRoutes': ['/login', '/register', '/paypal', '/paypal-button', '/success', '/cancel'],
    'port': 3000
};