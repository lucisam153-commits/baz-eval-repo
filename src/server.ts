import express from 'express';
import cors from 'cors';
import { paymentRouter } from './routes/payment';

const app = express();

// Security flaw: Overly permissive CORS in production
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/payments', paymentRouter);

// Security flaw: Returning full stack traces to clients in unhandled routes
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(500).json({ error: err.message, stack: err.stack });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
