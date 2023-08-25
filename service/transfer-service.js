const { ObjectId } = require("mongodb");

const createTransfer = async (req, res) => {
  const { amount, currency, sourceAccount, destinationAccount } = req.body;
  const { role } = req.user;

  if (role === "maker" || role === "admin" || role === "approver") {
    const newTransfer = {
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

const getTransfer = async (req, res) => {
  const transfer = await req.db
    .collection("transfer")
    .find({
      $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }],
    })
    .toArray();

  res.status(200).json(transfer);
};

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

module.exports = {
  createTransfer,
  getTransfer,
  updateTransfer,
  deleteTransfer,
  getTransferHistory,
};
