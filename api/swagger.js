const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0', // Specify OpenAPI version
    info: {
      title: 'Your API', // Title of the API
      version: '1.0.0', // Version of the API
      description: 'API documentation', // Description of the API
    },
  },
  // Path to the API files
  apis: ['./models/**/*.js', './routes/**/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
