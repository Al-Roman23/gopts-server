// Statistics Service - Business Logic For Dashboard Statistics
const StatsRepository = require("../repositories/stats.repository");

class StatsService {
  // Get Admin Dashboard Statistics
  async getAdminStats() {
    const [
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
      ordersByStatus,
    ] = await Promise.all([
      StatsRepository.getTotalOrders(),
      StatsRepository.getTotalProducts(),
      StatsRepository.getTotalUsers(),
      StatsRepository.getTotalRevenue(),
      StatsRepository.getOrdersByStatus(),
    ]);

    return {
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
      ordersByStatus,
    };
  }

  // Get Manager Dashboard Statistics
  async getManagerStats(managerEmail) {
    const [
      totalProducts,
      pendingOrders,
      approvedOrders,
      completedOrders,
      totalRevenue,
    ] = await Promise.all([
      StatsRepository.getProductsByManager(managerEmail),
      StatsRepository.getOrdersCountByManagerAndStatus(managerEmail, "pending"),
      StatsRepository.getOrdersCountByManagerAndStatus(
        managerEmail,
        "approved",
      ),
      StatsRepository.getOrdersCountByManagerAndStatus(
        managerEmail,
        "completed",
      ),
      StatsRepository.getRevenueByManager(managerEmail),
    ]);

    return {
      totalProducts,
      pendingOrders,
      approvedOrders,
      completedOrders,
      totalRevenue,
    };
  }

  // Get Buyer Dashboard Statistics
  async getBuyerStats(userEmail) {
    const [
      totalOrders,
      pendingOrders,
      approvedOrders,
      completedOrders,
      totalSpent,
    ] = await Promise.all([
      StatsRepository.getOrdersCountByUser(userEmail),
      StatsRepository.getOrdersCountByUserAndStatus(userEmail, "pending"),
      StatsRepository.getOrdersCountByUserAndStatus(userEmail, "approved"),
      StatsRepository.getOrdersCountByUserAndStatus(userEmail, "completed"),
      StatsRepository.getTotalSpentByUser(userEmail),
    ]);

    return {
      totalOrders,
      pendingOrders,
      approvedOrders,
      completedOrders,
      totalSpent,
    };
  }

  // Get Order Chart Data For Last 6 Months
  async getOrderChartData() {
    const monthlyData = await StatsRepository.getMonthlyOrderData();
    return monthlyData;
  }

  // Get Order Status Distribution
  async getOrderStatusDistribution() {
    const distribution = await StatsRepository.getOrderStatusDistribution();
    return distribution;
  }

  // Get Recent Orders
  async getRecentOrders(limit = 5) {
    const orders = await StatsRepository.getRecentOrders(limit);
    return orders;
  }

  // Get Revenue Chart Data
  async getRevenueChartData() {
    const revenueData = await StatsRepository.getMonthlyRevenueData();
    return revenueData;
  }
}

module.exports = new StatsService();
