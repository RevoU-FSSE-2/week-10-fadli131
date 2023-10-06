const { Router } = require("express");
const {
  createTransfer,
  getTransfer,
  updateTransfer,
  deleteTransfer,
  getTransferHistory,
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder
} = require("../service/transfer-service.js");
const authorizationMiddleware = require("../middleware/authorization-middleware");

const transferRouter = Router();
const orderRouter = Router ();

transferRouter.post("/", createTransfer);
orderRouter.post("/", createOrder);
transferRouter.get("/", getTransfer);
orderRouter.get("/", getOrders);

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

orderRouter.patch(
  "/:id",
  authorizationMiddleware(["maker", "admin"]),
  updateOrder
);

orderRouter.delete(
  "/:id",
  authorizationMiddleware(["admin"]),
  deleteOrder
);

orderRouter.get(
  "/history",
  authorizationMiddleware(["admin"]),
  getOrders
);

module.exports = transferRouter;
module.exports = orderRouter;
