const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');
const path = require('path');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Ethiomovie API',
      version: '1.0.0',
      description: 'API documentation for Ethiomovie streaming service',
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
    externalDocs: {
      description: 'Find more info here',
      url: 'https://example.com/docs',
    },
  },
  apis: ['./models/**/*.js', './routes/**/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;

// // Save Swagger JSON to a file
// const filePath = path.join(__dirname, 'swagger.json');
// fs.writeFileSync(filePath, JSON.stringify(specs, null, 2));
// console.log('Swagger documentation exported successfully to:', filePath);
