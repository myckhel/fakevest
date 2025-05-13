import React, { useState } from 'react';

import { Alert, Button, Form, Input, Space, Typography } from 'antd';
import axios from 'axios';

import useAuthStore from '@/Stores/authStore';
import useUIStore from '@/Stores/uiStore';

const { Title } = Typography;

interface TransactionPinProps {
  onSuccess?: (pin: string) => void;
  onCancel?: () => void;
  mode?: 'verify' | 'create' | 'update';
}

/**
 * Component for transaction PIN verification, creation, and updates
 */
const TransactionPin: React.FC<TransactionPinProps> = ({
  onSuccess,
  onCancel,
  mode = 'verify',
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useUIStore();
  const { user, refreshUser } = useAuthStore();

  const hasPin = user?.has_pin;

  // Determine the actual mode based on whether user has a PIN already
  const actualMode =
    mode === 'create' || (!hasPin && mode === 'verify') ? 'create' : mode;

  const handleSubmit = async (values: any) => {
    setLoading(true);
    setError(null);

    try {
      if (actualMode === 'verify') {
        // Verify PIN
        await axios.post('/api/v1/users/pin', {
          pin: values.pin,
        });

        showToast('PIN verified successfully', 'success');
        if (onSuccess) onSuccess(values.pin);
      } else if (actualMode === 'create') {
        // Create new PIN
        await axios.put('/api/v1/users/pin', {
          pin: values.pin,
          confirm_pin: values.confirmPin,
        });

        await refreshUser();
        showToast('PIN created successfully', 'success');
        if (onSuccess) onSuccess(values.pin);
      } else if (actualMode === 'update') {
        // Update existing PIN
        await axios.put('/api/v1/users/pin', {
          pin: values.pin,
          old_pin: values.oldPin,
          confirm_pin: values.confirmPin,
        });

        await refreshUser();
        showToast('PIN updated successfully', 'success');
        if (onSuccess) onSuccess(values.pin);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        'An error occurred while processing your request';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (actualMode === 'verify') {
      return (
        <>
          <Form.Item
            name="pin"
            label="Transaction PIN"
            rules={[
              { required: true, message: 'Please enter your transaction PIN' },
              { len: 4, message: 'PIN must be 4 digits' },
            ]}
          >
            <Input.Password
              maxLength={4}
              placeholder="Enter your 4-digit PIN"
              type="number"
            />
          </Form.Item>
        </>
      );
    } else if (actualMode === 'create') {
      return (
        <>
          <Form.Item
            name="pin"
            label="New PIN"
            rules={[
              { required: true, message: 'Please enter a PIN' },
              { len: 4, message: 'PIN must be 4 digits' },
            ]}
          >
            <Input.Password
              maxLength={4}
              placeholder="Enter a 4-digit PIN"
              type="number"
            />
          </Form.Item>
          <Form.Item
            name="confirmPin"
            label="Confirm PIN"
            dependencies={['pin']}
            rules={[
              { required: true, message: 'Please confirm your PIN' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('pin') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('PINs do not match'));
                },
              }),
            ]}
          >
            <Input.Password
              maxLength={4}
              placeholder="Confirm your PIN"
              type="number"
            />
          </Form.Item>
        </>
      );
    } else {
      // update
      return (
        <>
          <Form.Item
            name="oldPin"
            label="Current PIN"
            rules={[
              { required: true, message: 'Please enter your current PIN' },
              { len: 4, message: 'PIN must be 4 digits' },
            ]}
          >
            <Input.Password
              maxLength={4}
              placeholder="Enter your current PIN"
              type="number"
            />
          </Form.Item>
          <Form.Item
            name="pin"
            label="New PIN"
            rules={[
              { required: true, message: 'Please enter a new PIN' },
              { len: 4, message: 'PIN must be 4 digits' },
            ]}
          >
            <Input.Password
              maxLength={4}
              placeholder="Enter a new 4-digit PIN"
              type="number"
            />
          </Form.Item>
          <Form.Item
            name="confirmPin"
            label="Confirm New PIN"
            dependencies={['pin']}
            rules={[
              { required: true, message: 'Please confirm your new PIN' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('pin') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('PINs do not match'));
                },
              }),
            ]}
          >
            <Input.Password
              maxLength={4}
              placeholder="Confirm your new PIN"
              type="number"
            />
          </Form.Item>
        </>
      );
    }
  };

  return (
    <div className="transaction-pin">
      <Title level={4} className="mb-4">
        {actualMode === 'verify' && 'Enter Transaction PIN'}
        {actualMode === 'create' && 'Create Transaction PIN'}
        {actualMode === 'update' && 'Update Transaction PIN'}
      </Title>

      {!hasPin && mode === 'verify' && (
        <Alert
          message="PIN Required"
          description="You need to create a transaction PIN to continue."
          type="info"
          showIcon
          className="mb-4"
        />
      )}

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        {renderForm()}

        <Form.Item className="mb-0">
          <Space className="w-full justify-end">
            {onCancel && <Button onClick={onCancel}>Cancel</Button>}
            <Button type="primary" htmlType="submit" loading={loading}>
              {actualMode === 'verify' ? 'Verify' : 'Save PIN'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TransactionPin;
