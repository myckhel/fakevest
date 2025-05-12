import React, { useEffect, useState } from 'react';

import {
  CheckCircleOutlined,
  SafetyCertificateOutlined,
  SendOutlined,
} from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Steps,
  Typography,
} from 'antd';

import { TransferData } from '@/Apis/transactions';
import useTransactionStore from '@/Stores/transactionStore';
import useUIStore from '@/Stores/uiStore';
import useWalletStore from '@/Stores/walletStore';

import TransactionPin from '../PIN/TransactionPin';

const { Title, Text } = Typography;
const { Option } = Select;

type TransferMoneyModalProps = {
  visible: boolean;
  onClose: () => void;
};

/**
 * Modal component for transferring money to another user or between wallets
 */
const TransferMoneyModal: React.FC<TransferMoneyModalProps> = ({
  visible,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [, setIsLoading] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [transferDetails, setTransferDetails] = useState<any>(null);
  const [transferType, setTransferType] = useState<'user' | 'wallet'>('user');

  const { createTransfer } = useTransactionStore();
  const { fetchAllWallets, wallets } = useWalletStore();
  const { showToast } = useUIStore();

  // Fetch wallets on component mount
  useEffect(() => {
    if (visible) {
      fetchAllWallets();
    }
  }, [visible]);

  const handleTransferTypeChange = (value: 'user' | 'wallet') => {
    setTransferType(value);
    form.resetFields(['username', 'to_wallet_id']);
  };

  const handleTransferDetailsSubmit = (values: any) => {
    setTransferDetails(values);
    setCurrentStep(1);
  };

  const handlePinSuccess = async (pin: string) => {
    try {
      setIsLoading(true);

      // Build transfer data in the expected format
      const transferData: TransferData = {
        wallet_id: transferDetails.wallet_id,
        amount: transferDetails.amount,
        pin: pin,
        description: transferDetails.description,
      };

      // Add either username or to_wallet_id based on transfer type
      if (transferType === 'user') {
        transferData.username = transferDetails.username;
      } else {
        transferData.to_wallet_id = transferDetails.to_wallet_id;
      }

      await createTransfer(transferData);
      await fetchAllWallets();

      setTransferSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);

      showToast('Transfer completed successfully', 'success');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Transfer failed. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTransferSuccess(false);
    setCurrentStep(0);
    setTransferDetails(null);
    form.resetFields();
    onClose();
  };

  const handleBack = () => {
    setCurrentStep(0);
  };

  const renderSteps = () => (
    <Steps
      current={currentStep}
      className="mb-6"
      items={[
        {
          title: 'Details',
          icon: <SendOutlined />,
        },
        {
          title: 'Authorization',
          icon: <SafetyCertificateOutlined />,
        },
      ]}
    />
  );

  const renderTransferForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleTransferDetailsSubmit}
      requiredMark={false}
      initialValues={{ wallet_id: wallets?.[0]?.id, transferType: 'user' }}
    >
      <Form.Item
        name="wallet_id"
        label="From Wallet"
        rules={[{ required: true, message: 'Please select source wallet' }]}
      >
        <Select placeholder="Select wallet">
          {wallets?.map((wallet) => (
            <Option key={wallet.id} value={wallet.id}>
              {wallet.name.charAt(0).toUpperCase() + wallet.name.slice(1)} - ₦
              {Number(wallet.balance).toLocaleString()}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="transferType" label="Transfer To">
        <Select
          onChange={(value) =>
            handleTransferTypeChange(value as 'user' | 'wallet')
          }
        >
          <Option value="user">Another User</Option>
          <Option value="wallet">My Other Wallet</Option>
        </Select>
      </Form.Item>

      {transferType === 'user' ? (
        <Form.Item
          name="username"
          label="Recipient Username"
          rules={[
            { required: true, message: "Please enter recipient's username" },
          ]}
        >
          <Input placeholder="Enter recipient's username" />
        </Form.Item>
      ) : (
        <Form.Item
          name="to_wallet_id"
          label="Destination Wallet"
          rules={[
            { required: true, message: 'Please select destination wallet' },
          ]}
        >
          <Select placeholder="Select destination wallet">
            {wallets
              ?.filter((w) => w.id !== form.getFieldValue('wallet_id'))
              .map((wallet) => (
                <Option key={wallet.id} value={wallet.id}>
                  {wallet.name.charAt(0).toUpperCase() + wallet.name.slice(1)} -
                  ₦{Number(wallet.balance).toLocaleString()}
                </Option>
              ))}
          </Select>
        </Form.Item>
      )}

      <Form.Item
        name="amount"
        label="Amount"
        rules={[
          { required: true, message: 'Please enter amount' },
          {
            type: 'number',
            min: 100,
            message: 'Amount must be at least ₦100',
          },
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          formatter={(value) =>
            `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
          parser={(value) => value!.replace(/₦\s?|(,*)/g, '')}
          placeholder="Enter amount"
        />
      </Form.Item>

      <Form.Item name="description" label="Description (Optional)">
        <Input placeholder="What's this transfer for?" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Continue
        </Button>
      </Form.Item>
    </Form>
  );

  const renderTransferSummary = () => {
    const selectedWallet = wallets?.find(
      (w) => w.id === transferDetails?.wallet_id,
    );
    const destinationWallet =
      transferType === 'wallet'
        ? wallets?.find((w) => w.id === transferDetails?.to_wallet_id)
        : null;

    return (
      <div className="mb-4">
        <Text strong>Transfer Summary</Text>
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded mt-2">
          <div className="flex justify-between mb-1">
            <Text>From:</Text>
            <Text strong>
              {selectedWallet
                ? `${
                    selectedWallet.name.charAt(0).toUpperCase() +
                    selectedWallet.name.slice(1)
                  } Wallet`
                : 'Selected wallet'}
            </Text>
          </div>

          <div className="flex justify-between mb-1">
            <Text>To:</Text>
            <Text strong>
              {transferType === 'user'
                ? transferDetails?.username
                : destinationWallet
                  ? `${
                      destinationWallet.name.charAt(0).toUpperCase() +
                      destinationWallet.name.slice(1)
                    } Wallet`
                  : 'Selected wallet'}
            </Text>
          </div>

          <div className="flex justify-between mb-1">
            <Text>Amount:</Text>
            <Text strong>₦{transferDetails?.amount?.toLocaleString()}</Text>
          </div>

          {transferDetails?.description && (
            <div className="flex justify-between">
              <Text>Description:</Text>
              <Text strong>{transferDetails?.description}</Text>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Modal
      title="Send Money"
      open={visible}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
    >
      {transferSuccess ? (
        <div className="text-center py-8">
          <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />
          <Title level={4} className="mt-4">
            Transfer Successful!
          </Title>
          <Text>Your money has been sent successfully.</Text>
        </div>
      ) : (
        <>
          {renderSteps()}

          {currentStep === 0 && renderTransferForm()}

          {currentStep === 1 && (
            <>
              {renderTransferSummary()}

              <TransactionPin
                onSuccess={handlePinSuccess}
                onCancel={handleBack}
              />
            </>
          )}
        </>
      )}
    </Modal>
  );
};

export default TransferMoneyModal;
