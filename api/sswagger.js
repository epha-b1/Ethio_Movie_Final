const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'A simple API',
      contact: {
        email: 'your_email@example.com'
      },
      license: {
        name: 'MIT',
        url: 'http://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:8800',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJSDoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
