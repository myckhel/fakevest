import React, { useState } from 'react';

import {
  CheckCircleOutlined,
  CreditCardOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Alert, Button, Modal, Result, Space, Spin, Typography } from 'antd';

import API from '@/Apis';
import useUIStore from '@/Stores/uiStore';

const { Title, Text, Paragraph } = Typography;

interface AddCardModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Modal for adding a new card through Paystack
 */
const AddCardModal: React.FC<AddCardModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);

  const { showToast } = useUIStore();

  // Initialize card addition
  const handleAddCard = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.paymentOptions.addCard();
      setPaymentUrl(response.authorization_url);
      setReference(response.reference);

      // Open the authorization URL in a new window
      const paymentWindow = window.open(response.authorization_url, '_blank');

      // If the browser blocks the popup
      if (!paymentWindow) {
        setError('Please enable popups to complete the card addition process.');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to initialize card addition',
      );
    } finally {
      setLoading(false);
    }
  };

  // Verify the payment
  const handleVerifyPayment = async () => {
    if (!reference) return;

    try {
      setVerifying(true);
      const result = await API.paymentOptions.verifyPayment(reference);

      if (result.status) {
        setSuccess(true);
        showToast('Card added successfully', 'success');
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }
      } else {
        setError('Card verification failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify card addition');
    } finally {
      setVerifying(false);
    }
  };

  const handleClose = () => {
    setPaymentUrl(null);
    setReference(null);
    setError(null);
    setSuccess(false);
    onClose();
  };

  const renderContent = () => {
    if (success) {
      return (
        <Result
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          title="Card Added Successfully"
          subTitle="Your card has been added to your payment methods"
          extra={
            <Button type="primary" onClick={handleClose}>
              Done
            </Button>
          }
        />
      );
    }

    if (paymentUrl && reference) {
      return (
        <div className="text-center">
          <Alert
            message="Card Addition in Progress"
            description="Complete the payment process in the opened window to add your card."
            type="info"
            showIcon
            className="mb-4"
          />

          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              className="mb-4"
            />
          )}

          <div className="mb-4">
            <Paragraph>
              {verifying ? (
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                />
              ) : (
                'Click the button below when you have completed the card addition process'
              )}
            </Paragraph>
          </div>

          <Space>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="primary"
              onClick={handleVerifyPayment}
              loading={verifying}
              disabled={verifying}
            >
              {verifying ? 'Verifying...' : "I've Completed Payment"}
            </Button>
          </Space>

          <div className="mt-4">
            <Text type="secondary">
              A token amount of ₦1.00 will be charged and refunded immediately
              to verify your card.
            </Text>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center">
        <CreditCardOutlined
          style={{ fontSize: 48, marginBottom: 16, color: '#1890ff' }}
        />
        <Title level={4}>Add a New Card</Title>
        <Paragraph className="mb-6">
          Add a card to make quick deposits and automate your savings. We use
          Paystack to securely process all card transactions.
        </Paragraph>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        <Button
          type="primary"
          onClick={handleAddCard}
          loading={loading}
          size="large"
          icon={<CreditCardOutlined />}
        >
          {loading ? 'Processing...' : 'Add Card Now'}
        </Button>

        <div className="mt-4">
          <Text type="secondary">
            A token amount of ₦1.00 will be charged and refunded immediately to
            verify your card.
          </Text>
        </div>
      </div>
    );
  };

  return (
    <Modal
      open={visible}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
      title={success ? null : 'Add Payment Card'}
      width={500}
    >
      {renderContent()}
    </Modal>
  );
};

export default AddCardModal;
