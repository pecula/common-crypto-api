import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API Title',
            version: '1.0.0',
            description: 'API Documentation',
        },
    },
    apis: ['./src/routes/*.ts'], // Point to your routes file(s)
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;