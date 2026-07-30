// Statistics Controller - Handle Dashboard Statistics Requests
const StatsService = require("../services/stats.service");

class StatsController {
  // Get Admin Dashboard Statistics
  async getAdminStats(req, res, next) {
    try {
      const stats = await StatsService.getAdminStats();
      res.json(stats);
    } catch (err) {
      next(err);
    }
  }

  // Get Manager Dashboard Statistics
  async getManagerStats(req, res, next) {
    try {
      const managerEmail = req.user.email;
      const stats = await StatsService.getManagerStats(managerEmail);
      res.json(stats);
    } catch (err) {
      next(err);
    }
  }

  // Get Buyer Dashboard Statistics
  async getBuyerStats(req, res, next) {
    try {
      const userEmail = req.user.email;
      const stats = await StatsService.getBuyerStats(userEmail);
      res.json(stats);
    } catch (err) {
      next(err);
    }
  }

  // Get Order Chart Data For Admin
  async getOrderChartData(req, res, next) {
    try {
      const chartData = await StatsService.getOrderChartData();
      res.json(chartData);
    } catch (err) {
      next(err);
    }
  }

  // Get Order Status Distribution
  async getOrderStatusDistribution(req, res, next) {
    try {
      const distribution = await StatsService.getOrderStatusDistribution();
      res.json(distribution);
    } catch (err) {
      next(err);
    }
  }

  // Get Recent Orders For Dashboard
  async getRecentOrders(req, res, next) {
    try {
      const { limit = 5 } = req.query;
      const orders = await StatsService.getRecentOrders(+limit);
      res.json(orders);
    } catch (err) {
      next(err);
    }
  }

  // Get Revenue Chart Data
  async getRevenueChartData(req, res, next) {
    try {
      const revenueData = await StatsService.getRevenueChartData();
      res.json(revenueData);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new StatsController();
