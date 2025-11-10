const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const courierRoutes = require("./routes/courierRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

async function startServer() {
  try {
    await connectDB();
    console.log("Database connected");

    // Routes
    app.use("/api/v1/users", userRoutes);
    app.use("/api/v1/products", productRoutes);
    app.use("/api/v1/carts", cartRoutes);
    app.use("/api/v1/payments", paymentRoutes);
    app.use("/api/v1/courier", courierRoutes);
    app.use("/api/v1/employee", employeeRoutes);
    app.use("/api/v1/attendance", attendanceRoutes);
    app.use("/api/v1/message", messageRoutes);

    // Test route
    app.get("/", (req, res) => {
      res.json({ message: "Server is running smoothly" });
    });

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
