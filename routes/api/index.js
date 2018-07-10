const router = require("express").Router();
const apiRoutes = require("./api-routes");

// sentiment routes
router.use("/sentiment", apiRoutes);

module.exports = router;