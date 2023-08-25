const { Router } = require('express');
const { getAllTransfer, createTransfer } = require('../service/transfer.service.js');

const transferRouter = Router();

transferRouter.get('/', getAllTransfer);
transferRouter.post('/', createTransfer);

module.exports = transferRouter;