const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SIGN } = require("../config/jwt.js");

const register = async (req, res) => {
  const { username, password, role } = req.body;

  // const acceptedRoles = ["maker", "approver", "admin"];

  // if (!acceptedRoles.includes(role)) {
  //   return res.status(400).json({ error: "Invalid role" });
  // }

  try {
    const user = await req.db.collection("users").findOne({ username });

    if (user) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await req.db
      .collection("users")
      .insertOne({ username, password: hashedPassword, role });
    res.status(200).json({
      message: "User successfully registered",
      data: newUser,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await req.db.collection("users").findOne({ username });

    if (!user) {
      throw new Error("Username does not exist");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      const token = jwt.sign(
        { username: user.username, id: user._id, role: user.role },
        JWT_SIGN
      );

      console.log(token);

      res.status(200).json({
        message: "User successfully logged in",
        data: token,
      });
    } else {
      res.status(400).json({ error: "Password is incorrect" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
};
