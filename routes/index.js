const path = require("path");
const router = require("express").Router();
const apiRoutes = require("./api");
const authRoutes = require("./auth")
const userRoutes = require("./user")

// API routes
router.use("/api", apiRoutes);

// Auth routes
router.use("/auth", authRoutes)

router.use("/braintrain", userRoutes)

// If no API or auth routes are hit, send the React app
router.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

module.exports = router;