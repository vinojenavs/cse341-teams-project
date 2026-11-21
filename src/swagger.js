import { writeFileSync } from 'node:fs';
import swaggerJsdoc from 'swagger-jsdoc';
import Path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kizuna Rail API',
      version: '1.0.0',
    },
    server: [
      {
        url: '/',
        description: 'Current server'
      }
    ]
  },
  apis: [Path.join(__dirname, 'routes', '*.js').split(Path.sep).join('/')], // wherever your @swagger comments live
};

export const swaggerSpec = swaggerJsdoc(options);

writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2));
console.log('Swagger documentation generated.');