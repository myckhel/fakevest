import React, { useState } from "react";
import { Modal, Form, Input, InputNumber, Button, Typography } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import useTransactionStore from "@/Stores/transactionStore";
import useWalletStore from "@/Stores/walletStore";
import useUIStore from "@/Stores/uiStore";

const { Title, Text } = Typography;

type TransferMoneyModalProps = {
  visible: boolean;
  onClose: () => void;
};

/**
 * Modal component for transferring money to another user
 */
const TransferMoneyModal: React.FC<TransferMoneyModalProps> = ({
  visible,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);

  const { createTransfer } = useTransactionStore();
  const { fetchNairaWallet } = useWalletStore();
  const { showToast } = useUIStore();

  const handleTransfer = async (values: any) => {
    try {
      setIsLoading(true);
      await createTransfer({
        to_id: values.recipientId,
        amount: values.amount,
        desc: values.description,
      });

      await fetchNairaWallet();

      setTransferSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);

      showToast("Transfer completed successfully", "success");
    } catch (error) {
      showToast("Transfer failed. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTransferSuccess(false);
    form.resetFields();
    onClose();
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
          <CheckCircleOutlined style={{ fontSize: 48, color: "#52c41a" }} />
          <Title level={4} className="mt-4">
            Transfer Successful!
          </Title>
          <Text>Your money has been sent successfully.</Text>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleTransfer}
          requiredMark={false}
          preserve={false}
        >
          <Form.Item
            name="recipientId"
            label="Recipient ID"
            rules={[{ required: true, message: "Please enter recipient ID" }]}
          >
            <Input placeholder="Enter user ID or username" />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Amount"
            rules={[
              { required: true, message: "Please enter amount" },
              {
                type: "number",
                min: 100,
                message: "Amount must be at least ₦100",
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

          <Form.Item name="description" label="Description (Optional)">
            <Input placeholder="What's this transfer for?" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isLoading}>
              Send Money
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default TransferMoneyModal;
