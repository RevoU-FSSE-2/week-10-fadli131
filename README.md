# Welcome to Week 10
RESTful API with expressjs, nodejs, and swagger

## 👋 Keep In Touch With Me 
**fadliaryadinata011@gmail.com**

## Authors

👤 **Fadli Aryadinata**

- GitHub: [@fadli131](https://github.com/fadli131)
- Deployment Link (https://week9-fadli.cyclic.cloud/karyawan)

### Getting Started

## RESTful Principles

The Financial Tracking API adheres to the principles of RESTful design to ensure a standardized and user-friendly experience:

1. **Resources**: The API treats financial entities such as transactions and accounts as resources, each accessible through a unique endpoint.

2. **HTTP Methods**: HTTP methods such as GET, POST, PUT, PATCH, and DELETE are employed to interact with these resources.

3. **Representation**: Data is exchanged in JSON format, allowing for structured and easy-to-parse information.

### Language used 
- Javascript (NodeJS & ExpressJS)
- MongoDB (NoSQL Database)

### Tools
- VS Code
- Git and Github    
- Swagger UI
- Postman
- MongoDB

### HTTP Methods

**Register New User**

```http
POST | https://localhost:3002/auth/register
```

**Log In**

```http
POST | https://localhost:3002/auth/register
```

**Post Transfer**

```http
POST | https://localhost:3002/v1/transfer


**Get All Transfer**

```http
POST | https://localhost:3002/v1/transfer/s
```

**Patching Transfer Status**

```http
PATCH | https://localhost:3002/v1/transfer/:id
```

**Delete Transfer by ID**

```http
DELETE | https://localhost:3002/v1/transfer/:id
```