import { useEffect, useState } from 'react';

import {
  BankOutlined,
  CreditCardOutlined,
  LockOutlined,
  PlusOutlined,
  UnlockOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { Head } from '@inertiajs/react';
import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Statistic,
  Tabs,
  Typography,
} from 'antd';

import AddCardModal from '@/Components/Features/Cards/AddCardModal';
import ManagePinModal from '@/Components/Features/PIN/ManagePinModal';
import TransferMoneyModal from '@/Components/Features/Transfers/TransferMoneyModal';
import WithdrawFundsModal from '@/Components/Features/Withdrawals/WithdrawFundsModal';
import MainLayout from '@/Layouts/MainLayout';
import useAuthStore from '@/Stores/authStore';
import usePaymentOptionsStore from '@/Stores/paymentOptionsStore';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

/**
 * Wallets page that shows user's wallets and financial accounts
 */
const Wallets = () => {
  // Use stores
  const { user } = useAuthStore();
  const { cards, fetchCards, deleteCard, setDefaultCard } =
    usePaymentOptionsStore();
  const hasPin = user?.has_pin;

  // Local state for UI management
  const [isTransferModalVisible, setIsTransferModalVisible] = useState(false);
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
  const [isAddCardModalVisible, setIsAddCardModalVisible] = useState(false);
  const [isManagePinModalVisible, setIsManagePinModalVisible] = useState(false);
  const [pinManagementMode, setPinManagementMode] = useState<
    'create' | 'update'
  >('create');

  // Use underscore prefix for unused state variables or handlers
  const [_isAddBankAccountModalVisible, setIsAddBankAccountModalVisible] =
    useState(false);
  const _handleCloseAddBankAccountModal = () =>
    setIsAddBankAccountModalVisible(false);

  // Fetch cards on component mount
  useEffect(() => {
    fetchCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle modal visibility
  const handleOpenTransferModal = () => setIsTransferModalVisible(true);
  const handleCloseTransferModal = () => setIsTransferModalVisible(false);
  const handleOpenWithdrawModal = () => setIsWithdrawModalVisible(true);
  const handleCloseWithdrawModal = () => setIsWithdrawModalVisible(false);
  const handleOpenAddCardModal = () => setIsAddCardModalVisible(true);
  const handleCloseAddCardModal = () => setIsAddCardModalVisible(false);
  const handleOpenAddBankAccountModal = () =>
    setIsAddBankAccountModalVisible(true);

  const handleCardAdded = () => {
    // Refresh cards list and close modal
    fetchCards();
    handleCloseAddCardModal();
  };

  // Handle deleting a card
  const handleDeleteCard = async (id: number) => {
    try {
      await deleteCard(id);
    } catch (err) {
      console.error('Failed to delete card:', err);
    }
  };

  // Handle setting a card as default
  const handleSetDefaultCard = async (id: number) => {
    try {
      await setDefaultCard(id);
    } catch (err) {
      console.error('Failed to set default card:', err);
    }
  };

  const handleOpenCreatePinModal = () => {
    setPinManagementMode('create');
    setIsManagePinModalVisible(true);
  };

  const handleOpenUpdatePinModal = () => {
    setPinManagementMode('update');
    setIsManagePinModalVisible(true);
  };

  const handleClosePinModal = () => setIsManagePinModalVisible(false);

  // Example wallet data
  const walletData = {
    balance: 25000.5,
    savingsBalance: 18750.25,
    investmentBalance: 6250.25,
  };

  // Example payment methods
  const bankAccounts = [
    { id: 1, name: 'First Bank', accountNumber: '****1234', isDefault: true },
    { id: 2, name: 'UBA', accountNumber: '****5678', isDefault: false },
  ];

  // Format payment option cards for display
  const formatCards = () => {
    if (!cards || cards.length === 0) {
      return [];
    }

    return cards.map((card) => {
      return {
        id: card.id,
        type: card.card_type || card.brand || 'Card',
        cardNumber: card.last4 ? `****${card.last4}` : '****',
        expiryDate:
          card.exp_month && card.exp_year
            ? `${card.exp_month}/${card.exp_year}`
            : 'XX/XX',
        isDefault: card.id === 1, // Placeholder logic - replace with actual default logic
        bank: card.bank || '',
      };
    });
  };

  const displayCards = formatCards();

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
                valueStyle={{ color: '#3b8cb7' }}
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
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title="Investments"
                value={walletData.investmentBalance}
                precision={2}
                prefix="₦"
                valueStyle={{ color: '#722ed1' }}
              />
            </Col>
          </Row>
        </Card>

        {/* Security Settings */}
        <Card
          className="mb-6 shadow bg-white dark:bg-gray-800"
          title={
            <div className="flex items-center gap-2">
              <LockOutlined className="text-blue-600" />
              <span>Security Settings</span>
            </div>
          }
        >
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <div className="flex justify-between items-center">
                <div>
                  <Title level={5}>Transaction PIN</Title>
                  <Text type="secondary">
                    {hasPin
                      ? 'Your transaction PIN is used to authorize money transfers and withdrawals.'
                      : 'Set up a transaction PIN to secure your transfers and withdrawals.'}
                  </Text>
                </div>
                <Button
                  type="primary"
                  icon={hasPin ? <UnlockOutlined /> : <LockOutlined />}
                  onClick={
                    hasPin ? handleOpenUpdatePinModal : handleOpenCreatePinModal
                  }
                >
                  {hasPin ? 'Update PIN' : 'Create PIN'}
                </Button>
              </div>
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

              {bankAccounts.length > 0 && (
                <div className="mt-4">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleOpenAddBankAccountModal}
                  >
                    Add Bank Account
                  </Button>
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
              {displayCards.length > 0 ? (
                <div className="space-y-4">
                  {displayCards.map((card) => (
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
                          {card.bank && (
                            <Text type="secondary" className="block">
                              Bank: {card.bank}
                            </Text>
                          )}
                        </div>
                        <Space>
                          {!card.isDefault && (
                            <Button
                              size="small"
                              onClick={() => handleSetDefaultCard(card.id)}
                            >
                              Set Default
                            </Button>
                          )}
                          {!card.isDefault && (
                            <Button
                              size="small"
                              danger
                              onClick={() => handleDeleteCard(card.id)}
                            >
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

              {displayCards.length > 0 && (
                <div className="mt-4">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleOpenAddCardModal}
                  >
                    Add Card
                  </Button>
                </div>
              )}
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

        <ManagePinModal
          visible={isManagePinModalVisible}
          onClose={handleClosePinModal}
          mode={pinManagementMode}
        />

        <AddCardModal
          visible={isAddCardModalVisible}
          onClose={handleCloseAddCardModal}
          onSuccess={handleCardAdded}
        />

        {/* TODO: Implement AddBankAccountModal component */}
      </div>
    </MainLayout>
  );
};

export default Wallets;
