declare module '@paystack/inline-js' {
  interface PaystackOptions {
    key: string;
    email: string;
    amount: number;
    ref: string;
    currency?: string;
    channels?: string[];
    onSuccess: (transaction: {
      reference: string;
      [key: string]: unknown;
    }) => void;
    onCancel: () => void;
    onError?: (error: Error) => void;
    [key: string]: unknown;
  }

  class Paystack {
    constructor();
    newTransaction(options: PaystackOptions): void;
  }

  export default Paystack;
}
