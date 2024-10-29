import express, { Application } from 'express';
import userRoutes from './routes/exchangeRoutes';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger'; // Import the swagger config


export class App {
    public app: express.Application;
    public port = 3001;
    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.app.use('/api', userRoutes);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        this.app.get('/', (req, res) => {
            res.send('common crypto apis');
        });
        this.listen();
    }
    private listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}