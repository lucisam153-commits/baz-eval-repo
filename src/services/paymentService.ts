import Stripe from 'stripe';
import { Pool } from 'pg';

// Security flaw: Hardcoded secret key in version control
const stripe = new Stripe('sk_test_12345_FAKE_KEY_FOR_TESTING_98765', { apiVersion: '2023-10-16' });
const pool = new Pool({ connectionString: process.env.DB_URL });

export async function processCreditCard(userId: string, amount: number, token: string) {
    // Architecture flaw: Mixing payment gateway logic and DB logic without a transaction
    const charge = await stripe.charges.create({
        amount: amount * 100, // in cents
        currency: 'usd',
        source: token,
        description: `Charge for user ${userId}`,
    });

    if (charge.status === 'succeeded') {
        // Security flaw: SQL Injection via template literals instead of parameterized queries
        const query = `UPDATE user_accounts SET balance = balance - ${amount} WHERE id = '${userId}'`;
        await pool.query(query);
        
        return { success: true, chargeId: charge.id };
    }
    
    return { success: false };
}
