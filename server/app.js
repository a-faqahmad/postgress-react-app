const express = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient().$extends({
  query: {
    user: {
      $allOperations({ operation, args, query }) {
        if (["create", "update"].includes(operation) && args.data["password"]) {
          args.data["password"] = bcrypt.hashSync(args.data["password"], 10);
        }
        return query(args);
      },
    },
  },
});

const app = express();
app.use(cors());  // Enable CORS
app.use(express.json());
const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send("Welcome To my test app. Try another URL.");
});

app.post("/user", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "name, email and password are required" });
    }
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

app.put("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    if (!name || !email) {
      return res
        .status(400)
        .json({ error: "name, email and password are required" });
    }
    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        email
      },
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
