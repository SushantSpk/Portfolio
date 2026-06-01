const express = require("express");
const cors = require("cors");
require("dotenv").config({ quiet: true });

const publicRoutes = require("./routes/publicRoutes");
const profileRoutes = require("./routes/profileRoutes");
const projectRoutes = require("./routes/projectRoutes");
const messageRoutes = require("./routes/messageRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.use("/api", publicRoutes);
app.use("/api/admin/profile", profileRoutes);
app.use("/api/admin/projects", projectRoutes);
app.use("/api/admin/messages", messageRoutes);
app.use("/api/admin/upload", uploadRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found.",
  });
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || error.status || 500;

  res.status(statusCode).json({
    error: error.message || "Something went wrong.",
  });
});

if (require.main === module) {
  global.portfolioServer = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  global.portfolioServer.ref();
}

module.exports = app;
