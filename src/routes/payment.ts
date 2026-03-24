import { Router } from 'express';
import { processCreditCard } from '../services/paymentService';

export const paymentRouter = Router();

paymentRouter.post('/charge', async (req, res, next) => {
    try {
        // Architecture flaw: Trusting client input blindly (No validation/sanitization)
        const { userId, amount, creditCardToken } = req.body;
        
        const result = await processCreditCard(userId, amount, creditCardToken);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json({ message: "Charge failed" });
        }
    } catch (error) {
        next(error);
    }
});
