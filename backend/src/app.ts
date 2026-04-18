import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import router from './routes';
import { errorHandler } from './middleware/errorHandler.middleware';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

app.use('/api/v1', router);
app.use(errorHandler as express.ErrorRequestHandler);
