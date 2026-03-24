import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function processUserPayments(userIds: number[], amount: number) {
  // Bug 1: N+1 Query Problem (Extremely slow loop over DB)
  for (const id of userIds) {
    const user = await pool.query(`SELECT * FROM users WHERE id = ${id}`); // Bug 2: SQL Injection Vulnerability
    
    if (user.rows.length > 0) {
      const balance = user.rows[0].balance;
      
      // Bug 3: Race Condition (read-modify-write without lock/transaction)
      if (balance >= amount) {
        const newBalance = balance - amount;
        
        // Bug 4: Unhandled Promise Rejection (no try/catch or await on the update)
        pool.query(`UPDATE users SET balance = ${newBalance} WHERE id = ${id}`);
        
        console.log(`Payment processed for ${id}`);
      }
    }
  }
}

export function parseIncomingData(dataStr: string) {
    // Bug 5: Inefficient RegExp (Catastrophic Backtracking vulnerability)
    const regex = /^([a-zA-Z0-9]+\s?)+$/; 
    return regex.test(dataStr);
}
