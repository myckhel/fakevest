import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";
import {
  Typography,
  Card,
  Button,
  Tabs,
  Space,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  WalletOutlined,
  BankOutlined,
  CreditCardOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import TransferMoneyModal from "@/Components/Features/Transfers/TransferMoneyModal";
import WithdrawFundsModal from "@/Components/Features/Withdrawals/WithdrawFundsModal";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

/**
 * Wallets page that shows user's wallets and financial accounts
 */
const Wallets = () => {
  // Local state for UI management
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
  const [isAddCardModalVisible, setIsAddCardModalVisible] = useState(false);
  const [isAddBankAccountModalVisible, setIsAddBankAccountModalVisible] =
    useState(false);

  // Handle modal visibility
  const handleOpenTransferModal = () => setIsTransferModalVisible(true);
  const handleCloseTransferModal = () => setIsTransferModalVisible(false);
  const handleOpenWithdrawModal = () => setIsWithdrawModalVisible(true);
  const handleCloseWithdrawModal = () => setIsWithdrawModalVisible(false);
  const handleOpenAddCardModal = () => setIsAddCardModalVisible(true);
  const handleCloseAddCardModal = () => setIsAddCardModalVisible(false);
  const handleOpenAddBankAccountModal = () =>
    setIsAddBankAccountModalVisible(true);
  const handleCloseAddBankAccountModal = () =>
    setIsAddBankAccountModalVisible(false);

  // Example wallet data
  const walletData = {
    balance: 25000.5,
    savingsBalance: 18750.25,
    investmentBalance: 6250.25,
  };

  // Example payment methods
  const bankAccounts = [
    { id: 1, name: "First Bank", accountNumber: "****1234", isDefault: true },
    { id: 2, name: "UBA", accountNumber: "****5678", isDefault: false },
  ];

  const cards = [
    {
      id: 1,
      type: "Visa",
      cardNumber: "****4321",
      expiryDate: "06/27",
      isDefault: true,
    },
    {
      id: 2,
      type: "Mastercard",
      cardNumber: "****8765",
      expiryDate: "12/26",
      isDefault: false,
    },
  ];

  return (
    <MainLayout>
      <Head title="Wallets" />

      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Title level={3} className="mb-2">
            My Wallets
          </Title>
          <Text type="secondary">
            Manage your wallets, cards and bank accounts
          </Text>
        </div>

        {/* Main Wallet Overview */}
        <Card
          className="mb-6 shadow bg-white dark:bg-gray-800"
          title={
            <div className="flex items-center gap-2">
              <WalletOutlined className="text-blue-600" />
              <span>Main Wallet</span>
            </div>
          }
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Statistic
                title="Total Balance"
                value={walletData.balance}
                precision={2}
                prefix="₦"
                valueStyle={{ color: "#3b8cb7" }}
              />
              <div className="mt-4">
                <Space>
                  <Button type="primary" onClick={handleOpenTransferModal}>
                    Transfer
                  </Button>
                  <Button onClick={handleOpenWithdrawModal}>Withdraw</Button>
                </Space>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title="Savings"
                value={walletData.savingsBalance}
                precision={2}
                prefix="₦"
                valueStyle={{ color: "#52c41a" }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title="Investments"
                value={walletData.investmentBalance}
                precision={2}
                prefix="₦"
                valueStyle={{ color: "#722ed1" }}
              />
            </Col>
          </Row>
        </Card>

        {/* Payment Methods */}
        <Card
          className="shadow bg-white dark:bg-gray-800"
          title="Payment Methods"
        >
          <Tabs defaultActiveKey="bankAccounts">
            <TabPane
              tab={
                <span>
                  <BankOutlined /> Bank Accounts
                </span>
              }
              key="bankAccounts"
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleOpenAddBankAccountModal}
                >
                  Add Bank Account
                </Button>
              }
            >
              {bankAccounts.length > 0 ? (
                <div className="space-y-4">
                  {bankAccounts.map((account) => (
                    <Card
                      key={account.id}
                      className="bg-gray-50 dark:bg-gray-700"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <BankOutlined />
                            <Text strong>{account.name}</Text>
                            {account.isDefault && (
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                Default
                              </span>
                            )}
                          </div>
                          <Text type="secondary">
                            Account: {account.accountNumber}
                          </Text>
                        </div>
                        <Space>
                          <Button size="small">Edit</Button>
                          {!account.isDefault && (
                            <Button size="small">Set Default</Button>
                          )}
                          {!account.isDefault && (
                            <Button size="small" danger>
                              Remove
                            </Button>
                          )}
                        </Space>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Text type="secondary">No bank accounts added yet</Text>
                  <div className="mt-4">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleOpenAddBankAccountModal}
                    >
                      Add Bank Account
                    </Button>
                  </div>
                </div>
              )}
            </TabPane>

            <TabPane
              tab={
                <span>
                  <CreditCardOutlined /> Cards
                </span>
              }
              key="cards"
            >
              {cards.length > 0 ? (
                <div className="space-y-4">
                  {cards.map((card) => (
                    <Card key={card.id} className="bg-gray-50 dark:bg-gray-700">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <CreditCardOutlined />
                            <Text strong>{card.type}</Text>
                            {card.isDefault && (
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                Default
                              </span>
                            )}
                          </div>
                          <Text type="secondary">
                            {card.cardNumber} • Expires {card.expiryDate}
                          </Text>
                        </div>
                        <Space>
                          {!card.isDefault && (
                            <Button size="small">Set Default</Button>
                          )}
                          {!card.isDefault && (
                            <Button size="small" danger>
                              Remove
                            </Button>
                          )}
                        </Space>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Text type="secondary">No cards added yet</Text>
                  <div className="mt-4">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleOpenAddCardModal}
                    >
                      Add Card
                    </Button>
                  </div>
                </div>
              )}
              <div className="mt-4">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleOpenAddCardModal}
                >
                  Add Card
                </Button>
              </div>
            </TabPane>
          </Tabs>
        </Card>

        {/* Modals */}
        <TransferMoneyModal
          visible={isTransferModalVisible}
          onClose={handleCloseTransferModal}
        />

        <WithdrawFundsModal
          visible={isWithdrawModalVisible}
          onClose={handleCloseWithdrawModal}
        />

        {/* TODO: Implement AddCardModal and AddBankAccountModal components */}
      </div>
    </MainLayout>
  );
};

export default Wallets;
