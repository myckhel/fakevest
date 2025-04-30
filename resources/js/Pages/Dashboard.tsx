import React, { useEffect } from "react";
import {
  useAuthUser,
  usePortfolio,
  useSavingsList,
  useSavingsLoading,
  useDarkMode,
} from "@/Stores";
import useAuthStore from "@/Stores/authStore";
import useSavingsStore from "@/Stores/savingsStore";
import useUIStore from "@/Stores/uiStore";

const Dashboard = () => {
  // Access state from individual selectors to prevent unnecessary re-renders
  const user = useAuthUser();
  const portfolio = usePortfolio();
  const savings = useSavingsList();
  const isLoading = useSavingsLoading();
  const darkMode = useDarkMode();

  // Access actions directly from store
  const { checkAuth } = useAuthStore();
  const { fetchPlans, fetchSavings, fetchPortfolio } = useSavingsStore();
  const { showToast, toggleDarkMode } = useUIStore();

  // Initialize data when component mounts
  useEffect(() => {
    const initData = async () => {
      try {
        // Check authentication status
        await checkAuth();

        // Fetch plans, savings, and portfolio data in parallel
        await Promise.all([fetchPlans(), fetchSavings(), fetchPortfolio()]);
      } catch (error) {
        console.error("Error initializing dashboard data:", error);
        showToast("Failed to load dashboard data. Please try again.", "error");
      }
    };

    initData();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div
      className={`p-6 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <div className="flex items-center">
            {user && (
              <div className="mr-4">
                Welcome, <span className="font-semibold">{user.fullname}</span>
              </div>
            )}

            <button
              onClick={toggleDarkMode}
              className={`px-4 py-2 rounded-md ${
                darkMode
                  ? "bg-yellow-500 text-gray-900"
                  : "bg-gray-800 text-white"
              }`}
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Portfolio Summary */}
            {portfolio && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div
                  className={`p-6 rounded-lg shadow ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h2 className="text-lg font-semibold mb-2">Total Savings</h2>
                  <p className="text-3xl font-bold text-blue-600">
                    ₦{portfolio.totalSavings.toLocaleString()}
                  </p>
                </div>

                <div
                  className={`p-6 rounded-lg shadow ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h2 className="text-lg font-semibold mb-2">Wallet Balance</h2>
                  <p className="text-3xl font-bold text-green-600">
                    ₦{portfolio.walletBalance.toLocaleString()}
                  </p>
                </div>

                <div
                  className={`p-6 rounded-lg shadow ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <h2 className="text-lg font-semibold mb-2">
                    Monthly Savings
                  </h2>
                  <p className="text-3xl font-bold text-purple-600">
                    ₦{portfolio.stats.monthly.toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Savings List */}
            <div
              className={`p-6 rounded-lg shadow ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h2 className="text-xl font-semibold mb-4">Your Savings</h2>

              {savings.length === 0 ? (
                <p className="text-gray-500">
                  No savings found. Start saving today!
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr
                        className={`text-left ${
                          darkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        <th className="pb-3">Description</th>
                        <th className="pb-3">Plan</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Target</th>
                        <th className="pb-3">Balance</th>
                        <th className="pb-3">Maturity Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {savings.map((saving) => (
                        <tr
                          key={saving.id}
                          className={`border-t ${
                            darkMode ? "border-gray-700" : "border-gray-200"
                          }`}
                        >
                          <td className="py-3">{saving.desc}</td>
                          <td className="py-3">{saving.plan?.name}</td>
                          <td className="py-3">
                            ₦{saving.amount.toLocaleString()}
                          </td>
                          <td className="py-3">
                            ₦{saving.target.toLocaleString()}
                          </td>
                          <td className="py-3">
                            ₦{saving.wallet?.balance.toLocaleString() || 0}
                          </td>
                          <td className="py-3">
                            {new Date(
                              saving.maturity_date
                            ).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
