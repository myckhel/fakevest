import { PaginatedData } from '../Utils/interfaces';
import Http from './Http';

export interface PaymentOption {
  id: number;
  user_id: number;
  authorization_code: string;
  bin: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  channel: string;
  card_type: string;
  bank: string;
  country_code: string;
  brand: string;
  reusable: boolean;
  signature: string;
  created_at: string;
  updated_at: string;
}

export interface AddCardResponse {
  id: number;
  amount: number;
  access_code: string;
  reference: string;
  status: string;
  authorization_url: string;
}

const PaymentOptionsAPI = {
  /**
   * Get all payment options (cards)
   */
  getPaymentOptions: (): Promise<PaginatedData<PaymentOption>> => {
    return Http.get('/payment-options');
  },

  /**
   * Add a new card
   */
  addCard: (): Promise<AddCardResponse> => {
    return Http.post('/payment-options');
  },

  /**
   * Verify payment callback
   */
  verifyPayment: (
    reference: string,
  ): Promise<{
    status: boolean;
    payment: any;
  }> => {
    return Http.post('/payments/verify', { reference });
  },

  /**
   * Delete a payment option
   */
  deletePaymentOption: (id: number): Promise<{ status: boolean }> => {
    return Http.delete(`/payment-options/${id}`);
  },

  /**
   * Set payment option as default
   */
  setDefaultPaymentOption: (id: number): Promise<PaymentOption> => {
    return Http.put(`/payment-options/${id}/default`);
  },
};

export default PaymentOptionsAPI;
