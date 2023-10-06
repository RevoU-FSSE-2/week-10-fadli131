const { ObjectId } = require("mongodb");

const createTransfer = async (req, res) => {
  const { amount, currency, sourceAccount, destinationAccount } = req.body;
  const { role } = req.user;

  if (role === "maker" || role === "admin" || role === "approver") {
    const existingOrder = await req.db
      .collection("orders")
      .findOne({ menuItemId: req.body.menuItemId, status: "approved" }); 

    if (!existingOrder !== "pending") {
      return res.status(400).json({ error: "No pending order found for this maker" }); 
    }

    const newTransfer = {
      menuItemId: req.body.menuItemId,  
      amount,
      currency,
      sourceAccount,
      destinationAccount,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await req.db.collection("transfer").insertOne(newTransfer);
    res.status(200).json({ newTransfer });
  } else {
    res.status(403).json({ error: "Permission denied" });
  }
};

async function getTransfer(req, res) {
  const transfer = await req.db
    .collection("transfer")
    .find({
      $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }],
    })
    .toArray();

  res.status(200).json(transfer);
}

const updateTransfer = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // if (status !== "approved" && status !== "rejected") {
  //   return res.status(400).json({ error: "Invalid status" });
  // }

  try {
    const existingTransfer = await req.db
      .collection("transfer")
      .findOne({ _id: new ObjectId(id) });

    if (!existingTransfer) {
      return res.status(404).json({ error: "Transfer not found" });
    }

    if (existingTransfer.status !== "pending") {
      return res
        .status(403)
        .json({ error: "Only pending transfer can be updated" });
    }

    const result = await req.db
      .collection("transfer")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status } });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Transfer not found" });
    }

    if (result.modifiedCount === 1) {
      return res
        .status(200)
        .json({ message: "Transfer status updated successfully" });
    }

    return res.status(400).json({ error: "Could not update transfer" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `An error occurred: ${error.message}` });
  }
};

const deleteTransfer = async (req, res) => {
  const transferId = req.params.id;

  try {
    const decodedToken = req.user;

    if (decodedToken.role !== "admin") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const transfer = await req.db
      .collection("transfer")
      .findOne({ _id: new ObjectId(transferId) });

    if (!transfer) {
      res.status(404).json({ message: "Transfer not found" });
      return;
    }

    if (transfer.status !== "pending") {
      res
        .status(403)
        .json({ message: "Only pending transfer can be deleted" });
      return;
    }

    const result = await req.db
      .collection("transfer")
      .updateOne(
        { _id: new ObjectId(transferId) },
        { $set: { isDeleted: true } }
      );

    if (result.modifiedCount === 0) {
      res
        .status(404)
        .json({ message: "Transfer not found or already deleted" });
      return;
    }

    res.status(200).json({ message: "Transfer soft deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  } 
};

const getTransferHistory = async (req, res) => {
  try {
    const decodedToken = req.user;

    if (decodedToken.role !== "admin") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    const status = req.query.status
      ? Array.isArray(req.query.status)
        ? req.query.status
        : [req.query.status]
      : null;

    let query = {
      isDeleted: { $ne: true },
    };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate.setHours(0, 0, 0, 0));
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate.setHours(23, 59, 59, 999));
      }
    }

    if (status) {
      query.status = { $in: status };
    }

    const transfer = await req.db
      .collection("transfer")
      .find(query)
      .toArray();
    res.status(200).json(transfer);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const createOrder = async (req, res) => {
  const { menuItemId, quantity } = req.body;
  const { role } = req.user;

  if (role === "maker") {
    const newOrder = {
      menuItemId,
      quantity,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await req.db.collection("orders").insertOne(newOrder);
    res.status(200).json({ newOrder });
  } else {
    res.status(403).json({ error: "Orders Cannot Proccessed" });
  }
};

const getOrders = async (req, res) => {
  const orders = await req.db
    .collection("orders")
    .find({
      $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }],
    })
    .toArray();

  res.status(200).json(orders);
};

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const existingOrder = await req.db
      .collection("orders")
      .findOne({ _id: new ObjectId(id) });

    if (!existingOrder) {
      return res.status(404).json({ error: "Orders Cannot be Found" });
    }

    if (existingOrder.status !== "pending") {
      return res
        .status(403)
        .json({ error: "Just Pending Orders Can Update" });
    }

    const result = await req.db
      .collection("orders")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status } });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Orders Cannot be Found" });
    }

    if (result.modifiedCount === 1) {
      return res
        .status(200)
        .json({ message: "Orders Update Succeess" });
    }

    return res.status(400).json({ error: "Cannot Update Orders" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal server error: ${error.message}` });
  }
};

const deleteOrder = async (req, res) => {
  const orderId = req.params.id;

  try {
    const decodedToken = req.user;

    if (decodedToken.role !== "admin") {
      res.status(403).json({ error: "Rejected" });
      return;
    }

    const order = await req.db
      .collection("orders")
      .findOne({ _id: new ObjectId(orderId) });

    if (!order) {
      res.status(404).json({ message: "Orders Cannot be Found" });
      return;
    }

    if (order.status !== "pending") {
      res.status(403).json({ message: "Just Pending Orders Can Deleted" });
      return;
    }

    const result = await req.db
      .collection("orders")
      .updateOne({ _id: new ObjectId(orderId) }, { $set: { isDeleted: true } });

    if (result.modifiedCount === 0) {
      res.status(404).json({ message: "Order not found or has been deleted" });
      return;
    }

    res.status(200).json({ message: "Order temporarily deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createTransfer,
  getTransfer,
  updateTransfer,
  deleteTransfer,
  getTransferHistory,
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder
};
