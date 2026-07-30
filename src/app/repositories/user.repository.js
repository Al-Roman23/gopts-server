const { ObjectId } = require("mongodb");
const { getCollection } = require("../../config/db");

class UserRepository {
  async getAllUsers() {
    const usersCollection = await getCollection("users");
    return usersCollection.find({}).toArray();
  }

  async findByEmail(email) {
    if (!email?.trim()) return null;
    const usersCollection = await getCollection("users");
    return usersCollection.findOne({ email: email.trim().toLowerCase() });
  }

  async createUser(user) {
    const usersCollection = await getCollection("users");
    const now = new Date();
    return usersCollection.insertOne({
      ...user,
      createdAt: now,
      updatedAt: now,
    });
  }

  async findById(id) {
    if (!ObjectId.isValid(id)) return null;
    const usersCollection = await getCollection("users");
    return usersCollection.findOne({ _id: new ObjectId(id) });
  }

  async updateById(id, updateObj) {
    if (!ObjectId.isValid(id)) return null;
    const usersCollection = await getCollection("users");
    updateObj.updatedAt = new Date();
    return usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateObj },
    );
  }

  async getUserByUid(uid) {
    if (!uid?.trim()) return null;
    const usersCollection = await getCollection("users");
    return usersCollection.findOne({ uid: uid.trim() });
  }
}

module.exports = new UserRepository();
