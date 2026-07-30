// Statistics Repository - Database Queries For Dashboard Statistics
const { getCollection } = require("../../config/db");

class StatsRepository {
  // Get Total Orders Count
  async getTotalOrders() {
    const orders = await getCollection("orders");
    return orders.countDocuments();
  }

  // Get Total Products Count
  async getTotalProducts() {
    const products = await getCollection("products");
    return products.countDocuments();
  }

  // Get Total Users Count
  async getTotalUsers() {
    const users = await getCollection("users");
    return users.countDocuments();
  }

  // Get Total Revenue From Paid Orders
  async getTotalRevenue() {
    const orders = await getCollection("orders");
    const result = await orders
      .aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ])
      .toArray();
    return result[0]?.total || 0;
  }

  // Get Orders By Status
  async getOrdersByStatus() {
    const orders = await getCollection("orders");
    const result = await orders
      .aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])
      .toArray();

    const statusMap = {};
    result.forEach((item) => {
      statusMap[item._id] = item.count;
    });
    return statusMap;
  }

  // Get Products Count By Manager
  async getProductsByManager(managerEmail) {
    const products = await getCollection("products");
    return products.countDocuments({ createdBy: managerEmail });
  }

  // Get Orders Count By Manager And Status
  async getOrdersCountByManagerAndStatus(managerEmail, status) {
    const orders = await getCollection("orders");
    return orders.countDocuments({ managerEmail, status });
  }

  // Get Revenue By Manager From Paid Orders
  async getRevenueByManager(managerEmail) {
    const orders = await getCollection("orders");
    const result = await orders
      .aggregate([
        { $match: { managerEmail, paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ])
      .toArray();
    return result[0]?.total || 0;
  }

  // Get Orders Count By User
  async getOrdersCountByUser(userEmail) {
    const orders = await getCollection("orders");
    return orders.countDocuments({ userEmail });
  }

  // Get Orders Count By User And Status
  async getOrdersCountByUserAndStatus(userEmail, status) {
    const orders = await getCollection("orders");
    return orders.countDocuments({ userEmail, status });
  }

  // Get Total Spent By User From Paid Orders
  async getTotalSpentByUser(userEmail) {
    const orders = await getCollection("orders");
    const result = await orders
      .aggregate([
        { $match: { userEmail, paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ])
      .toArray();
    return result[0]?.total || 0;
  }

  // Get Monthly Order Data For Chart
  async getMonthlyOrderData() {
    const orders = await getCollection("orders");
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const result = await orders
      .aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            orders: { $sum: 1 },
            revenue: {
              $sum: {
                $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$totalPrice", 0],
              },
            },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ])
      .toArray();

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return result.map((item) => ({
      month: monthNames[item._id.month - 1],
      orders: item.orders,
      revenue: item.revenue,
    }));
  }

  // Get Order Status Distribution For Pie Chart
  async getOrderStatusDistribution() {
    const orders = await getCollection("orders");
    const result = await orders
      .aggregate([{ $group: { _id: "$status", value: { $sum: 1 } } }])
      .toArray();

    const colors = {
      pending: "#F59E0B",
      approved: "#10B981",
      completed: "#3B82F6",
      rejected: "#EF4444",
      canceled: "#6B7280",
    };

    return result.map((item) => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.value,
      color: colors[item._id] || "#9CA3AF",
    }));
  }

  // Get Recent Orders For Dashboard Table
  async getRecentOrders(limit = 5) {
    const orders = await getCollection("orders");
    return orders
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .project({
        trackingId: 1,
        productName: 1,
        quantity: 1,
        status: 1,
        createdAt: 1,
        totalPrice: 1,
      })
      .toArray();
  }

  // Get Monthly Revenue Data For Line Chart
  async getMonthlyRevenueData() {
    const orders = await getCollection("orders");
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const result = await orders
      .aggregate([
        {
          $match: { createdAt: { $gte: sixMonthsAgo }, paymentStatus: "paid" },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            revenue: { $sum: "$totalPrice" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ])
      .toArray();

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return result.map((item) => ({
      month: monthNames[item._id.month - 1],
      revenue: item.revenue,
    }));
  }
}

module.exports = new StatsRepository();
