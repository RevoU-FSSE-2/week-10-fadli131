const { Router } = require("express");
const {
  createTransfer,
  getTransfer,
  updateTransfer,
  deleteTransfer,
  getTransferHistory,
} = require("../service/transfer-service.js");
const authorizationMiddleware = require("../middleware/authorization-middleware");

const transferRouter = Router();

transferRouter.post("/", createTransfer);
transferRouter.get("/", getTransfer);

transferRouter.patch(
  "/:id",
  authorizationMiddleware(["approver", "admin"]),
  updateTransfer
);

transferRouter.delete(
  "/:id",
  authorizationMiddleware(["admin"]),
  deleteTransfer
);
transferRouter.get(
  "/history",
  authorizationMiddleware(["admin"]),
  getTransferHistory
);

module.exports = transferRouter;
