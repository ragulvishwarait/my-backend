export const InvoiceTemplate = (invoiceId: string, amount: number) => `
  <h1>Invoice #${invoiceId}</h1>
  <p>Your total due: <b>$${amount}</b></p>
`;
