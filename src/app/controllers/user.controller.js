const UserService = require("../services/user.service");
const { BadRequest, NotFound } = require("../../core/errors/errors");
const {
  validateRegisterUser,
  validateUpdateRole,
  validateSuspend,
} = require("../validators/user.validator");

class UserController {
  async createUser(req, res, next) {
    try {
      const validation = validateRegisterUser(req.body);
      if (!validation.valid) throw new BadRequest(validation.message);

      const { uid, name, email, photoURL, role, status } = req.body;

      const newUser = {
        uid: uid.trim(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        photoURL: photoURL || "",
        role: role.toLowerCase() || "buyer",
        status: status ? status.toLowerCase() : "pending",
        suspend: { isSuspended: false, reason: "", feedback: "" },
        createdAt: new Date(),
      };

      const result = await UserService.registerUser(newUser);

      res
        .status(201)
        .json({ message: "User added successfully!", id: result.insertedId });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getUserRole(req, res, next) {
    try {
      const { email } = req.params;
      if (!email?.trim()) throw new BadRequest("Email is required!");

      const role = await UserService.getUserRole(email.trim().toLowerCase());
      res.json({ role });
    } catch (error) {
      next(error);
    }
  }

  async getUserByUid(req, res, next) {
    try {
      const { uid } = req.params;
      if (!uid?.trim()) throw new BadRequest("UID is required!");

      const user = await UserService.getUserByUid(uid.trim());
      if (!user) throw new NotFound("User not found!");

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const validation = validateUpdateRole(role);
      if (!validation.valid) throw new BadRequest(validation.message);

      const updated = await UserService.updateUserRole(id, role.toLowerCase());
      res.json({ message: "User role updated successfully!", updated });
    } catch (error) {
      next(error);
    }
  }

  async suspendUser(req, res, next) {
    try {
      const { id } = req.params;
      const { reason, feedback } = req.body;

      const validation = validateSuspend(reason, feedback);
      if (!validation.valid) throw new BadRequest(validation.message);

      const updated = await UserService.suspendUser(
        id,
        reason.trim(),
        feedback?.trim() || "",
      );
      res.json({ message: "User suspended successfully!", updated });
    } catch (error) {
      next(error);
    }
  }

  async updateUserStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, reason = "", feedback = "" } = req.body;

      if (
        !status?.trim() ||
        !["active", "suspended"].includes(status.toLowerCase())
      ) {
        throw new BadRequest("Status must be 'active' or 'suspended'!");
      }

      if (status.toLowerCase() === "suspended") {
        const validation = validateSuspend(reason, feedback);
        if (!validation.valid) throw new BadRequest(validation.message);
      }

      const updated = await UserService.updateStatus(
        id,
        status.toLowerCase(),
        reason?.trim() || "",
        feedback?.trim() || "",
      );
      res.json({ message: `User status updated to ${status}!`, updated });
    } catch (error) {
      next(error);
    }
  }

  async getMyStatus(req, res, next) {
    try {
      const email = req.user.email;
      const user = await UserService.getUserByEmail(email);
      if (!user) return res.status(404).json({ status: "unknown" });
      res.json({ status: user.status });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
