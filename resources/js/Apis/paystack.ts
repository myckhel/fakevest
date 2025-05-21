import Http from './Http';

interface PaystackConfig {
  publicKey: string;
}

const PaystackAPI = {
  /**
   * Get Paystack configuration
   */
  getConfig: (): Promise<PaystackConfig> => {
    return Http.get('/paystack/config');
  },
};

export default PaystackAPI;
