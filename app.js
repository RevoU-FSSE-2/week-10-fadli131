require('dotenv').config();

const express = require('express');
const databaseMiddleware = require('./middleware/databaseMiddleware.js');
const authRouter = require('./routes/auth-route.js');
const transferRouter = require('./routes/transfer-route.js');
const authmiddleware = require('./middleware/authentication-middleware.js');
const swaggerUi = require("swagger-ui-express");
const yaml = require("yaml");
const fs = require("fs");
const OpenApiValidator = require("express-openapi-validator");
const router = express.Router();

const openApiPath = "doc/openapi.yaml";
const file = fs.readFileSync(openApiPath, "utf8");
const swaggerDocument = yaml.parse(file);

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Transfer Request Management API');
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(
  OpenApiValidator.middleware({
    apiSpec: openApiPath,
    validateRequests: true,
  })
);

app.use(databaseMiddleware);

app.use("/auth", authRouter);
app.use("/transfer", authmiddleware, transferRouter);

app.use((err, req, res, next) => {
  console.log(err, `<=================== error ==================`);
  res.status(err.status || 500).json({
    message: err.message,
    // errors: err.errors,
  });
});

app.listen(3002, () => {
    console.log("Server is running on port 3003");
  });
  