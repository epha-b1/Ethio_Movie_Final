const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0', // Specify OpenAPI version
    info: {
      title: 'Ethiomovie API', // Title of the API
      version: '1.0.0', // Version of the API
      description: 'API documentation for Ethiomovie streaming service', // Description of the API
    },
    servers: [
      {
        url: 'http://localhost:8800',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./models/**/*.js', './routes/**/*.js'], // Paths to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;
