import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Modal, Form, Input, Button, Tabs } from "antd";
import {
  useActiveSaving,
  useSavingHistory,
  useSavingsLoading,
  useDarkMode,
} from "@/Stores";
import useSavingsStore from "@/Stores/savingsStore";
import useUIStore from "@/Stores/uiStore";

const { TabPane } = Tabs;

const SavingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const savingId = parseInt(id as string);

  // Use selector hooks for targeted re-renders
  const activeSaving = useActiveSaving();
  const savingHistory = useSavingHistory();
  const isLoading = useSavingsLoading();
  const darkMode = useDarkMode();

  // Access actions directly from store
  const { getSaving, getSavingHistory, depositToSaving, withdrawFromSaving } =
    useSavingsStore();
  const { showToast } = useUIStore();

  // Local state for modals
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [depositForm] = Form.useForm();
  const [withdrawForm] = Form.useForm();

  useEffect(() => {
    const loadSavingData = async () => {
      try {
        // Fetch saving details and history in parallel
        await Promise.all([getSaving(savingId), getSavingHistory(savingId)]);
      } catch (error) {
        console.error("Error loading saving data:", error);
        showToast("Failed to load saving details", "error");
      }
    };

    loadSavingData();
  }, [savingId]);

  const handleDeposit = async (values: { amount: number }) => {
    try {
      await depositToSaving(savingId, values.amount);
      setDepositModalVisible(false);
      depositForm.resetFields();
      showToast("Deposit successful", "success");
    } catch (error) {
      console.error("Deposit failed:", error);
      showToast("Deposit failed. Please try again.", "error");
    }
  };

  const handleWithdraw = async (values: { amount: number; pin: string }) => {
    try {
      await withdrawFromSaving(savingId, values.amount, values.pin);
      setWithdrawModalVisible(false);
      withdrawForm.resetFields();
      showToast("Withdrawal successful", "success");
    } catch (error) {
      console.error("Withdrawal failed:", error);
      showToast("Withdrawal failed. Please try again.", "error");
    }
  };

  if (isLoading || !activeSaving) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`p-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white"
      } rounded-lg shadow`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{activeSaving.desc}</h1>
        <div className="flex space-x-4">
          <Button
            type="primary"
            onClick={() => setDepositModalVisible(true)}
            className="bg-green-500 hover:bg-green-600 border-green-500"
          >
            Deposit
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => setWithdrawModalVisible(true)}
          >
            Withdraw
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          className={`p-4 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <h3 className="text-sm text-gray-500 dark:text-gray-400">
            Current Balance
          </h3>
          <p className="text-2xl font-bold text-green-600">
            ₦{activeSaving.wallet?.balance.toLocaleString() || 0}
          </p>
        </div>

        <div
          className={`p-4 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <h3 className="text-sm text-gray-500 dark:text-gray-400">
            Target Amount
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            ₦{activeSaving.target.toLocaleString()}
          </p>
        </div>

        <div
          className={`p-4 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <h3 className="text-sm text-gray-500 dark:text-gray-400">
            Maturity Date
          </h3>
          <p className="text-2xl font-bold text-purple-600">
            {new Date(activeSaving.maturity_date).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Saving Details</h2>
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Plan</p>
            <p className="font-medium">{activeSaving.plan?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Interest Rate
            </p>
            <p className="font-medium">
              {activeSaving.plan?.interest}% per annum
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Created On
            </p>
            <p className="font-medium">
              {new Date(activeSaving.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <p
              className={`font-medium ${
                activeSaving.status === "active"
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {activeSaving.status.charAt(0).toUpperCase() +
                activeSaving.status.slice(1)}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultActiveKey="transactions" className="mt-6">
        <TabPane tab="Transaction History" key="transactions">
          <div className="overflow-x-auto">
            {savingHistory.length === 0 ? (
              <p className="py-4 text-gray-500">
                No transactions found for this saving.
              </p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr
                    className={`text-left ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Balance After</th>
                  </tr>
                </thead>
                <tbody>
                  {savingHistory.map((item) => (
                    <tr
                      key={item.id}
                      className={`border-t ${
                        darkMode ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <td className="py-3">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            item.type === "deposit"
                              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                              : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                          }`}
                        >
                          {item.type.charAt(0).toUpperCase() +
                            item.type.slice(1)}
                        </span>
                      </td>
                      <td className="py-3">₦{item.amount.toLocaleString()}</td>
                      <td className="py-3">
                        ₦{item.balance_after.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </TabPane>
      </Tabs>

      {/* Deposit Modal */}
      <Modal
        title="Deposit to Saving"
        open={depositModalVisible}
        footer={null}
        onCancel={() => setDepositModalVisible(false)}
      >
        <Form form={depositForm} layout="vertical" onFinish={handleDeposit}>
          <Form.Item
            name="amount"
            label="Amount to Deposit"
            rules={[
              { required: true, message: "Please enter deposit amount" },
              {
                type: "number",
                min: 100,
                message: "Amount must be at least ₦100",
              },
            ]}
          >
            <Input type="number" prefix="₦" placeholder="0.00" />
          </Form.Item>

          <div className="flex justify-end">
            <Button
              onClick={() => setDepositModalVisible(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="bg-blue-500">
              Confirm Deposit
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        title="Withdraw from Saving"
        open={withdrawModalVisible}
        footer={null}
        onCancel={() => setWithdrawModalVisible(false)}
      >
        <Form form={withdrawForm} layout="vertical" onFinish={handleWithdraw}>
          <Form.Item
            name="amount"
            label="Amount to Withdraw"
            rules={[
              { required: true, message: "Please enter withdrawal amount" },
              {
                type: "number",
                min: 100,
                message: "Amount must be at least ₦100",
              },
              {
                type: "number",
                max: activeSaving.wallet?.balance || 0,
                message: "Amount cannot exceed available balance",
              },
            ]}
          >
            <Input type="number" prefix="₦" placeholder="0.00" />
          </Form.Item>

          <Form.Item
            name="pin"
            label="Transaction PIN"
            rules={[
              { required: true, message: "Please enter your transaction PIN" },
              { len: 4, message: "PIN must be 4 digits" },
            ]}
          >
            <Input.Password maxLength={4} placeholder="****" />
          </Form.Item>

          <div className="flex justify-end">
            <Button
              onClick={() => setWithdrawModalVisible(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button type="primary" danger htmlType="submit">
              Confirm Withdrawal
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default SavingDetail;
