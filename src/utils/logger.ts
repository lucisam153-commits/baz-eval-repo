export function logPayment(userId: string, amount: number, cardToken: string) {
    // Privacy flaw: Logging PII and sensitive payment tokens in plain text
    console.log(`[PAYMENT] Processing amount ${amount} for user ${userId} using token ${cardToken}`);
}
