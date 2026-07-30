const UserRepository = require("../repositories/user.repository");
const { Conflict, NotFound } = require("../../core/errors/errors");

class UserService {
  async registerUser(user) {
    const existingUser = await UserRepository.findByEmail(user.email);
    if (existingUser) throw new Conflict("User already exists!");
    return UserRepository.createUser(user);
  }

  async getAllUsers() {
    return UserRepository.getAllUsers();
  }

  async getUserRole(email) {
    const user = await UserRepository.findByEmail(email);
    return user ? user.role : "user";
  }

  async updateUserRole(userId, role) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new NotFound("User not found!");
    return UserRepository.updateById(userId, { role });
  }

  async suspendUser(userId, reason, feedback = "") {
    const user = await UserRepository.findById(userId);
    if (!user) throw new NotFound("User not found!");

    return UserRepository.updateById(userId, {
      status: "suspended",
      suspend: { isSuspended: true, reason, feedback },
    });
  }

  async updateStatus(userId, status, reason = "", feedback = "") {
    const user = await UserRepository.findById(userId);
    if (!user) throw new NotFound("User not found!");

    const updateObj = { status };
    if (status === "suspended") {
      updateObj.suspend = { isSuspended: true, reason, feedback };
    } else {
      updateObj.suspend = { isSuspended: false, reason: "", feedback: "" };
    }

    return UserRepository.updateById(userId, updateObj);
  }

  async getUserByUid(uid) {
    const user = await UserRepository.getUserByUid(uid);
    if (!user) throw new NotFound("User not found!");
    return user;
  }

  async getUserByEmail(email) {
    return UserRepository.findByEmail(email);
  }
}

module.exports = new UserService();
