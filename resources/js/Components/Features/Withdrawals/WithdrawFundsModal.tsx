import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Typography,
  Alert,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import useWalletStore from "@/Stores/walletStore";
import useUIStore from "@/Stores/uiStore";

const { Title, Text } = Typography;
const { Option } = Select;

type WithdrawFundsModalProps = {
  visible: boolean;
  onClose: () => void;
};

/**
 * Modal component for withdrawing funds from a wallet
 */
const WithdrawFundsModal: React.FC<WithdrawFundsModalProps> = ({
  visible,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const { withdrawFunds } = useWalletStore();
  const { showToast } = useUIStore();

  const handleWithdraw = async (values: any) => {
    try {
      setIsLoading(true);
      await withdrawFunds({
        amount: values.amount,
        wallet_name: "naira",
        account_id: values.accountId,
        pin: values.pin,
      });

      setWithdrawSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);

      showToast("Withdrawal initiated successfully", "success");
    } catch (error) {
      showToast("Withdrawal failed. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setWithdrawSuccess(false);
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Withdraw Funds"
      open={visible}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
    >
      {withdrawSuccess ? (
        <div className="text-center py-8">
          <CheckCircleOutlined style={{ fontSize: 48, color: "#52c41a" }} />
          <Title level={4} className="mt-4">
            Withdrawal Initiated!
          </Title>
          <Text>Your withdrawal request is being processed.</Text>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleWithdraw}
          requiredMark={false}
          preserve={false}
        >
          <Alert
            message="Withdrawal Information"
            description="Withdrawals are processed within 24 hours during business days."
            type="info"
            showIcon
            className="mb-4"
          />

          <Form.Item
            name="accountId"
            label="Account"
            rules={[{ required: true, message: "Please select account" }]}
          >
            <Select placeholder="Select bank account">
              <Option value={1}>Access Bank - 012345678</Option>
              <Option value={2}>GTBank - 987654321</Option>
              <Option value="new">+ Add New Account</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="amount"
            label="Amount"
            rules={[
              { required: true, message: "Please enter amount" },
              {
                type: "number",
                min: 1000,
                message: "Minimum withdrawal is ₦1,000",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/₦\s?|(,*)/g, "")}
              placeholder="Enter amount"
            />
          </Form.Item>

          <Form.Item
            name="pin"
            label="Transaction PIN"
            rules={[
              { required: true, message: "Please enter your PIN" },
              { len: 4, message: "PIN must be 4 digits" },
            ]}
          >
            <Input.Password placeholder="Enter 4-digit PIN" maxLength={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isLoading}>
              Withdraw Funds
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default WithdrawFundsModal;
