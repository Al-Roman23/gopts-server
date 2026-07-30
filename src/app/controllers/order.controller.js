const OrderService = require("../services/order.service");
const { BadRequest } = require("../../core/errors/errors");
const {
  validateOrder,
  validateTrackingLog,
} = require("../validators/order.validator");

class OrderController {
  async createOrder(req, res, next) {
    try {
      const validation = validateOrder(req.body);
      if (!validation.valid) throw new BadRequest(validation.message);

      const actor = req.user || { email: req.body.userEmail, role: "user" };
      const result = await OrderService.createOrder(req.body, actor);

      res.status(201).json({
        message: "Order placed successfully!",
        id: result.insertedId,
      });
    } catch (err) {
      next(err);
    }
  }

  async getMyOrders(req, res, next) {
    try {
      const userEmail = req.user.email;
      const result = await OrderService.getOrdersByUser(userEmail);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getUserOrders(req, res, next) {
    try {
      const { uid } = req.params;
      if (req.user.uid !== uid)
        return res.status(403).json({ message: "Forbidden!" });

      const result = await OrderService.getOrdersByUser(req.user.email);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getManagerOrders(req, res, next) {
    try {
      const managerEmail = req.user.email;
      const { page, limit, status } = req.query;

      const result = await OrderService.getOrdersByManager(
        managerEmail,
        +page || 1,
        +limit || 20,
        status,
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getPendingOrdersForManager(req, res, next) {
    try {
      const managerEmail = req.user.email;
      const { page, limit } = req.query;

      const result = await OrderService.getPendingOrdersByManager(
        managerEmail,
        +page || 1,
        +limit || 10,
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getApprovedOrdersForManager(req, res, next) {
    try {
      const managerEmail = req.user.email;
      const { page, limit } = req.query;

      const result = await OrderService.getApprovedOrdersByManager(
        managerEmail,
        +page || 1,
        +limit || 10,
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async approveOrder(req, res, next) {
    try {
      const { orderId } = req.params;
      await OrderService.approveOrder(orderId, req.user);
      res.json({ message: "Order approved successfully!" });
    } catch (err) {
      next(err);
    }
  }

  async rejectOrder(req, res, next) {
    try {
      const { orderId } = req.params;
      const { reason } = req.body;

      if (!reason?.trim()) throw new BadRequest("Reject reason is required!");

      await OrderService.rejectOrder(orderId, reason, req.user);
      res.json({ message: "Order rejected successfully!" });
    } catch (err) {
      next(err);
    }
  }

  async addTrackingLogToApprovedOrder(req, res, next) {
    try {
      const { orderId } = req.params;
      const validation = validateTrackingLog(req.body);
      if (!validation.valid) throw new BadRequest(validation.message);

      const result = await OrderService.addTrackingLog(orderId, req.body);
      res.json({ message: "Tracking log added successfully!", result });
    } catch (err) {
      next(err);
    }
  }

  async trackOrder(req, res, next) {
    try {
      const { orderId } = req.params;
      const order = await OrderService.getOrderById(orderId);
      res.json(order);
    } catch (err) {
      next(err);
    }
  }

  async getOrderByTrackingId(req, res, next) {
    try {
      const { trackingId } = req.params;
      const order = await OrderService.getOrderByTrackingId(trackingId);
      res.json(order);
    } catch (err) {
      next(err);
    }
  }

  async getAllOrders(req, res, next) {
    try {
      const { status, userEmail, page, limit } = req.query;

      const result = await OrderService.getAllOrders({
        status,
        userEmail,
        page: +page || 1,
        limit: +limit || 20,
      });

      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getOrderById(req, res, next) {
    try {
      const { orderId } = req.params;
      const order = await OrderService.getOrderById(orderId);
      res.json(order);
    } catch (err) {
      next(err);
    }
  }

  async updateOrderStatus(req, res, next) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      if (!status) throw new BadRequest("Status is required!");

      await OrderService.updateOrderStatus(orderId, status.toLowerCase());
      res.json({ message: "Order status updated successfully!" });
    } catch (err) {
      next(err);
    }
  }

  async getOrderDetails(req, res, next) {
    try {
      const { orderId } = req.params;
      const order = await OrderService.getOrderById(orderId);
      if (order.managerEmail !== req.user.email) {
        return res.status(403).json({
          message: "Forbidden: You are not authorized to view this order.",
        });
      }
      res.json(order);
    } catch (err) {
      next(err);
    }
  }

  async deleteOrder(req, res, next) {
    try {
      const { orderId } = req.params;
      await OrderService.deleteOrder(orderId);
      res.json({ message: "Order deleted successfully!" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new OrderController();
